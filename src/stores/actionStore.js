import {makeAutoObservable, runInAction} from 'mobx';
import flexGalleryStore from './flexGalleryStore';
import galleryStore from './galleryStore';
import {environmentManager, LAYOUT_TYPES} from '@/utils/environment';
import somniumNexusStore from './somniumNexusStore';
import testDataStore from './testDataStore';
import {dataMigrationManager} from '@/utils/dataMigration';
import {createCategory, updateCategoryLayoutMode} from '@/request/categoryApi';
import {updateImagePosition, uploadImage} from '@/request/imageApi';

/**
 * 操作管理Store
 * 专门管理操作相关的状态，与项目分类独立
 */
class ActionStore {
    // 操作分类数据
    actionCategories = {
        'workspace': {
            title: '工作区',
            key: 'workspace',
            hasSubMenu: true,
            subCategories: [
                { key: 'new-project', title: '新建项目' },
                { key: 'upload-image', title: '上传图片' },
                { key: 'open-project', title: '打开项目' },
                { key: 'recent', title: '最近使用' }
            ]
        },
        'layout': {
            title: '布局',
            key: 'layout',
            hasSubMenu: true,
            subCategories: [
                { key: 'flex', title: 'Flex网格' },
                { key: 'freeform', title: '自由布局' },
                { key: 'save-layout', title: '保存布局' }
            ]
        },
        'data': {
            title: '数据',
            key: 'data',
            hasSubMenu: true,
            subCategories: [
                { key: 'test', title: '测试数据' },
                { key: 'production', title: '正式数据' },
                { key: 'migrate', title: '数据迁移' }
            ]
        },
        'settings': {
            title: '设置',
            key: 'settings',
            hasSubMenu: true,
            subCategories: [
                { key: 'preferences', title: '偏好设置' },
                { key: 'account', title: '账户设置' },
                { key: 'appearance', title: '外观设置' },
                { key: 'edit-toggle', title: '编辑模式' },
                { key: 'clear-storage', title: '清除存储' }
            ]
        },
        'tools': {
            title: '工具',
            key: 'tools',
            hasSubMenu: false // 没有次级菜单的操作
        },
        'help': {
            title: '帮助',
            key: 'help',
            hasSubMenu: true,
            subCategories: [
                { key: 'docs', title: '文档' },
                { key: 'tutorials', title: '教程' },
                { key: 'about', title: '关于' }
            ]
        }
    };

    // 当前选中的操作分类（独立的项目选中态）
    selectedActionCategory = null;

    // 当前选中的操作子分类
    selectedActionSubCategory = null;

    // 悬停状态的操作子分类列表
    hoverActionSubCategories = [];

    // 是否显示操作的次级菜单
    showActionSecondFlow = false;

    // 操作加载状态
    isActionLoading = false;

    // 新建项目对话框状态
    isNewProjectModalOpen = false;
    newProjectName = '';
    isCreatingProject = false;

    // 上传图片对话框状态
    isUploadImageModalOpen = false;
    isUploadingImage = false;

    // 上传结果提示弹窗状态
    isUploadResultModalOpen = false;
    uploadResult = null;

    constructor() {
        makeAutoObservable(this);
    }

    /**
     * 设置选中的操作分类
     */
    setSelectedActionCategory(categoryKey) {
        this.selectedActionCategory = categoryKey;
        this.selectedActionSubCategory = null; // 清除子分类选中态

        // 如果没有子菜单，不保持选中态
        if (categoryKey && !this.actionCategories[categoryKey]?.hasSubMenu) {
            // 执行相应的操作，然后清除选中态
            this.executeAction(categoryKey);
            this.clearActionSelection();
        }
    }

    /**
     * 设置选中的操作子分类
     */
    setSelectedActionSubCategory(subCategoryKey) {
        this.selectedActionSubCategory = subCategoryKey;
        if (subCategoryKey) {
            this.executeSubAction(this.selectedActionCategory, subCategoryKey);
        }
    }

    /**
     * 设置悬停状态的操作子分类
     */
    setActionSubCategoriesForHover(subCategories) {
        this.hoverActionSubCategories = subCategories || [];
    }

    /**
     * 清除操作选中态
     */
    clearActionSelection() {
        this.selectedActionCategory = null;
        this.selectedActionSubCategory = null;
        this.hoverActionSubCategories = [];
        this.showActionSecondFlow = false;
    }

