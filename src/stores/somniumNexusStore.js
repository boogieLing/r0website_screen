import {makeAutoObservable, computed} from "mobx";
import testDataStore from "./testDataStore";

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
            baseData = {
                ...this._productionGalleryData,
                ...this._userProjects
            };
        }

        // 不再添加"全部"分类，只返回基础数据
        return baseData;
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
        return Object.keys(data);
    }

    get currentCategory() {
        const data = this.galleryCategories;
        return data && this._selectedCategory ? data[this._selectedCategory] : null;
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
            return category.images.filter(image =>
                image.subCategory === this._selectedSubCategory ||
                image.category === this._selectedSubCategory
            );
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

    // 环境管理方法 | Environment management
    enableTestEnvironment() {
        testDataStore.enableTestEnvironment();
        this._useTestData = true;
        this._productionGalleryData = {};
        console.log('SomniumNexusStore: 测试环境已启用');
    }

    disableTestEnvironment() {
        testDataStore.disableTestEnvironment();
        this._useTestData = false;
        console.log('SomniumNexusStore: 测试环境已禁用');
    }

    // 正式环境数据管理 | Production data management
    setProductionData(galleryData) {
        this._productionGalleryData = { ...galleryData };
        this._useTestData = false;
        console.log('SomniumNexusStore: 正式数据已加载');
    }

    addProductionCategory(categoryKey, categoryData) {
        this._productionGalleryData[categoryKey] = { ...categoryData };
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
            projectType: 'user-created'
        };

        this._userProjects[categoryKey] = projectData;
        console.log(`用户项目 "${categoryData.title}" 已添加到增量数据`, projectData);

        // 自动保存到本地存储（如果可用）
        this.saveUserProjectsToLocal();

        return projectData;
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
                    this._userProjects = loadedProjects;
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
    }

    clearProductionData() {
        this._productionGalleryData = {};
    }

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
        return data && data[category] ? data[category].images : [];
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
        const data = this.galleryCategories;
        if (category === null || category === undefined) {
            // 清除选中状态
            this._selectedCategory = null;
            this._selectedSubCategory = null;
            this._hasSubMenu = false;
            this._subCategories = [];
            this._hoverSubCategories = [];
        } else if (data && data[category]) {
            this._selectedCategory = category;
            this._selectedSubCategory = null;

            // 检查是否有子菜单
            const hasSubMenu = data[category].hasSubMenu || false;
            this._hasSubMenu = hasSubMenu;

            // 设置子菜单数据
            if (hasSubMenu && data[category].subCategories) {
                this._subCategories = [...data[category].subCategories];
            } else {
                this._subCategories = [];
            }
        }
    };

    setSelectedSubCategory = (subCategoryKey) => {
        this._selectedSubCategory = subCategoryKey;
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