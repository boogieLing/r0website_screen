import {makeAutoObservable, computed} from "mobx";
import testDataStore from "./testDataStore";
import {listCategories, getCategoryImages, addImageToCategory} from "@/request/categoryApi";
import {addImageToCache as cacheImageToLocal, deleteImage, getRandomCachedImage} from '@/request/imageApi';

// 正式环境图片分页大小
const DEFAULT_PAGE_SIZE = 60;
// 首次进入分类时的首屏加载张数（越小越快进入，后续后台预取）
const INITIAL_PAGE_SIZE = 12;
// 后台自动预取的最多页数（避免一次性打满全部图片）
const MAX_PREFETCH_PAGES = 2;

// 前端需要隐藏的分类键列表（使用归一化对比）
const HIDDEN_CATEGORY_KEYS = ['alum_local_cache'];

/**
 * SomniumNexusStore - 正式环境图片数据管理
 * 管理somnium/nexus页面的图片分类和数据，支持测试/正式环境切换
 */
class SomniumNexusStore {
    _selectedCategory = null;
    _selectedSubCategory = null;
    _selectedImage = null;
    _hoveredImage = null;
    _isModalOpen = false;
    _hasSubMenu = false;
    _subCategories = [];
    _hoverSubCategories = [];

    // 正式环境的图片数据（初始为空，需要从外部加载）
    _productionGalleryData = {};

    // 用户创建的项目数据（增量数据）
    _userProjects = {};

    // 每个分类的分页状态
    _categoryPageState = {};

    // 使用测试数据的标识
    _useTestData = false;

    constructor() {
        makeAutoObservable(this, {
            selectedCategory: computed,
            selectedSubCategory: computed,
            selectedImage: computed,
            hoveredImage: computed,
            isModalOpen: computed,
            hasSubMenu: computed,
            subCategories: computed,
            hoverSubCategories: computed,
            galleryCategories: computed,
            categories: computed,
            currentCategory: computed,
            currentCategoryImages: computed,
            isUsingTestData: computed,
            isProductionEnvironment: computed
        });

        // 初始化时从本地存储加载用户项目
        this.loadUserProjectsFromLocal();
    }

    /**
     * 统一标准化分类 settings，兼容后端 Settings/LayoutMode 大小写
     */
    normalizeSettings(rawSettings = {}) {
        const layoutModeFromServer = rawSettings.layoutMode || rawSettings.LayoutMode;
        let normalizedSettings = {...rawSettings};

        if (layoutModeFromServer) {
            const normalized = String(layoutModeFromServer).trim().toLowerCase();
            const storedLayoutMode = normalized === 'freeform' ? 'freedom' : normalized;
            normalizedSettings = {
                ...normalizedSettings,
                layoutMode: storedLayoutMode,
                LayoutMode: storedLayoutMode
            };
        }

        return normalizedSettings;
    }

    normalizeKeyForCompare(value) {
        return String(value || '').trim().toLowerCase();
    }

    isHiddenCategory(key, categoryData) {
        const candidates = [key];
        if (categoryData) {
            if (categoryData.remoteId) {
                candidates.push(categoryData.remoteId);
            }
            if (categoryData.originalKey) {
                candidates.push(categoryData.originalKey);
            }
            if (Array.isArray(categoryData.aliasCategoryIds)) {
                candidates.push(...categoryData.aliasCategoryIds);
            }
        }

        return candidates.some((candidate) => {
            const normalized = this.normalizeKeyForCompare(candidate);
            return HIDDEN_CATEGORY_KEYS.some((hidden) => this.normalizeKeyForCompare(hidden) === normalized);
        });
    }

    /**
     * 根据分类名称推导二级菜单：按斜杠分割，首段为主标题，其余为子菜单
     */
    parseCategoryNameForMenu(rawName) {
        const name = (rawName || '').trim();
        if (!name) {
            return {
                title: rawName,
                hasSubMenu: false,
                subCategories: []
            };
        }

        const parts = name.split('/').map((part) => part.trim()).filter(Boolean);
        if (parts.length <= 1) {
            return {
                title: name,
                hasSubMenu: false,
                subCategories: []
            };
        }

        const [mainTitle, ...subParts] = parts;
        const subCategories = subParts.map((sub, index) => ({
            key: sub || `sub-${index + 1}`,
            title: sub || `子分类 ${index + 1}`
        }));

        return {
            title: mainTitle || name,
            hasSubMenu: true,
            subCategories
        };
    }

    /**
     * 将名称解析出的二级菜单信息合并到分类数据中
     */
    applyNameDerivedMenu(categoryKey, categoryData) {
        const nameForParse = categoryData.title || categoryData.name || categoryData.Name || categoryKey;
        const parsed = this.parseCategoryNameForMenu(nameForParse);

        const mergedSubCategories =
            (Array.isArray(categoryData.subCategories) && categoryData.subCategories.length > 0)
                ? categoryData.subCategories
                : parsed.subCategories;

        const hasSubMenu = parsed.hasSubMenu || categoryData.hasSubMenu || (mergedSubCategories && mergedSubCategories.length > 0);

        const aliasCategoryIds = Array.isArray(categoryData.aliasCategoryIds)
            ? [...categoryData.aliasCategoryIds]
            : [];
        if (categoryData.originalKey && !aliasCategoryIds.includes(categoryData.originalKey)) {
            aliasCategoryIds.push(categoryData.originalKey);
        }
        if (categoryData.remoteId && !aliasCategoryIds.includes(categoryData.remoteId)) {
            aliasCategoryIds.push(categoryData.remoteId);
        }

        return {
            ...categoryData,
            title: parsed.title || categoryData.title || categoryKey,
            hasSubMenu,
            subCategories: mergedSubCategories,
            rawTitle: categoryData.rawTitle || nameForParse,
            originalKey: categoryData.originalKey || categoryKey,
            aliasCategoryIds,
            remoteId: categoryData.remoteId || categoryKey
        };
    }

    /**
     * 折叠名称包含斜杠的分类：将 A/B 这样的分类合并到父级 A，并生成子菜单 B
     */
    mergeImages(existingImages = [], newImages = []) {
        const merged = Array.isArray(existingImages) ? [...existingImages] : [];
        const seen = new Set(merged.map((img) => img && img.id));
        (Array.isArray(newImages) ? newImages : []).forEach((img) => {
            const id = img && img.id;
            const key = id || JSON.stringify(img);
            if (!seen.has(key)) {
                merged.push(img);
                seen.add(key);
            }
        });
        return merged;
    }

