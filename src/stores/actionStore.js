import {makeAutoObservable, runInAction} from 'mobx';
import flexGalleryStore from './flexGalleryStore';
import galleryStore from './galleryStore';
import {environmentManager, LAYOUT_TYPES} from '@/utils/environment';
import somniumNexusStore from './somniumNexusStore';
import testDataStore from './testDataStore';
import {dataMigrationManager} from '@/utils/dataMigration';

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
                { key: 'freeform', title: '自由布局' }
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
                        console.log('切换到Flex网格布局');
                        this.switchToFlexLayout();
                        break;
                    case 'layout-freeform':
                        console.log('切换到自由布局');
                        this.switchToFreeformLayout();
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
     * 创建新项目
     */
    async createNewProject() {
        if (!this.newProjectName.trim()) {
            console.warn('项目名称不能为空');
            return false;
        }

        runInAction(() => {
            this.isCreatingProject = true;
        });

        try {
            // 模拟异步创建过程
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 创建新项目数据
            const newProjectData = {
                title: this.newProjectName.trim(),
                key: `project-${Date.now()}`,
                hasSubMenu: true,
                subCategories: [],
                images: [],
                isNewProject: true,
                createdAt: new Date().toISOString()
            };

            // 这里应该调用 somniumNexusStore 的方法来添加新项目
            // 暂时通过事件或回调的方式处理
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
            return false;
        }
    }

    /**
     * 切换编辑模式
     * 根据当前布局类型切换对应的编辑模式
     */
    toggleEditMode() {
        const currentLayout = environmentManager.getCurrentLayoutType();

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
        const currentLayout = environmentManager.getCurrentLayoutType();

        if (currentLayout === LAYOUT_TYPES.FLEX) {
            return flexGalleryStore.editMode;
        } else {
            return galleryStore.editMode;
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