    /**
     * 重置所有操作状态（用于注销时）
     */
    resetAllActionStates() {
        this.selectedActionCategory = null;
        this.selectedActionSubCategory = null;
        this.hoverActionSubCategories = [];
        this.showActionSecondFlow = false;
        this.isEditModeActive = false;
        this.currentLayoutType = 'flex';
        console.log('所有操作状态已重置');
    }

    /**
     * 清除操作子分类选中态
     */
    clearSelectedActionSubCategory() {
        this.selectedActionSubCategory = null;
    }

    /**
     * 设置操作次级菜单显示状态
     */
    setShowActionSecondFlow(show) {
        this.showActionSecondFlow = show;
    }

    /**
     * 执行操作分类对应的功能
     */
    executeAction(categoryKey) {
        runInAction(() => {
            this.isActionLoading = true;
        });

        // 模拟异步操作
        setTimeout(() => {
            runInAction(() => {
                this.isActionLoading = false;

                // 根据categoryKey执行不同的操作
                switch (categoryKey) {
                    case 'tools':
                        console.log('打开工具面板');
                        // 这里可以触发工具面板的显示
                        break;
                    default:
                        console.log(`执行操作: ${categoryKey}`);
                }
            });
        }, 300);
    }

    /**
     * 执行操作子分类对应的功能
     */
    executeSubAction(categoryKey, subCategoryKey) {
        runInAction(() => {
            this.isActionLoading = true;
        });

        // 模拟异步操作
        setTimeout(() => {
            runInAction(() => {
                this.isActionLoading = false;

                // 根据categoryKey和subCategoryKey执行不同的操作
                const actionKey = `${categoryKey}-${subCategoryKey}`;
                switch (actionKey) {
                    case 'workspace-new-project':
                        console.log('创建新项目');
                        this.openNewProjectModal();
                        break;
                    case 'workspace-upload-image':
                        console.log('上传图片');
                        this.openUploadImageModal();
                        break;
                    case 'workspace-open-project':
                        console.log('打开项目');
                        break;
                    case 'settings-preferences':
                        console.log('打开偏好设置');
                        break;
                    case 'settings-account':
                        console.log('打开账户设置');
                        break;
                    case 'settings-appearance':
                        console.log('打开外观设置');
                        break;
                    case 'settings-edit-toggle':
                        console.log('切换编辑模式');
                        this.toggleEditMode();
                        break;
                    case 'layout-flex':
                        console.log('将当前分类布局设置为 Flex 网格');
                        this.updateCurrentCategoryLayoutMode('flex');
                        break;
                    case 'layout-freeform':
                        console.log('将当前分类布局设置为自由布局');
                        this.updateCurrentCategoryLayoutMode('freedom');
                        break;
                    case 'layout-save-layout':
                        console.log('保存当前分类布局');
                        this.saveCurrentLayout();
                        break;
                    case 'data-test':
                        console.log('切换到测试数据');
                        this.switchToTestData();
                        break;
                    case 'data-production':
                        console.log('切换到正式数据');
                        this.switchToProductionData();
                        break;
                    case 'data-migrate':
                        console.log('执行数据迁移');
                        this.migrateData();
                        break;
                    case 'help-docs':
                        console.log('打开文档');
                        break;
                    case 'help-about':
                        console.log('显示关于信息');
                        break;
                    default:
                        console.log(`执行子操作: ${actionKey}`);
                }
            });
        }, 300);
    }

    /**
     * 获取当前选中的操作分类数据
     */
    get currentActionCategory() {
        if (!this.selectedActionCategory) return null;
        return this.actionCategories[this.selectedActionCategory];
    }

    /**
     * 检查是否有操作分类被选中
     */
    get hasSelectedAction() {
        return !!this.selectedActionCategory;
    }

    /**
     * 获取操作分类的键数组
     */
    get actionCategoryKeys() {
        return Object.keys(this.actionCategories);
    }

    /**
     * 根据键获取操作分类数据
     */
    getActionCategory(key) {
        return this.actionCategories[key] || null;
    }

    /**
     * 新建项目对话框相关方法
     */
    openNewProjectModal() {
        this.isNewProjectModalOpen = true;
        this.newProjectName = '';
        this.isCreatingProject = false;
    }

    closeNewProjectModal() {
        this.isNewProjectModalOpen = false;
        this.newProjectName = '';
        this.isCreatingProject = false;
    }

    setNewProjectName(name) {
        this.newProjectName = name;
    }