    collapseNestedCategories(galleryData = {}) {
        const merged = {};
        const debugEvents = [];
        const canonicalParentKeyMap = {};

        Object.entries(galleryData).forEach(([key, category]) => {
            const safeKey = key || '';
            const nameCandidate = category.rawTitle || category.title || category.Name || category.name || safeKey;
            const incomingRemoteId = category.remoteId || category.ID || category.id || safeKey;

            const nameParts = String(nameCandidate || '').split('/').map((p) => p.trim()).filter(Boolean);
            const keyParts = String(safeKey || '').split('/').map((p) => p.trim()).filter(Boolean);

            const hasPath = (nameParts.length > 1) || (keyParts.length > 1);
            const rawParentKey = hasPath ? (keyParts[0] || nameParts[0] || safeKey) : safeKey;
            const normalizedParentKey = this.normalizeKeyForCompare(rawParentKey);
            const canonicalParentKey = canonicalParentKeyMap[normalizedParentKey] || rawParentKey;

        if (!canonicalParentKeyMap[normalizedParentKey]) {
            canonicalParentKeyMap[normalizedParentKey] = canonicalParentKey;
        }

        if (!merged[canonicalParentKey]) {
            const title = nameParts[0] || keyParts[0] || nameCandidate || canonicalParentKey;
            merged[canonicalParentKey] = {
                ...category,
                title,
                rawTitle: nameCandidate,
                aliasRemoteMap: {...(category.aliasRemoteMap || {})},
                aliasCategoryDetails: Array.isArray(category.aliasCategoryDetails)
                    ? [...category.aliasCategoryDetails]
                    : []
            };
        }
        const baseParent = merged[canonicalParentKey];

        // 如果没有路径，直接写入/覆盖父级
        if (!hasPath) {
            const mergedSubCategories = Array.isArray(baseParent.subCategories) ? [...baseParent.subCategories] : [];
            (Array.isArray(category.subCategories) ? category.subCategories : []).forEach((sub) => {
                const normalized = sub && sub.key ? this.normalizeKeyForCompare(sub.key) : null;
                if (!normalized) return;
                if (!mergedSubCategories.some((item) => this.normalizeKeyForCompare(item.key) === normalized)) {
                    mergedSubCategories.push(sub);
                }
            });

            const aliasRemoteMap = {
                ...(baseParent.aliasRemoteMap || {}),
                ...(category.aliasRemoteMap || {})
            };

            const aliasCategoryDetails = Array.isArray(baseParent.aliasCategoryDetails)
                ? [...baseParent.aliasCategoryDetails]
                : [];
            (Array.isArray(category.aliasCategoryDetails) ? category.aliasCategoryDetails : []).forEach((detail) => {
                if (!detail || !detail.key) return;
                const normalized = this.normalizeKeyForCompare(detail.key);
                if (!aliasCategoryDetails.some((item) => this.normalizeKeyForCompare(item.key) === normalized)) {
                    aliasCategoryDetails.push(detail);
                }
            });

            merged[canonicalParentKey] = {
                ...baseParent,
                ...category,
                title: nameCandidate || canonicalParentKey,
                rawTitle: nameCandidate || baseParent.rawTitle,
                // 保持已有子菜单信息
                subCategories: mergedSubCategories,
                hasSubMenu: baseParent.hasSubMenu || category.hasSubMenu || false,
                aliasRemoteMap,
                aliasCategoryDetails
            };
            return;
        }

            const subPathParts = nameParts.length > 1 ? nameParts.slice(1) : (keyParts.length > 1 ? keyParts.slice(1) : []);
            const subKey = subPathParts.join('/') || keyParts.slice(1).join('/') || `sub-${(baseParent.subCategories || []).length + 1}`;
            const subTitle = subPathParts.join('/') || category.title || subKey;

            const subCategories = Array.isArray(baseParent.subCategories) ? [...baseParent.subCategories] : [];
            if (subKey && !subCategories.some((sub) => sub && sub.key === subKey)) {
                subCategories.push({
                    key: subKey,
                    title: subTitle
                });
                debugEvents.push({
                    type: 'merge-sub',
                    parent: canonicalParentKey,
                    source: safeKey,
                    subKey,
                    subTitle
                });
            }

            const aliasCategoryIds = Array.isArray(baseParent.aliasCategoryIds) ? [...baseParent.aliasCategoryIds] : [];
            const safeKeyNormalized = this.normalizeKeyForCompare(safeKey);
            const parentKeyNormalized = this.normalizeKeyForCompare(canonicalParentKey);

            if (!aliasCategoryIds.some((alias) => this.normalizeKeyForCompare(alias) === parentKeyNormalized)) {
                aliasCategoryIds.push(canonicalParentKey);
            }
            if (!aliasCategoryIds.some((alias) => this.normalizeKeyForCompare(alias) === safeKeyNormalized)) {
                aliasCategoryIds.push(safeKey);
                debugEvents.push({
                    type: 'alias',
                    parent: canonicalParentKey,
                    alias: safeKey
                });
            }

            const aliasRemoteMap = {...(baseParent.aliasRemoteMap || {})};
            if (incomingRemoteId) {
                aliasRemoteMap[safeKeyNormalized] = incomingRemoteId;
            }

            const aliasCategoryDetails = Array.isArray(baseParent.aliasCategoryDetails) ? [...baseParent.aliasCategoryDetails] : [];
            const normalizedChildSettings = this.normalizeSettings(category.settings || category.Settings || {});
            if (subKey && !aliasCategoryDetails.some((detail) => this.normalizeKeyForCompare(detail.key) === safeKeyNormalized)) {
                aliasCategoryDetails.push({
                    key: safeKey,
                    title: subTitle,
                    remoteId: incomingRemoteId,
                    parentKey: canonicalParentKey,
                    settings: normalizedChildSettings,
                    Settings: normalizedChildSettings
                });
            }

            const mergedImages = this.mergeImages(baseParent.images, category.images);
            const countFromParent = typeof baseParent.imageCount === 'number' ? baseParent.imageCount : (Array.isArray(baseParent.images) ? baseParent.images.length : 0);
            const countFromChild = typeof category.imageCount === 'number' ? category.imageCount : (Array.isArray(category.images) ? category.images.length : 0);

            const parentSettings = baseParent.settings || baseParent.Settings || {};
            const childSettings = normalizedChildSettings;
            const layoutModeFromParent = parentSettings.layoutMode || parentSettings.LayoutMode;
            const layoutModeFromChild = childSettings.layoutMode || childSettings.LayoutMode;
            const finalLayoutMode = layoutModeFromParent || layoutModeFromChild;
            const mergedSettings = {
                ...childSettings,
                ...parentSettings
            };
            if (finalLayoutMode) {
                mergedSettings.layoutMode = finalLayoutMode;
                mergedSettings.LayoutMode = finalLayoutMode;
            }

            const aliasLayoutMap = {...(baseParent.aliasLayoutMap || {})};
            if (layoutModeFromChild) {
                aliasLayoutMap[safeKeyNormalized] = layoutModeFromChild;
                const subKeyNormalized = this.normalizeKeyForCompare(subKey);
                if (subKeyNormalized) {
                    aliasLayoutMap[subKeyNormalized] = layoutModeFromChild;
                }
            }

            merged[canonicalParentKey] = {
                ...baseParent,
                ...category,
                title: baseParent.title || nameParts[0] || keyParts[0] || nameCandidate || canonicalParentKey,
                rawTitle: baseParent.rawTitle || nameCandidate || keyParts.join('/'),
                hasSubMenu: true,
                subCategories,
                aliasCategoryIds,
                aliasRemoteMap,
                aliasCategoryDetails,
                aliasLayoutMap,
                images: mergedImages,
                imageCount: Math.max(countFromParent, countFromChild, mergedImages.length),
                // 避免子分类覆盖父级 remoteId
                remoteId: baseParent.remoteId || category.remoteId || incomingRemoteId || canonicalParentKey,
                settings: mergedSettings,
                Settings: mergedSettings
            };
        });

        if (debugEvents.length > 0) {
            console.groupCollapsed('[SomniumNexus] 折叠斜杠分类');
            console.log('输入分类键:', Object.keys(galleryData || {}));
            console.log('输出分类键:', Object.keys(merged));
            console.table(debugEvents);
            console.groupEnd();
        } else {
            console.groupCollapsed('[SomniumNexus] 无需折叠，当前分类');
            const tableData = Object.entries(galleryData || {}).map(([k, cat]) => ({
                key: k,
                title: cat && cat.title,
                rawTitle: cat && cat.rawTitle
            }));
            console.table(tableData);
            console.groupEnd();
        }

        return merged;
    }

    normalizeProductionData() {
        this._productionGalleryData = this.collapseNestedCategories(this._productionGalleryData);

        const currentKey = this._selectedCategory;
        if (currentKey && !this._productionGalleryData[currentKey]) {
            const mapped = Object.entries(this._productionGalleryData).find(([, cat]) =>
                Array.isArray(cat.aliasCategoryIds) && cat.aliasCategoryIds.includes(currentKey)
            );
            if (mapped) {
                this._selectedCategory = mapped[0];
                console.info(`[SomniumNexus] 选中分类从别名映射: ${currentKey} -> ${mapped[0]}`);
            }
        }
    }

    resolveCategoryKey(inputKey) {
        if (!inputKey) {
            return inputKey;
        }
        const data = this.galleryCategories || {};
        if (data[inputKey]) return inputKey;
        const normalizedInput = this.normalizeKeyForCompare(inputKey);
        const found = Object.entries(data).find(([key, cat]) => {
            if (!cat) return false;
            const keyMatch = this.normalizeKeyForCompare(key) === normalizedInput;
            return keyMatch
                || this.normalizeKeyForCompare(cat.rawTitle) === normalizedInput
                || this.normalizeKeyForCompare(cat.remoteId) === normalizedInput
                || this.normalizeKeyForCompare(cat.originalKey) === normalizedInput
                || (cat.aliasCategoryIds && cat.aliasCategoryIds.some((alias) =>
                    this.normalizeKeyForCompare(alias) === normalizedInput
                ));
        });
        return found ? found[0] : inputKey;
    }

    getRemoteId(categoryKey) {
        const normalizedInput = this.normalizeKeyForCompare(categoryKey);
        const resolvedKey = this.resolveCategoryKey(categoryKey);
        const data = this.galleryCategories || {};
        const cat = data[resolvedKey];
        if (cat) {
            if (cat.aliasRemoteMap && cat.aliasRemoteMap[normalizedInput]) {
                return cat.aliasRemoteMap[normalizedInput];
            }
            if (cat.remoteId) return cat.remoteId;
        }

        const found = Object.values(data).find((item) =>
            item && (
                (item.aliasCategoryIds && item.aliasCategoryIds.some((alias) =>
                    this.normalizeKeyForCompare(alias) === normalizedInput
                )) ||
                (item.aliasRemoteMap && item.aliasRemoteMap[normalizedInput]) ||
                this.normalizeKeyForCompare(item.originalKey) === normalizedInput ||
                this.normalizeKeyForCompare(item.rawTitle) === normalizedInput ||
                this.normalizeKeyForCompare(item.remoteId) === normalizedInput
            )
        );
        if (found && found.remoteId) return found.remoteId;
        if (found && found.aliasRemoteMap && found.aliasRemoteMap[normalizedInput]) return found.aliasRemoteMap[normalizedInput];
        return categoryKey;
    }

    /**
     * 获取分类的布局模式（已标准化，返回 flex / freedom / null）
     */
    getCategoryLayoutMode(category) {
        if (!category) return null;
        const settings = category.settings || category.Settings || {};
        const layoutMode = settings.layoutMode || settings.LayoutMode;
        if (!layoutMode) return null;
        const normalized = String(layoutMode).trim().toLowerCase();
        return normalized === 'freeform' ? 'freedom' : normalized;
    }

    /**
     * 获取当前激活的布局模式：如果选择了子分类且该子分类有独立布局，则优先使用子分类布局
     */
    getActiveLayoutMode(category) {
        const subKey = this._selectedSubCategory;
        if (category && subKey) {
            const aliasLayoutMap = category.aliasLayoutMap || {};
            const normalized = this.normalizeKeyForCompare(subKey);
            const layoutFromSub = aliasLayoutMap[normalized];
            if (layoutFromSub) {
                const normalizedMode = String(layoutFromSub).trim().toLowerCase();
                return normalizedMode === 'freeform' ? 'freedom' : normalizedMode;
            }
        }
        return this.getCategoryLayoutMode(category);
    }

    /**
     * 确保指定分类具备 settings.layoutMode（当首次通过路由直接访问时，可能先加载了图片但未加载分类配置）
     */
    ensureCategorySettings = async (categoryId) => {
        if (!categoryId || this._useTestData) {
            return false;
        }

        const resolvedKey = this.resolveCategoryKey(categoryId);
        const existing = this._productionGalleryData[resolvedKey] || this._userProjects[resolvedKey];
        if (existing && this.getCategoryLayoutMode(existing)) {
            return false; // already has layout info
        }

        try {
            const resp = await listCategories();
            const payload = resp && resp.data;
            if (!payload || !Array.isArray(payload.categories)) {
                return false;
            }

            const remoteId = this.getRemoteId(resolvedKey);
            const match = payload.categories.find((item) =>
                item && (item.ID === remoteId || item.Name === resolvedKey)
            );
            if (!match) {
                return false;
            }

            const normalizedSettings = this.normalizeSettings(match.Settings || match.settings || {});
            const prev = this._productionGalleryData[resolvedKey] || {};
            const merged = this.applyNameDerivedMenu(resolvedKey, {
                ...prev,
                settings: normalizedSettings,
                Settings: normalizedSettings,
                title: prev.title || match.Name || resolvedKey,
                rawTitle: prev.rawTitle || match.Name || resolvedKey,
                description: prev.description || match.Description || "",
                remoteId: prev.remoteId || match.ID || resolvedKey,
                originalKey: prev.originalKey || match.ID || resolvedKey,
                aliasCategoryIds: [...(prev.aliasCategoryIds || []), match.ID].filter(Boolean)
            });
            this._productionGalleryData[resolvedKey] = merged;
            this.normalizeProductionData();
            console.log('SomniumNexusStore: 分类设置已补全', {categoryId: resolvedKey, remoteId, layoutMode: normalizedSettings.layoutMode});
            return true;
        } catch (error) {
            console.warn('SomniumNexusStore: 补全分类设置失败', categoryId, error);
            return false;
        }
    };

    // 计算属性 | Computed properties
    get selectedCategory() {
        return this._selectedCategory;
    }

    get selectedImage() {
        return this._selectedImage;
    }

    get hoveredImage() {
        return this._hoveredImage;
    }

    get isModalOpen() {
        return this._isModalOpen;
    }

    get galleryCategories() {
        // 根据环境返回相应的数据
        let baseData;
        if (this._useTestData && testDataStore.isTestEnvironment) {
            baseData = testDataStore.getTestGalleryData();
        } else {
            // 合并正式环境数据和用户创建的项目数据
            const merged = {
                ...this._productionGalleryData,
                ...this._userProjects
            };
            baseData = Object.entries(merged).reduce((acc, [key, value]) => {
                if (this.isHiddenCategory(key, value)) {
                    return acc;
                }
                acc[key] = value;
                return acc;
            }, {});
        }

        // 折叠斜杠分类，避免 A 与 A/B 重复
        const collapsed = this.collapseNestedCategories(baseData);
        return collapsed;
    }

    // 辅助方法：从数据对象中提取所有图片
    getAllImagesFromData(data) {
        if (!data) return [];

        const allImages = [];
        Object.values(data).forEach(category => {
            if (category.images && Array.isArray(category.images)) {
                allImages.push(...category.images);
            }
        });

        // 为全部分类的图片添加特殊标记
        return allImages.map(image => ({
            ...image,
            fromAllCategory: true, // 标记图片来自"全部"分类
            originalCategory: image.category // 保留原始分类信息
        }));
    }

    get selectedSubCategory() {
        return this._selectedSubCategory;
    }

    get hasSubMenu() {
        return this._hasSubMenu;
    }

    get subCategories() {
        return this._subCategories;
    }

    get hoverSubCategories() {
        return this._hoverSubCategories;
    }