    /**
     * 上传图片对话框相关方法
     */
    openUploadImageModal() {
        this.isUploadImageModalOpen = true;
        this.isUploadingImage = false;
    }

    closeUploadImageModal() {
        this.isUploadImageModalOpen = false;
        this.isUploadingImage = false;
    }

    openUploadResultModal(result) {
        this.uploadResult = result;
        this.isUploadResultModalOpen = true;
    }

    closeUploadResultModal() {
        this.isUploadResultModalOpen = false;
        this.uploadResult = null;
    }

    async uploadImageAsync(file, options = {}) {
        if (!file) {
            return;
        }

        runInAction(() => {
            this.isUploadingImage = true;
        });

        try {
            const response = await uploadImage(file, options);

            let status = 'success';
            let message = '图片上传成功';

            if (response && response.data) {
                if (response.data.code === 200) {
                    if (response.data.msg) {
                        message = response.data.msg;
                    }
                } else {
                    status = 'error';
                    message = response.data.msg || '图片上传失败';
                }
            }

            runInAction(() => {
                this.openUploadResultModal({
                    status,
                    message
                });
            });
        } catch (error) {
            console.error('图片上传失败:', error);
            runInAction(() => {
                const message = typeof error === 'string'
                    ? error
                    : '图片上传失败或超时，请稍后重试';
                this.openUploadResultModal({
                    status: 'error',
                    message
                });
            });
        } finally {
            runInAction(() => {
                this.isUploadingImage = false;
            });
        }
    }

    /**
     * 创建新项目
     */
    async createNewProject() {
        if (!this.newProjectName.trim()) {
            console.warn('项目名称不能为空');
            throw new Error('项目名称不能为空');
        }

        runInAction(() => {
            this.isCreatingProject = true;
        });

        try {
            const title = this.newProjectName.trim();
            const description = `Somnium Nexus 项目：${title}`;

            // 生成分类ID：基于名称的简单slug，不为空则使用slug，否则使用时间戳
            const rawId = title.toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9\-_]/g, '');
            const categoryId = rawId || `category-${Date.now()}`;

            // 向后端写入分类级布局模式：flex / freedom
            const layoutModeForServer = environmentManager.getCurrentLayoutType() === LAYOUT_TYPES.FLEX
                ? 'flex'
                : 'freedom';

            await createCategory({
                id: categoryId,
                name: title,
                description,
                layoutMode: layoutModeForServer,
                gridSize: 10,
                autoArrange: true
            });

            const newProjectData = {
                title,
                description,
                key: categoryId,
                categoryId,
                hasSubMenu: false,
                subCategories: [],
                images: [],
                isNewProject: true,
                createdAt: new Date().toISOString(),
                settings: {
                    layoutMode: layoutModeForServer
                }
            };

            console.log('新项目创建成功:', newProjectData);

            runInAction(() => {
                this.isCreatingProject = false;
                this.closeNewProjectModal();
            });