    get categories() {
        const data = this.galleryCategories;
        if (!data) return [];

        // 直接返回所有分类键，不再特殊处理"all"分类
        return Object.keys(data).filter((key) => !this.isHiddenCategory(key, data[key]));
    }

    /**
     * 获取用于“添加到分类”下拉的选项，保留折叠后父级与包含斜杠的子分类选项
     */
    getCategoryAssignOptions() {
        const data = this.galleryCategories || {};
        const options = [];
        const seen = new Set();

        Object.entries(data).forEach(([key, cat]) => {
            if (this.isHiddenCategory(key, cat)) {
                return;
            }
            const normalized = this.normalizeKeyForCompare(key);
            if (!seen.has(normalized)) {
                options.push({
                    key,
                    title: cat.title || key,
                    assignKeys: [key]
                });
                seen.add(normalized);
            }

            // 为包含斜杠的别名生成独立选项（添加时需同时作用于父级和别名）
            if (Array.isArray(cat.aliasCategoryDetails)) {
                cat.aliasCategoryDetails.forEach((detail) => {
                    const detailNormalized = this.normalizeKeyForCompare(detail.key);
                    if (seen.has(detailNormalized)) {
                        return;
                    }
                    const displayTitle = detail.key.includes('/')
                        ? detail.key
                        : `${cat.title || key}/${detail.title || detail.key}`;
                    options.push({
                        key: detail.key,
                        title: displayTitle,
                        assignKeys: [key, detail.key]
                    });
                    seen.add(detailNormalized);
                });
            }
        });

        return options;
    }

    get currentCategory() {
        const data = this.galleryCategories;
        if (!data || !this._selectedCategory) return null;

        const direct = data[this._selectedCategory];
        if (direct) return direct;

        // 兼容折叠后的别名（例如选择了 A/B，但实际只保留父级 A）
        const mapped = Object.entries(data).find(([, cat]) =>
            Array.isArray(cat.aliasCategoryIds) && cat.aliasCategoryIds.includes(this._selectedCategory)
        );
        return mapped ? mapped[1] : null;
    }

    get currentCategoryImages() {
        const category = this.currentCategory;
        if (!category) return [];

        // 如果是"全部"分类，直接返回其包含的所有图片
        if (category.isAllCategory) {
            return category.images || [];
        }

        // 如果有子菜单且选择了子分类，只显示匹配的子分类图片
        if (this._selectedSubCategory && category.hasSubMenu) {
            const normalizedSelected = this.normalizeKeyForCompare(this._selectedSubCategory);
            return category.images.filter((image) => {
                const rawSub = image.subCategory;
                const rawCat = image.category;
                const sub = this.normalizeKeyForCompare(rawSub);
                const cat = this.normalizeKeyForCompare(rawCat);

                // 支持 A/B 的子分类，允许取末段进行匹配
                const subTail = this.normalizeKeyForCompare(
                    (typeof rawSub === 'string' && rawSub.includes('/')) ? rawSub.split('/').pop() : null
                );
                const catTail = this.normalizeKeyForCompare(
                    (typeof rawCat === 'string' && rawCat.includes('/')) ? rawCat.split('/').pop() : null
                );

                return (
                    sub === normalizedSelected ||
                    cat === normalizedSelected ||
                    subTail === normalizedSelected ||
                    catTail === normalizedSelected
                );
            });
        }

        // 否则显示该分类下的所有图片
        return category.images || [];
    }

    get isUsingTestData() {
        return this._useTestData && testDataStore.isTestEnvironment;
    }

    get isProductionEnvironment() {
        return !this._useTestData;
    }

    // 从服务器加载分类列表（正式环境）
    loadCategoriesFromServer = async () => {
        if (this._useTestData) {
            return false;
        }

        try {
            const response = await listCategories();
            const payload = response && response.data;

            if (!payload || !Array.isArray(payload.categories)) {
                console.warn("SomniumNexusStore: 无法从服务器获取分类列表");
                return false;
            }

            console.groupCollapsed('[SomniumNexus] 分类接口返回');
            console.table(payload.categories.map((c) => ({
                id: c && c.ID,
                name: c && (c.Name || c.name),
                description: c && c.Description
            })));
            console.groupEnd();

            const serverData = {};

            payload.categories.forEach((category) => {
                if (!category || !category.ID) return;

                // 兼容后端 settings/Settings 字段并标准化布局模式
                const settings = this.normalizeSettings(category.Settings || category.settings || {});

                const nameKey = category.Name || category.ID;
                const baseCategory = {
                    title: nameKey,
                    description: category.Description || "",
                    hasSubMenu: false,
                    subCategories: [],
                    images: [],
                    imageCount: category.ImageCount || 0,
                    coverImageId: category.CoverImage || null,
                    settings,
                    createdAt: category.CreatedAt,
                    updatedAt: category.UpdatedAt,
                    source: "server",
                    remoteId: category.ID,
                    originalKey: category.ID,
                    rawTitle: category.Name || category.ID,
                    aliasCategoryIds: [category.ID]
                };

                serverData[nameKey] = this.applyNameDerivedMenu(nameKey, baseCategory);
            });

            this.setProductionData(serverData);
            console.log("SomniumNexusStore: 分类数据已从服务器加载");
            return true;
        } catch (error) {
            console.error("SomniumNexusStore: 加载分类数据失败:", error);
            return false;
        }
    };

    // 环境管理方法 | Environment management
    enableTestEnvironment() {
        testDataStore.enableTestEnvironment();
        this._useTestData = true;
        this._categoryPageState = {};
        this._productionGalleryData = {};
        console.log('SomniumNexusStore: 测试环境已启用');
    }

    disableTestEnvironment() {
        testDataStore.disableTestEnvironment();
        this._useTestData = false;
        this._categoryPageState = {};
        console.log('SomniumNexusStore: 测试环境已禁用');
    }

    // 正式环境数据管理 | Production data管理
    setProductionData(galleryData) {
        const normalizedData = {};
        Object.keys(galleryData || {}).forEach((key) => {
            const category = galleryData[key] || {};
            const normalizedSettings = this.normalizeSettings(category.settings || category.Settings || {});
            const merged = this.applyNameDerivedMenu(key, {
                ...category,
                settings: normalizedSettings,
                Settings: normalizedSettings
            });
            normalizedData[key] = merged;
        });

        console.groupCollapsed('[SomniumNexus] 接口分类键');
        console.table(Object.entries(galleryData || {}).map(([k, v]) => ({
            key: k,
            title: v && v.title,
            rawTitle: v && v.rawTitle
        })));
        console.groupEnd();
        this._productionGalleryData = this.collapseNestedCategories(normalizedData);
        console.groupCollapsed('[SomniumNexus] 折叠后分类键');
        console.table(Object.entries(this._productionGalleryData || {}).map(([k, v]) => ({
            key: k,
            title: v && v.title,
            rawTitle: v && v.rawTitle,
            subCount: v && Array.isArray(v.subCategories) ? v.subCategories.length : 0,
            aliases: v && v.aliasCategoryIds ? v.aliasCategoryIds.join(',') : ''
        })));
        console.groupEnd();
        this.normalizeProductionData();
        this._useTestData = false;
        console.log('SomniumNexusStore: 正式数据已加载');
    }

    addProductionCategory(categoryKey, categoryData) {
        const normalizedSettings = this.normalizeSettings(categoryData.settings || categoryData.Settings || {});
        const merged = this.applyNameDerivedMenu(categoryKey, {
            ...categoryData,
            settings: normalizedSettings,
            Settings: normalizedSettings
        });
        this._productionGalleryData[categoryKey] = merged;
        this.normalizeProductionData();
    }

    /**
     * 获取分类的分页状态
     */
    getCategoryPageState(categoryId) {
        const resolvedKey = this.resolveCategoryKey(categoryId);
        const existing = this._categoryPageState[resolvedKey];
        const categoryData = this._productionGalleryData[resolvedKey] || this._userProjects[resolvedKey] || {};
        const currentCount = Array.isArray(categoryData.images) ? categoryData.images.length : 0;
        const rawTotal = typeof categoryData.imageCount === 'number' ? categoryData.imageCount : currentCount;
        const normalizedTotal = Number.isFinite(Number(rawTotal)) ? Number(rawTotal) : null;

        if (existing) {
            const existingTotal = Number.isFinite(Number(existing.total)) ? Number(existing.total) : normalizedTotal;
            let normalizedHasMore = existing.hasMore;

            if (existingTotal !== null) {
                const reachedByCount = currentCount >= existingTotal;
                const reachedByPage = (existing.page * (existing.pageSize || DEFAULT_PAGE_SIZE)) >= existingTotal;
                normalizedHasMore = !(reachedByCount || reachedByPage);
            }

            return {
                ...existing,
                total: existingTotal,
                hasMore: normalizedHasMore
            };
        }

        return {
            page: 0,
            pageSize: DEFAULT_PAGE_SIZE,
            total: normalizedTotal,
            hasMore: normalizedTotal ? currentCount < normalizedTotal : true,
            isLoading: false
        };
    }

    resetCategoryPagination(categoryId) {
        if (!categoryId) {
            return;
        }
        delete this._categoryPageState[categoryId];
    }

    /**
     * 更新指定分类的布局模式（settings.layoutMode / Settings.LayoutMode）
     * layoutMode 来自服务端，取值 flex / freedom
     */
    setCategoryLayoutMode(categoryId, layoutMode, options = {}) {
        if (!categoryId || !layoutMode) {
            return;
        }

        const {aliasKey = null} = options;
        const normalized = String(layoutMode).trim().toLowerCase();
        // 统一将自由布局保存为 freedom，兼容后端约定
        let storedLayoutMode = normalized;
        if (normalized === 'freeform') {
            storedLayoutMode = 'freedom';
        }

        const resolvedKey = this.resolveCategoryKey(categoryId);
        const aliasNormalized = aliasKey ? this.normalizeKeyForCompare(aliasKey) : null;

        const applyUpdate = (store, persistUserProjects = false) => {
            const prev = store[resolvedKey];
            if (!prev) return false;

            const prevSettings = prev.settings || prev.Settings || {};
            const aliasLayoutMap = {...(prev.aliasLayoutMap || {})};
            if (aliasNormalized) {
                aliasLayoutMap[aliasNormalized] = storedLayoutMode;
            }

            store[resolvedKey] = {
                ...prev,
                settings: {
                    ...prevSettings,
                    layoutMode: storedLayoutMode,
                    LayoutMode: storedLayoutMode
                },
                // 保留一份 Settings 兼容后续可能的外部使用
                Settings: {
                    ...prevSettings,
                    layoutMode: storedLayoutMode,
                    LayoutMode: storedLayoutMode
                },
                ...(aliasNormalized ? {aliasLayoutMap} : {})
            };

            if (persistUserProjects) {
                this.saveUserProjectsToLocal();
            }
            return true;
        };

        if (!applyUpdate(this._productionGalleryData)) {
            applyUpdate(this._userProjects, true);
        }
    }

    /**
     * 添加用户创建的项目（增量数据）
     * 支持用户自定义项目名称和内容
     */
    addUserProject(categoryKey, categoryData) {
        const projectData = {
            ...categoryData,
            isUserProject: true,  // 标记为用户创建的项目
            createdAt: categoryData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            projectType: 'user-created',
            remoteId: categoryData.remoteId || categoryData.originalKey || categoryKey,
            originalKey: categoryData.originalKey || categoryKey,
            rawTitle: categoryData.rawTitle || categoryData.title || categoryKey
        };

        const merged = this.applyNameDerivedMenu(categoryKey, projectData);

        this._userProjects[categoryKey] = merged;
        console.log(`用户项目 "${categoryData.title}" 已添加到增量数据`, projectData);

        return merged;
    }

    /**
     * 更新用户项目
     */
    updateUserProject(categoryKey, updates) {
        if (this._userProjects[categoryKey]) {
            this._userProjects[categoryKey] = {
                ...this._userProjects[categoryKey],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.saveUserProjectsToLocal();
            console.log(`用户项目 "${categoryKey}" 已更新`);
            return true;
        }
        return false;
    }

    /**
     * 删除用户项目
     */
    removeUserProject(categoryKey) {
        if (this._userProjects[categoryKey]) {
            delete this._userProjects[categoryKey];
            this.saveUserProjectsToLocal();
            console.log(`用户项目 "${categoryKey}" 已删除`);
            return true;
        }
        return false;
    }

    /**
     * 获取所有用户创建的项目
     */
    getUserProjects() {
        return { ...this._userProjects };
    }

    /**
     * 获取用户项目的数量
     */
    getUserProjectCount() {
        return Object.keys(this._userProjects).length;
    }

    /**
     * 检查是否是用户项目
     */
    isUserProject(categoryKey) {
        return !!(this._userProjects[categoryKey]);
    }

    /**
     * 保存用户项目到本地存储
     */
    saveUserProjectsToLocal() {
        try {
            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('somnium_user_projects', JSON.stringify(this._userProjects));
                console.log('用户项目已保存到本地存储');
            }
        } catch (error) {
            console.warn('保存用户项目到本地存储失败:', error);
        }
    }

    /**
     * 从本地存储加载用户项目
     */
    loadUserProjectsFromLocal() {
        try {
            if (typeof localStorage !== 'undefined') {
                const saved = localStorage.getItem('somnium_user_projects');
                if (saved) {
                    const loadedProjects = JSON.parse(saved);
                    // 兼容性修复：早期版本可能错误标记 hasSubMenu=true 但没有子菜单
                    Object.keys(loadedProjects).forEach((key) => {
                        const project = loadedProjects[key];
                        if (project && project.hasSubMenu && (!project.subCategories || project.subCategories.length === 0)) {
                            project.hasSubMenu = false;
                        }
                        loadedProjects[key] = this.applyNameDerivedMenu(key, {
                            ...project,
                            remoteId: project.remoteId || project.originalKey || key,
                            originalKey: project.originalKey || key,
                            rawTitle: project.rawTitle || project.title || key
                        });
                    });
                    this._userProjects = loadedProjects;
                    // 回写一次，避免下次再修复
                    this.saveUserProjectsToLocal();
                    console.log('用户项目已从本地存储加载:', Object.keys(loadedProjects).length, '个项目');
                    return true;
                }
            }
        } catch (error) {
            console.warn('从本地存储加载用户项目失败:', error);
        }
        return false;
    }

    /**
     * 清除所有用户项目
     */
    clearUserProjects() {
        this._userProjects = {};
        this.saveUserProjectsToLocal();
        console.log('所有用户项目已清除');
    }

    removeProductionCategory(categoryKey) {
        delete this._productionGalleryData[categoryKey];
        const resolvedKey = this.resolveCategoryKey(categoryKey);
        delete this._categoryPageState[resolvedKey];
    }

    clearProductionData() {
        this._productionGalleryData = {};
        this._categoryPageState = {};
    }