            return newProjectData;
        } catch (error) {
            console.error('创建项目失败:', error);
            runInAction(() => {
                this.isCreatingProject = false;
            });
            throw error;
        }
    }

    /**
     * 更新当前选中分类的布局模式（调用后端接口）
     * layoutMode 取值：'flex' | 'freedom'
     */
    async updateCurrentCategoryLayoutMode(layoutMode) {
        const categoryId = somniumNexusStore.selectedCategory;
        const subCategoryId = somniumNexusStore.selectedSubCategory;

        if (!categoryId) {
            alert('请先选择一个项目分类');
            return;
        }

        if (environmentManager.isTestEnvironment()) {
            alert('当前为测试环境，无法修改分类布局模式（仅正式环境可用）');
            return;
        }

        try {
            // 确认应使用的远端ID：子分类为独立分类，优先取其 remoteId
            const categoryData = somniumNexusStore.galleryCategories[categoryId] || {};
            const norm = somniumNexusStore.normalizeKeyForCompare
                ? somniumNexusStore.normalizeKeyForCompare
                : (v) => String(v || '').trim().toLowerCase();

            let activeKey = subCategoryId || categoryId;
            let targetId = null;
            let aliasKeyForLayout = null;

            if (subCategoryId && Array.isArray(categoryData.aliasCategoryDetails)) {
                const subNormalized = norm(subCategoryId);
                const detail = categoryData.aliasCategoryDetails.find((item) => {
                    const keyNorm = norm(item.key);
                    const tailNorm = norm((item.key || '').split('/').pop());
                    return subNormalized && (keyNorm === subNormalized || tailNorm === subNormalized);
                });

                if (detail) {
                    activeKey = detail.key || subCategoryId;
                    aliasKeyForLayout = detail.key || subCategoryId;
                    targetId = detail.remoteId || targetId;
                }
            }

            const resolvedKey = somniumNexusStore.resolveCategoryKey
                ? somniumNexusStore.resolveCategoryKey(activeKey)
                : activeKey;

            if (!targetId) {
                targetId = somniumNexusStore.getRemoteId
                    ? somniumNexusStore.getRemoteId(activeKey)
                    : activeKey;
            }

            targetId = targetId || resolvedKey || activeKey;

            await updateCategoryLayoutMode(targetId, layoutMode);
            somniumNexusStore.setCategoryLayoutMode(resolvedKey, layoutMode, {
                aliasKey: aliasKeyForLayout || subCategoryId || null
            });

            const modeText = layoutMode === 'flex' ? 'Flex网格' : '自由布局';
            const logKey = subCategoryId ? `${resolvedKey}/${subCategoryId}` : resolvedKey;
            console.log(`分类 ${logKey}(${targetId}) 布局模式已更新为 ${modeText}`);
            alert(`已将当前分类布局设置为：${modeText}`);
        } catch (error) {
            console.error('更新分类布局模式失败:', error);
            alert('更新分类布局模式失败，请稍后重试或查看控制台日志');
        }
    }

    /**
     * 切换编辑模式
     * 根据当前分类的布局类型切换对应的编辑模式
     */
    toggleEditMode() {
        const category = somniumNexusStore.currentCategory;
        const activeLayoutMode = somniumNexusStore.getActiveLayoutMode(category);
        const categoryLayoutMode = activeLayoutMode || somniumNexusStore.getCategoryLayoutMode(category);
        let currentLayout = environmentManager.getCurrentLayoutType();

        if (!somniumNexusStore.isUsingTestData && categoryLayoutMode) {
            if (categoryLayoutMode === 'flex') {
                currentLayout = LAYOUT_TYPES.FLEX;
            } else if (categoryLayoutMode === 'freedom' || categoryLayoutMode === 'freeform') {
                currentLayout = LAYOUT_TYPES.FREEFORM;
            }
        }

        if (currentLayout === LAYOUT_TYPES.FLEX) {
            // 切换Flex布局的编辑模式
            flexGalleryStore.toggleEditMode();
            const newMode = flexGalleryStore.editMode ? '编辑模式' : '展示模式';
            console.log(`Flex布局已切换到${newMode}`);
        } else {
            // 切换Freeform布局的编辑模式
            galleryStore.toggleEditMode();
            const newMode = galleryStore.editMode ? '编辑模式' : '展示模式';
            console.log(`Freeform布局已切换到${newMode}`);
        }
    }

    /**
     * 获取当前编辑模式状态
     */
    get isEditModeActive() {
        const category = somniumNexusStore.currentCategory;
        const activeLayoutMode = somniumNexusStore.getActiveLayoutMode(category);
        const categoryLayoutMode = activeLayoutMode || somniumNexusStore.getCategoryLayoutMode(category);
        let currentLayout = environmentManager.getCurrentLayoutType();

        if (!somniumNexusStore.isUsingTestData && categoryLayoutMode) {
            if (categoryLayoutMode === 'flex') {
                currentLayout = LAYOUT_TYPES.FLEX;
            } else if (categoryLayoutMode === 'freedom' || categoryLayoutMode === 'freeform') {
                currentLayout = LAYOUT_TYPES.FREEFORM;
            }
        }

        if (currentLayout === LAYOUT_TYPES.FLEX) {
            return flexGalleryStore.editMode;
        } else {
            return galleryStore.editMode;
        }
    }

    /**
     * 保存当前分类下的布局（仅自由布局）
     * 将当前分类下所有图片的位置信息同步到后端
     */
    async saveCurrentLayout() {
        const category = somniumNexusStore.currentCategory;
        const categoryLayoutMode = somniumNexusStore.getCategoryLayoutMode(category);
        let layoutType = environmentManager.getCurrentLayoutType();

        if (!somniumNexusStore.isUsingTestData && categoryLayoutMode) {
            if (categoryLayoutMode === 'flex') {
                layoutType = LAYOUT_TYPES.FLEX;
            } else if (categoryLayoutMode === 'freedom' || categoryLayoutMode === 'freeform') {
                layoutType = LAYOUT_TYPES.FREEFORM;
            }
        }
        const categoryId = somniumNexusStore.selectedCategory;

        if (!categoryId) {
            alert('请先选择一个项目分类');
            return;
        }

        if (environmentManager.isTestEnvironment()) {
            alert('当前为测试数据环境，布局只会在本地生效，不会调用后端接口');
            return;
        }

        if (layoutType !== LAYOUT_TYPES.FREEFORM) {
            alert('目前仅支持在自由布局模式下保存位置');
            return;
        }

        // GalleryStore 中使用的分类ID可能与项目分类ID不同（例如默认使用"default"）
        const galleryCategoryId = galleryStore.currentCategory || categoryId;
        const items = galleryStore.getItemsByCategory(galleryCategoryId);
        if (!items || items.length === 0) {
            alert('当前分类下没有可保存的图片');
            return;
        }

        const categoryData = somniumNexusStore.galleryCategories[categoryId];
        const categoryName = (categoryData && categoryData.title) || categoryId;
        const gridSize = 10;

        try {
            const saveTasks = items.map((item, index) => {
                const image = item.originalImage;
                const imageId = image && image.id;

                // 测试数据或无效图片ID不尝试保存到服务端
                if (!imageId) {
                    return Promise.resolve(null);
                }

                const existingPosition = (image && image.position) || {};

                const row = typeof item.row === 'number' ? item.row : Math.floor(index / 3);
                const col = typeof item.col === 'number' ? item.col : index % 3;

                const payload = {
                    categoryId: categoryId,
                    position: {
                        // 先展开已有的位置信息，避免丢失 categoryName / sortOrder / addedAt 等字段
                        ...existingPosition,
                        x: item.x,
                        y: item.y,
                        width: item.width,
                        height: item.height,
                        gridX: Math.round(item.x / gridSize),
                        gridY: Math.round(item.y / gridSize),
                        gridSize: gridSize,
                        row: row,
                        col: col,
                        layoutMode: 'freeform',
                        zIndex: typeof existingPosition.zIndex === 'number'
                            ? existingPosition.zIndex
                            : index + 1,
                        isVisible: typeof existingPosition.isVisible === 'boolean'
                            ? existingPosition.isVisible
                            : true,
                        version: typeof existingPosition.version === 'number'
                            ? existingPosition.version + 1
                            : 1,
                        categoryName: existingPosition.categoryName || categoryName,
                        sortOrder: typeof existingPosition.sortOrder === 'number'
                            ? existingPosition.sortOrder
                            : index
                    }
                };

                return updateImagePosition(imageId, payload).catch((error) => {
                    console.error('保存图片位置失败:', imageId, error);
                    // 把错误抛出去，让整体 Promise.all 捕获
                    throw error;
                });
            });

            await Promise.all(saveTasks);
            alert('当前分类布局已保存到服务器');
        } catch (error) {
            console.error('保存布局失败:', error);
            alert('保存布局失败，请稍后重试或查看控制台日志');
        }
    }

    /**
     * 切换到Flex布局
     */
    switchToFlexLayout() {
        environmentManager.switchToFlexLayout();
        console.log('已切换到Flex网格布局');
    }

    /**
     * 切换到自由布局
     */
    switchToFreeformLayout() {
        environmentManager.switchToFreeformLayout();
        console.log('已切换到自由布局');
    }

    /**
     * 获取当前布局类型
     */
    get currentLayoutType() {
        return environmentManager.getCurrentLayoutType();
    }

    /**
     * 切换到测试数据
     */
    switchToTestData() {
        environmentManager.switchToTestEnvironment();
        console.log('已切换到测试数据环境');
    }

    /**
     * 切换到正式数据
     */
    switchToProductionData() {
        environmentManager.switchToProductionEnvironment();
        console.log('已切换到正式数据环境');
    }

    /**
     * 执行数据迁移
     */
    async migrateData() {
        try {
            console.log('开始数据迁移...');
            await dataMigrationManager.performFullMigration({
                includeLayoutData: true,
                backupTestData: true,
                clearAfterMigration: false
            });
            console.log('数据迁移完成');
        } catch (error) {
            console.error('数据迁移失败:', error);
        }
    }

    /**
     * 获取当前环境类型
     */
    get currentEnvironmentType() {
        return environmentManager.getCurrentEnvironment();
    }

    /**
     * 检查是否使用测试数据
     */
    get isUsingTestData() {
        return somniumNexusStore.useTestData;
    }
}

export default new ActionStore();