    /**
     * 将一张图片添加到指定分类下
     * 仅在正式环境下调用后端接口，测试环境直接给出提示
     */
    async addImageToCategory(categoryId, imageId, sortOrder = 0) {
        if (!categoryId || !imageId) {
            console.warn('addImageToCategory: 缺少分类ID或图片ID', {categoryId, imageId});
            return false;
        }

        const resolvedKey = this.resolveCategoryKey(categoryId);
        const remoteId = this.getRemoteId(categoryId);

        if (this.isUsingTestData) {
            alert('当前为测试数据环境，无法将图片添加到分类（仅正式环境可用）');
            return false;
        }

        try {
            const payload = {
                imageId: imageId,
                sortOrder: sortOrder || 0 // 0 或不指定表示自动递增排序
            };
            const resp = await addImageToCategory(remoteId, payload);
            console.log('图片已添加到分类:', {
                categoryId: resolvedKey,
                remoteId,
                imageId,
                response: resp && resp.data
            });
            return true;
        } catch (error) {
            console.error('将图片添加到分类失败:', categoryId, imageId, error);
            const message =
                (error && error.response && error.response.data && error.response.data.data) ||
                '添加失败，请稍后重试';
            alert(`添加到分类失败：${message}`);
            return false;
        }
    }

    /**
     * 将图片加入本地缓存分类（仅正式环境）
     */
    async addImageToCache(imageId) {
        if (!imageId) {
            console.warn('addImageToCache: 缺少图片ID');
            return {success: false, message: '缺少图片ID'};
        }

        if (this.isUsingTestData) {
            const message = '当前为测试数据环境，无法加入本地缓存分类（仅正式环境可用）';
            alert(message);
            return {success: false, message};
        }

        try {
            const resp = await cacheImageToLocal(imageId);
            const payload = resp && resp.data;
            const success = payload && (
                payload.code === '001001200' ||
                payload.code === 200 ||
                payload.code === '200'
            );
            const message = (payload && (payload.data || payload.msg)) || (success ? '已加入本地缓存分类' : '加入缓存分类失败');

            if (success) {
                console.log('图片已加入本地缓存分类', {imageId, response: payload});
                return {success: true, message};
            }

            alert(`加入缓存分类失败：${message}`);
            return {success: false, message};
        } catch (error) {
            console.error('加入缓存分类失败:', error);
            const message =
                (error && error.response && error.response.data && error.response.data.data) ||
                '加入缓存分类失败，请稍后重试';
            alert(`加入缓存分类失败：${message}`);
            return {success: false, message};
        }
    }

    /**
     * 从本地缓存分类获取随机图片（返回对象包含 revoke 用于释放 URL）
     */
    async fetchRandomCachedImages(count = 3) {
        const results = [];
        const seenIds = new Set();

        if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
            console.warn('当前环境不支持 URL.createObjectURL，无法加载缓存图片');
            return results;
        }

        for (let i = 0; i < count; i++) {
            try {
                const resp = await getRandomCachedImage();
                const statusOk = resp && resp.status >= 200 && resp.status < 300;
                const headers = (resp && resp.headers) || {};
                const imageId = headers['x-image-id'] || headers['X-Image-ID'] || `cache-${Date.now()}-${i}`;
                const contentType = headers['content-type'] || headers['Content-Type'] || '';

                if (!statusOk) {
                    let message = '获取缓存图片失败';
                    try {
                        if (resp && resp.data && typeof resp.data.text === 'function') {
                            const text = await resp.data.text();
                            const parsed = JSON.parse(text);
                            message = parsed.data || parsed.msg || message;
                        }
                    } catch (parseError) {
                        console.warn('解析缓存图片失败响应时出错', parseError);
                    }

                    console.warn('获取缓存图片接口返回异常', {status: resp && resp.status, message});
                    continue;
                }

                const blob = resp && resp.data;
                if (!blob || typeof blob.size !== 'number') {
                    console.warn('缓存图片响应体不是有效的 Blob');
                    continue;
                }

                if (seenIds.has(imageId)) {
                    continue;
                }

                const objectUrl = URL.createObjectURL(blob);
                results.push({
                    id: imageId,
                    src: objectUrl,
                    contentType,
                    revoke: () => URL.revokeObjectURL(objectUrl)
                });
                seenIds.add(imageId);
            } catch (error) {
                console.error('获取本地缓存随机图片失败:', error);
            }
        }

        return results;
    }

    /**
     * 从本地状态中移除指定图片，返回移除的数量
     */
    removeImageFromLocalState(imageId) {
        if (!imageId) {
            return 0;
        }

        const removeFromCollection = (collection) => {
            let removed = 0;

            Object.keys(collection).forEach((categoryKey) => {
                const category = collection[categoryKey];
                if (!category || !Array.isArray(category.images)) {
                    return;
                }

                const filteredImages = category.images.filter((img) => img.id !== imageId);
                if (filteredImages.length !== category.images.length) {
                    const delta = category.images.length - filteredImages.length;
                    removed += delta;

                    const nextImageCount = typeof category.imageCount === 'number'
                        ? Math.max(0, category.imageCount - delta)
                        : filteredImages.length;

                    collection[categoryKey] = {
                        ...category,
                        images: filteredImages,
                        imageCount: nextImageCount
                    };

                    const pageState = this._categoryPageState[categoryKey];
                    if (pageState) {
                        const nextTotal = typeof pageState.total === 'number'
                            ? Math.max(0, pageState.total - delta)
                            : pageState.total;
                        const hasMore = typeof nextTotal === 'number'
                            ? filteredImages.length < nextTotal
                            : pageState.hasMore;

                        this._categoryPageState[categoryKey] = {
                            ...pageState,
                            total: nextTotal,
                            hasMore
                        };
                    }
                }
            });

            return removed;
        };

        let totalRemoved = removeFromCollection(this._productionGalleryData);
        totalRemoved += removeFromCollection(this._userProjects);

        if (this._selectedImage && this._selectedImage.id === imageId) {
            this.clearSelectedImage();
        }

        return totalRemoved;
    }

    /**
     * 删除图片（正式环境），成功后同步本地状态
     */
    async deleteImageById(imageId) {
        if (!imageId) {
            console.warn('deleteImageById: 缺少图片ID');
            return false;
        }

        if (this.isUsingTestData) {
            alert('当前为测试数据环境，无法删除图片（仅正式环境可用）');
            return false;
        }

        try {
            const resp = await deleteImage(imageId);
            const payload = resp && resp.data;
            const success = payload && (
                payload.code === '001001200' ||
                payload.code === 200 ||
                payload.code === '200'
            );

            if (!success) {
                const message = (payload && (payload.data || payload.msg)) || '删除失败';
                alert(`删除失败：${message}`);
                return false;
            }

            const removed = this.removeImageFromLocalState(imageId);
            console.log('图片已删除', {imageId, removed});
            return true;
        } catch (error) {
            console.error('删除图片失败:', error);
            const message =
                (error && error.response && error.response.data && error.response.data.data) ||
                '删除失败，请稍后重试';
            alert(`删除失败：${message}`);
            return false;
        }
    }

    // 加载指定分类下指定页的图片（仅正式环境）
    loadCategoryPage = async (categoryId, page = 1, options = {}) => {
        if (this._useTestData || !categoryId) {
            return false;
        }

        const resolvedKey = this.resolveCategoryKey(categoryId);
        const remoteId = this.getRemoteId(resolvedKey);
        const {pageSize = DEFAULT_PAGE_SIZE, reset = false, forceAlias = false, force = false} = options;
        const existing = this._productionGalleryData[resolvedKey] || {};
        const pagination = this.getCategoryPageState(resolvedKey);

        // 确保分类设置已补全（避免布局模式缺失）
        if (!this.getCategoryLayoutMode(existing)) {
            const ensured = await this.ensureCategorySettings(resolvedKey);
            if (ensured) {
                this._categoryPageState[categoryId] = {
                    ...pagination,
                    settingsEnsured: true
                };
            }
        }

        // 避免重复请求
        if (pagination.isLoading) {
            return false;
        }

        const targetPage = page || (pagination.page + 1);
        const effectivePageSize = pageSize || pagination.pageSize || DEFAULT_PAGE_SIZE;

        // 已知总数且翻页已超过范围时直接停止
        const knownTotalRaw = pagination.total;
        const knownTotal = Number.isFinite(Number(knownTotalRaw)) ? Number(knownTotalRaw) : null;
        if (!reset && !force && knownTotal !== null && pagination.page > 0) {
            const startIndex = (targetPage - 1) * effectivePageSize;
            if (startIndex >= knownTotal) {
                this._categoryPageState[resolvedKey] = {
                    ...pagination,
                    total: knownTotal,
                    hasMore: false,
                    isLoading: false
                };
                return false;
            }
        }

        // 已加载完所有数据时不再重复请求
        if (!reset && !force && !pagination.hasMore && pagination.page >= targetPage) {
            return false;
        }

        // 标记加载中
        this._categoryPageState[resolvedKey] = {
            ...pagination,
            page: pagination.page,
            pageSize: effectivePageSize,
            isLoading: true
        };

        // 如果需要重置，先清空已有图片
        if (reset) {
            this._productionGalleryData[resolvedKey] = {
                ...existing,
                images: []
            };
        }

        try {
            const categoryMeta = this._productionGalleryData[resolvedKey] || {};
            const targets = [{remoteId, subCategoryKey: null}];

            // 首次页面加载时，将折叠的斜杠分类远端ID也加入请求队列，便于展示 A/B 等别名的图片
            if (targetPage === 1 && (forceAlias || !pagination.aliasesLoaded) && Array.isArray(categoryMeta.aliasCategoryDetails)) {
                const normalizedMap = categoryMeta.aliasRemoteMap || {};
                categoryMeta.aliasCategoryDetails.forEach((detail) => {
                    const detailKeyNormalized = this.normalizeKeyForCompare(detail.key);
                    const detailRemoteId = detail.remoteId || normalizedMap[detailKeyNormalized];
                    if (!detailRemoteId) return;

                    // 避免重复相同的 remoteId
                    if (targets.some((t) => String(t.remoteId) === String(detailRemoteId))) {
                        return;
                    }

                    const subCategoryKey = detail.key.includes('/')
                        ? detail.key.split('/').pop()
                        : detail.title || detail.key;

                    targets.push({remoteId: detailRemoteId, subCategoryKey});
                });
            }

            const prevImages = Array.isArray(existing.images) ? existing.images : [];
            const mergedImages = [...prevImages];
            const imageMap = new Map();
            mergedImages.forEach((img) => {
                if (img && img.id) {
                    imageMap.set(img.id, img);
                }
            });

            const initialTotal = typeof pagination.total === 'number'
                ? pagination.total
                : Number(pagination.total);
            let computedTotal = Number.isFinite(initialTotal) ? initialTotal : prevImages.length;
            let computedHasMore = false;

            for (const target of targets) {
                try {
                    const resp = await getCategoryImages(target.remoteId, {page: targetPage, pageSize: effectivePageSize});
                    const payload = resp && resp.data;

                    if (!payload || !Array.isArray(payload.images)) {
                        console.warn(`SomniumNexusStore: 分类 ${categoryId}(${target.remoteId}) 第 ${targetPage} 页图片列表为空或格式不正确`);
                        continue;
                    }

                    const newImages = payload.images.map((img) => {
                        if (!img || !img.ID) return null;

                        const position = img.positions && (img.positions[resolvedKey] || img.positions[target.remoteId]);
                        const uploadedAt = img.UploadedAt || (position && position.addedAt);
                        const year = uploadedAt ? String(uploadedAt).slice(0, 4) : "";

                        const fullSrc = img.CosURL || img.ThumbURL || "";
                        const thumbSrc = img.ThumbURL || img.CosURL || "";

                        return {
                            id: img.ID,
                            title: img.Name || "",
                            src: fullSrc,
                            fullSrc,
                            thumbSrc,
                            width: img.Width,
                            height: img.Height,
                            thumbWidth: img.ThumbWidth,
                            thumbHeight: img.ThumbHeight,
                            year,
                            category: resolvedKey,
                            subCategory: target.subCategoryKey || null,
                            tags: img.Tags || [],
                            position
                        };
                    }).filter(Boolean);

                    newImages.forEach((img) => {
                        const existingImg = imageMap.get(img.id);
                        if (!existingImg) {
                            mergedImages.push(img);
                            imageMap.set(img.id, img);
                            return;
                        }

                        // 如果新数据包含子分类信息而旧数据没有，则用新数据补全
                        const shouldUpdateSubCategory = !existingImg.subCategory && img.subCategory;
                        const shouldUpdateCategory = !existingImg.category && img.category;
                        if (shouldUpdateSubCategory || shouldUpdateCategory) {
                            const updated = {
                                ...existingImg,
                                subCategory: shouldUpdateSubCategory ? img.subCategory : existingImg.subCategory,
                                category: shouldUpdateCategory ? img.category : existingImg.category
                            };
                            const idx = mergedImages.findIndex((item) => item && item.id === img.id);
                            if (idx !== -1) {
                                mergedImages[idx] = updated;
                            } else {
                                mergedImages.push(updated);
                            }
                            imageMap.set(img.id, updated);
                        }
                    });

                    const remoteTotalRaw = payload.total;
                    const remoteTotal = Number.isFinite(Number(remoteTotalRaw)) ? Number(remoteTotalRaw) : null;
                    if (remoteTotal !== null) {
                        computedTotal = Math.max(computedTotal, mergedImages.length, remoteTotal);
                    } else {
                        computedTotal = Math.max(computedTotal, mergedImages.length);
                    }
                    const targetHasMore = remoteTotal !== null
                        ? mergedImages.length < remoteTotal
                        : newImages.length === effectivePageSize;
                    computedHasMore = computedHasMore || targetHasMore;
                } catch (err) {
                    console.warn(`SomniumNexusStore: 加载分类 ${categoryId} 远端 ${target.remoteId} 第 ${targetPage} 页失败`, err);
                }
            }

            const safeTitle = (existing && existing.title) || categoryId;
            const safeDescription = (existing && existing.description) || "";

            const hasMore = Number.isFinite(computedTotal)
                ? !((mergedImages.length >= computedTotal) || (targetPage * effectivePageSize >= computedTotal))
                : computedHasMore;

            this._productionGalleryData[resolvedKey] = {
                ...existing,
                title: safeTitle,
                description: safeDescription,
                images: mergedImages,
                imageCount: mergedImages.length
            };
            this.normalizeProductionData();

            this._categoryPageState[resolvedKey] = {
                page: targetPage,
                pageSize: effectivePageSize,
                total: computedTotal,
                hasMore,
                isLoading: false,
                aliasesLoaded: true
            };

            console.log(`SomniumNexusStore: 分类 ${categoryId} 第 ${targetPage} 页图片列表已加载，包含 ${targets.length} 个远端`);
            return true;
        } catch (error) {
            console.error(`SomniumNexusStore: 加载分类 ${categoryId} 第 ${targetPage} 页图片列表失败:`, error);
            this._categoryPageState[resolvedKey] = {
                ...pagination,
                page: pagination.page,
                pageSize: effectivePageSize,
                isLoading: false,
                hasMore: pagination.hasMore
            };
            return false;
        }
    };

    // 加载指定分类的下一页图片
    loadNextCategoryPage = async (categoryId) => {
        if (this._useTestData || !categoryId) {
            return false;
        }

        const pagination = this.getCategoryPageState(categoryId);
        if (pagination.isLoading || !pagination.hasMore) {
            return false;
        }

        const nextPage = (pagination.page || 0) + 1;
        return this.loadCategoryPage(categoryId, nextPage, {pageSize: pagination.pageSize || DEFAULT_PAGE_SIZE});
    };

    // 加载指定分类下的图片（仅正式环境，首屏使用）
    loadCategoryDetail = async (categoryId, options = {}) => {
        if (this._useTestData) {
            return false;
        }

        const resolvedKey = this.resolveCategoryKey(categoryId);
        const {force = false, reset = false, pageSize} = options;
        const existing = this._productionGalleryData[resolvedKey] || {};
        if (!force && Array.isArray(existing.images) && existing.images.length > 0) {
            return false;
        }

        if (reset) {
            this.resetCategoryPagination(resolvedKey);
        }

        return this.loadCategoryPage(resolvedKey, 1, {pageSize: pageSize || DEFAULT_PAGE_SIZE, reset});
    };

    // 数据获取方法（兼容测试和正式环境）
    getImageById = (imageId) => {
        const data = this.galleryCategories;
        if (!data) return null;

        for (const category of Object.values(data)) {
            const image = category.images.find(img => img.id === imageId);
            if (image) return image;
        }
        return null;
    };

    getAllImages = () => {
        const data = this.galleryCategories;
        if (!data) return [];

        const allImages = [];
        Object.values(data).forEach(category => {
            allImages.push(...category.images);
        });
        return allImages;
    };

    getImagesByCategory = (category) => {
        const data = this.galleryCategories;
        if (!category) return [];
        const resolved = this.resolveCategoryKey(category);
        return data && data[resolved] ? data[resolved].images : [];
    };

    // 统计信息
    getTotalImageCount = () => {
        return this.getAllImages().length;
    };

    getCategoryImageCount = (category) => {
        const data = this.galleryCategories;
        return data && data[category] ? data[category].images.length : 0;
    };

    // UI状态管理方法
    setSelectedCategory = (category) => {
        const resolved = this.resolveCategoryKey(category);
        const data = this.galleryCategories;
        if (category === null || category === undefined) {
            // 清除选中状态
            this._selectedCategory = null;
            this._selectedSubCategory = null;
            this._hasSubMenu = false;
            this._subCategories = [];
            this._hoverSubCategories = [];
        } else if (data && data[resolved]) {
            this._selectedCategory = resolved;
            this._selectedSubCategory = null;

            // 检查是否有子菜单
            const hasSubMenu = data[resolved].hasSubMenu || false;
            this._hasSubMenu = hasSubMenu;

            // 设置子菜单数据
            if (hasSubMenu && data[resolved].subCategories) {
                this._subCategories = [...data[resolved].subCategories];
            } else {
                this._subCategories = [];
            }

            // 在正式环境下，选中任意分类时都尝试加载详情和图片
            if (!this._useTestData) {
                // 优先补全分类设置，避免缺失 layoutMode 时回落到自由布局
                this.ensureCategorySettings(resolved);
                this.loadCategoryDetail(resolved);
                // 切换分类时主动拉取首屏图片（含别名，避免子分类无图），并后台预取后续页
                const initialSize = Math.min(INITIAL_PAGE_SIZE, DEFAULT_PAGE_SIZE);
                this.loadCategoryPage(resolved, 1, {reset: true, forceAlias: true, pageSize: initialSize})
                    .then(() => this.prefetchCategoryImages(resolved))
                    .catch(() => {});
            }
        }
    };

    /**
     * 后台预取更多图片（在首屏加载完成后启动）
     */
    prefetchCategoryImages = async (categoryId) => {
        if (!categoryId || this._useTestData) return;
        const resolved = this.resolveCategoryKey(categoryId);
        // 防止切换分类后仍在预取
        if (this._selectedCategory && this._selectedCategory !== resolved) {
            return;
        }

        let state = this.getCategoryPageState(resolved);
        if (!state.hasMore) return;

        let nextPage = state.page + 1;
        let fetchedPages = 0;

        while (state.hasMore && fetchedPages < MAX_PREFETCH_PAGES) {
            // 如果用户切换了分类，停止预取
            if (this._selectedCategory && this._selectedCategory !== resolved) {
                break;
            }
            const ok = await this.loadCategoryPage(resolved, nextPage, {forceAlias: false});
            if (!ok) break;
            fetchedPages += 1;
            nextPage += 1;
            state = this.getCategoryPageState(resolved);
        }
    };

    setSelectedSubCategory = (subCategoryKey) => {
        this._selectedSubCategory = subCategoryKey;

        // 选择子分类时，如果存在折叠别名，强制加载一次包含别名的首屏图片
        if (!this._useTestData && this._selectedCategory) {
            const resolved = this.resolveCategoryKey(this._selectedCategory);
            const categoryData = this._productionGalleryData[resolved] || {};
            const hasSubImages = Array.isArray(categoryData.images) && categoryData.images.some((img) =>
                img.subCategory === subCategoryKey || img.category === subCategoryKey
            );
            const pageState = this.getCategoryPageState(resolved);
            const shouldForce = !hasSubImages || !pageState.aliasesLoaded;

            this.loadCategoryPage(resolved, 1, {forceAlias: true, force: shouldForce});
        }
    };

    clearSelectedSubCategory = () => {
        this._selectedSubCategory = null;
    };

    setSubCategoriesForHover = (subCategories) => {
        this._hoverSubCategories = subCategories;
    };

    setSelectedImage = (image) => {
        this._selectedImage = image;
        this._isModalOpen = !!image;
    };

    clearSelectedImage = () => {
        this._selectedImage = null;
        this._isModalOpen = false;
    };

    setHoveredImage = (imageId) => {
        this._hoveredImage = imageId;
    };

    clearHoveredImage = () => {
        this._hoveredImage = null;
    };

    // 模态框控制
    openModal = (image) => {
        this.setSelectedImage(image);
    };

    closeModal = () => {
        this.clearSelectedImage();
    };

    // 导航方法
    navigateToNextImage = () => {
        if (!this._selectedImage) return;

        const currentImages = this.currentCategoryImages;
        const currentIndex = currentImages.findIndex(img => img.id === this._selectedImage.id);

        if (currentIndex !== -1 && currentIndex < currentImages.length - 1) {
            this.setSelectedImage(currentImages[currentIndex + 1]);
        }
    };

    navigateToPreviousImage = () => {
        if (!this._selectedImage) return;

        const currentImages = this.currentCategoryImages;
        const currentIndex = currentImages.findIndex(img => img.id === this._selectedImage.id);

        if (currentIndex > 0) {
            this.setSelectedImage(currentImages[currentIndex - 1]);
        }
    };

    // 数据备份和恢复
    backupCurrentLayoutData(categoryId, layoutData) {
        if (this.isUsingTestData) {
            testDataStore.saveLayoutData(categoryId, layoutData);
        } else {
            // 正式环境的数据备份逻辑
            console.log('正式环境布局数据备份:', categoryId);
        }
    }

    restoreLayoutData(categoryId) {
        if (this.isUsingTestData) {
            return testDataStore.restoreLayoutData(categoryId);
        } else {
            // 正式环境的数据恢复逻辑
            console.log('正式环境布局数据恢复:', categoryId);
            return null;
        }
    }

    // 获取环境信息
    getEnvironmentInfo() {
        return {
            isTestEnvironment: this.isUsingTestData,
            isProductionEnvironment: this.isProductionEnvironment,
            testDataEnabled: testDataStore.isTestEnvironment,
            categoryCount: this.categories.length,
            totalImageCount: this.getTotalImageCount()
        };
    }
}

const somniumNexusStore = new SomniumNexusStore();
export default somniumNexusStore;
