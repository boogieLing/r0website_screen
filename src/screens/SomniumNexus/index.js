import React, {useEffect, useState, useCallback} from "react";
import {observer} from "mobx-react-lite";
import {useParams} from "react-router-dom";
import globalStore from "@/stores/globalStore";
import somniumNexusStore from "@/stores/somniumNexusStore";
import userStore from "@/stores/userStore";
import actionStore from "@/stores/actionStore";
import GalleryFlex from "@/components/GalleryFlex/GalleryFlex";
import FlexGalleryContainer from "@/components/FlexGalleryContainer/FlexGalleryContainer";
import galleryStore from "@/stores/galleryStore";
import flexGalleryStore from "@/stores/flexGalleryStore";
import GracefulImage from "@/components/SkeletonImage/GracefulImage";
import SimpleWelcomeModule from "./SimpleWelcomeModule";
import CollapsedSidebar from "./CollapsedSidebar";
import SomniumLogin from "@/components/SomniumLogin/SomniumLogin";
import TriangleLoginIcon from "@/components/SomniumLogin/TriangleLoginIcon";
import NewProjectModal from "@/components/NewProjectModal/NewProjectModal";
import signLineImg from "@/static/pic/sign_line.png";
import styles from "./index.module.less";
import {environmentManager, LAYOUT_TYPES} from "@/utils/environment";

const SomniumNexus = observer(() => {
    const {category} = useParams();
    // eslint-disable-next-line
    const [, setSelectedProject] = useState("stillness");
    const [showSecondFlow, setShowSecondFlow] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(false); // 默认展开侧边栏
    const [isAnimating, setIsAnimating] = useState(false); // 动画状态
    const [hasSelected, setHasSelected] = useState(false); // 跟踪用户是否选择了项目
    const [hoveredCategory, setHoveredCategory] = useState(null); // 跟踪hover的类别
    const [hoveredActionCategory, setHoveredActionCategory] = useState(null); // 跟踪hover的操作类别
    const [currentLayout, setCurrentLayout] = useState(environmentManager.getCurrentLayoutType()); // 当前布局类型
    const [showLoginModal, setShowLoginModal] = useState(false); // 登录模态框状态
    const [showActionTempSubMenu, setShowActionTempSubMenu] = useState(false); // 临时action子菜单显示状态

    const categories = somniumNexusStore.categories;
    const currentImages = somniumNexusStore.currentCategoryImages;

    useEffect(() => {
        // 设置页面标题 | Set page title
        globalStore.setWebSiteTitle("Somnium Nexus - R0!");

        // 如果有URL参数，设置选中分类 | If URL param exists, set selected category
        if (category && somniumNexusStore.galleryCategories[category]) {
            somniumNexusStore.setSelectedCategory(category);
            setHasSelected(true);

            // 清除子分类选择，显示所有图片
            somniumNexusStore.clearSelectedSubCategory();

            // 如果有子菜单，不自动展开侧边栏，但标记次级菜单可用
            if (somniumNexusStore.galleryCategories[category].hasSubMenu) {
                setSidebarExpanded(false); // 不自动展开侧边栏
                setShowSecondFlow(true); // 但次级菜单可用
            }
        }
    }, [category]);

    // 监听布局变化
    useEffect(() => {
        const handleLayoutChange = () => {
            setCurrentLayout(environmentManager.getCurrentLayoutType());
        };

        // 监听环境变化（包括布局变化）
        environmentManager.addEnvironmentChangeListener(handleLayoutChange);

        return () => {
            environmentManager.removeEnvironmentChangeListener(handleLayoutChange);
        };
    }, []);

    // 取消自动选择"全部"分类，让用户手动选择
    useEffect(() => {
        // 不再自动选择任何分类，让用户手动选择
        // 这样可以避免强制用户从"全部"tab开始
        console.log('项目分类已加载，等待用户手动选择');
    }, [categories]); // 依赖categories，确保在数据加载完成后执行

    // 点击sidebarHeader取消所有选择，回到初始状态
    const handleSidebarHeaderClick = useCallback(() => {
        console.log('点击sidebarHeader，清除所有选择状态');

        // 清除项目相关状态
        somniumNexusStore.setSelectedCategory(null);
        somniumNexusStore.clearSelectedSubCategory();
        somniumNexusStore.setSubCategoriesForHover([]);
        somniumNexusStore.clearSelectedImage();

        // 清除操作相关状态
        actionStore.clearActionSelection();

        // 清除UI状态
        setShowSecondFlow(false);
        setShowActionTempSubMenu(false);
        setHoveredCategory(null);
        setHoveredActionCategory(null);
        setHasSelected(false);

        // 收缩侧边栏
        setSidebarExpanded(false);

        console.log('已重置到初始状态');
    }, []); // 无依赖，因为只操作当前状态

    // 处理sidebarHeader悬停，显示提示
    const [isHeaderHovered, setIsHeaderHovered] = useState(false);

    // 清理数据
    useEffect(() => {
        return () => {
            if (category) {
                galleryStore.clearCategory(category);
                flexGalleryStore.clearCategory(category);
            }
        };
    }, [category]);

    // 当选择新的分类时，同步更新hover状态的子菜单
    useEffect(() => {
        // 只有在确实选择了分类的情况下才更新hover状态
        const currentCategory = somniumNexusStore.selectedCategory;

        if (currentCategory) {
            const categoryData = somniumNexusStore.galleryCategories[currentCategory];
            if (categoryData && categoryData.hasSubMenu) {
                somniumNexusStore.setSubCategoriesForHover(categoryData.subCategories || []);
            } else {
                somniumNexusStore.setSubCategoriesForHover([]);
            }
        } else {
            // 如果没有选中任何分类，清空hover子菜单
            somniumNexusStore.setSubCategoriesForHover([]);
        }
    }, [categories]);

    const handleProjectClick = useCallback((projectKey) => {
        // 标记用户已选择项目
        setHasSelected(true);

        // 检查是否选中了新的项目（在更新store之前判断）
        const isNewSelection = somniumNexusStore.selectedCategory !== projectKey;
        const hasSubMenu = somniumNexusStore.galleryCategories[projectKey].hasSubMenu;

        // 先更新store状态
        somniumNexusStore.setSelectedCategory(projectKey);

        // 清除子分类选择，显示项目的所有图片
        somniumNexusStore.clearSelectedSubCategory();

        // 如果选中有子菜单的项目
        if (hasSubMenu) {
            if (isNewSelection) {
                // 新项目选择：收缩侧边栏，但标记需要显示次级菜单
                setSidebarExpanded(false);
                setShowSecondFlow(true); // 保持次级菜单状态为可用
            } else {
                // 同一个项目重复点击，切换侧边栏状态
                const newExpandedState = !sidebarExpanded;
                setSidebarExpanded(newExpandedState);
                // 当展开时显示次级菜单，收缩时隐藏
                if (newExpandedState) {
                    setShowSecondFlow(true);
                } else {
                    setShowSecondFlow(false);
                }
            }
        } else {
            // 没有子菜单的项目，收缩侧栏并隐藏第二个flow
            setShowSecondFlow(false);
            setSidebarExpanded(false);
        }
    }, [sidebarExpanded]);

    // 项目分类hover处理 - 清除操作分类的选中态
    const handleCategoryLeave = useCallback(() => {
        // 只有在侧栏展开状态下才响应
        if (!sidebarExpanded) return;

        setHoveredCategory(null);
        setHoveredActionCategory(null); // 同时清除操作分类的hover状态

        // 当鼠标离开时，恢复到当前选中分类的子菜单（如果有选中分类的话）
        const currentCategory = somniumNexusStore.selectedCategory;
        const currentActionCategory = actionStore.selectedActionCategory;

        if (currentCategory) {
            const currentCategoryData = somniumNexusStore.galleryCategories[currentCategory];
            if (currentCategoryData && currentCategoryData.hasSubMenu) {
                somniumNexusStore.setSubCategoriesForHover(currentCategoryData.subCategories || []);
                setShowSecondFlow(true); // 保持次级菜单显示
                setShowActionTempSubMenu(false); // 隐藏临时action子菜单
                actionStore.setShowActionSecondFlow(false); // 隐藏操作次级菜单
            } else {
                somniumNexusStore.setSubCategoriesForHover([]);
                setShowSecondFlow(false); // 隐藏次级菜单
                setShowActionTempSubMenu(false); // 隐藏临时action子菜单
            }
        } else if (currentActionCategory) {
            const currentActionData = actionStore.getActionCategory(currentActionCategory);
            if (currentActionData && currentActionData.hasSubMenu) {
                actionStore.setActionSubCategoriesForHover(currentActionData.subCategories || []);
                setShowActionTempSubMenu(true); // 显示临时action子菜单
                setShowSecondFlow(false); // 隐藏项目次级菜单
                actionStore.setShowActionSecondFlow(false); // 隐藏操作次级菜单
            } else {
                actionStore.setActionSubCategoriesForHover([]);
                setShowActionTempSubMenu(false); // 隐藏临时action子菜单
                actionStore.setShowActionSecondFlow(false); // 隐藏操作次级菜单
            }
        } else {
            // 如果没有选中任何分类，清空子菜单并隐藏次级菜单容器
            somniumNexusStore.setSubCategoriesForHover([]);
            actionStore.setActionSubCategoriesForHover([]);
            setShowSecondFlow(false); // 关键：隐藏次级菜单容器
            setShowActionTempSubMenu(false); // 隐藏临时action子菜单
            actionStore.setShowActionSecondFlow(false); // 隐藏操作次级菜单
        }
    }, [sidebarExpanded]);

    // 项目分类hover处理 - 清除操作分类的选中态
    const handleCategoryHover = useCallback((categoryKey) => {
        setHoveredCategory(categoryKey);
        setHoveredActionCategory(null); // 清除操作分类的hover状态

        // 清除操作分类的选中态，确保项目分类和操作分类互斥
        actionStore.clearActionSelection();

        const categoryData = somniumNexusStore.galleryCategories[categoryKey];
        if (categoryData && categoryData.hasSubMenu) {
            somniumNexusStore.setSubCategoriesForHover(categoryData.subCategories || []);
        } else {
            somniumNexusStore.setSubCategoriesForHover([]);
        }
    }, [categories]);

    const handleSubCategoryClick = useCallback((subCategoryKey) => {
        somniumNexusStore.setSelectedSubCategory(subCategoryKey);

        // 选择子分类后自动收缩侧边栏，让用户专注于内容
        setTimeout(() => {
            setSidebarExpanded(false);
        }, 200); // 稍微延迟，让用户看到选择反馈
    }, []);

    const handleActionSubCategoryClick = useCallback((subCategoryKey) => {
        // 处理清除存储的特殊逻辑
        if (subCategoryKey === 'clear-storage') {
            if (window.confirm('确定要清除所有本地存储数据吗？这将删除所有用户项目、环境配置等数据，此操作不可恢复。')) {
                try {
                    // 清除所有相关的本地存储数据
                    localStorage.removeItem('somnium_user_projects');
                    localStorage.removeItem('somnium_environment_config');
                    localStorage.removeItem('somnium_test_data_backup');

                    // 清除用户登录信息
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    localStorage.removeItem('email');
                    localStorage.removeItem('phone');
                    localStorage.removeItem('brief');
                    localStorage.removeItem('userLevel');

                    // 重置store中的数据
                    somniumNexusStore.clearUserProjects();
                    somniumNexusStore.clearProductionData();

                    // 清除环境配置
                    environmentManager.clearEnvironmentConfig();

                    alert('本地存储数据已清除成功！');
                    console.log('所有本地存储数据已清除');
                } catch (error) {
                    console.error('清除本地存储数据失败:', error);
                    alert('清除本地存储数据失败，请查看控制台错误信息。');
                }
            }
        }

        actionStore.setSelectedActionSubCategory(subCategoryKey);

        // 执行完子操作后，隐藏临时action子菜单
        setTimeout(() => {
            setShowActionTempSubMenu(false);
            actionStore.clearActionSelection();
        }, 200);
    }, []);

    const handleImageClick = useCallback((image) => {
        somniumNexusStore.setSelectedImage(image);
    }, []);

    const handleModalClose = () => {
        somniumNexusStore.closeModal();
    };

    // 处理开始探索 - 修改为只弹出侧栏，不选择任何项目
    const handleGetStarted = () => {
        console.log('handleGetStarted called');
        // 不再自动选择项目，只展开侧栏让用户自己选择
        setSidebarExpanded(true);
        setIsAnimating(true); // 开始动画

        // 立即设置默认hover状态，不等待动画完成
        // 这样用户在动画期间移动鼠标也能立即看到次级菜单更新
        if (!somniumNexusStore.selectedCategory && categories.length > 0) {
            console.log('Setting default hover state for first category');
            const firstCategory = categories[0];
            const firstCategoryData = somniumNexusStore.galleryCategories[firstCategory];
            if (firstCategoryData && firstCategoryData.hasSubMenu) {
                console.log('Setting subcategories for first category:', firstCategoryData.subCategories);
                somniumNexusStore.setSubCategoriesForHover(firstCategoryData.subCategories || []);
                setShowSecondFlow(true); // 关键：显示次级菜单容器
            } else {
                console.log('First category has no sub menu');
            }
        }

        // 动画完成后重置动画状态
        setTimeout(() => {
            setIsAnimating(false);
            console.log('Sidebar animation completed');
        }, 400); // 等待动画完成（与CSS动画时间一致）

        // 保持未选择状态，让用户通过侧栏选择项目
        // 不清除之前的选择状态，如果用户已经选择过项目
    };

    // 流畅的侧边栏切换动画
    const handleSidebarToggle = useCallback(() => {
        if (isAnimating) return; // 防止动画期间重复点击

        setIsAnimating(true);

        setSidebarExpanded(prev => {
            const newExpandedState = !prev;

            // 当收缩侧边栏时，同时隐藏次级菜单
            if (!newExpandedState) {
                setShowSecondFlow(false);
            } else {
                // 当展开侧边栏时，如果当前选中的项目有子菜单，则显示次级菜单
                const currentCategory = somniumNexusStore.selectedCategory;
                if (currentCategory && somniumNexusStore.galleryCategories[currentCategory]?.hasSubMenu) {
                    setShowSecondFlow(true);
                }
            }

            return newExpandedState;
        });

        // 动画完成后重置状态并处理默认hover状态
        setTimeout(() => {
            setIsAnimating(false);
            console.log('Sidebar animation completed');
        }, 400);
    }, [isAnimating, sidebarExpanded]);

    // 项目分类hover处理 - 清除操作分类的选中态

    return (
        <div className={styles.somniumNexusContainer}>
            {/* 侧边栏组件 - 两个组件始终存在，通过 CSS 控制动画 */}
            {/* 展开状态侧边栏 - 始终存在，通过 visible 类控制动画 */}
            <aside className={`${styles.expandedSidebar} ${sidebarExpanded ? styles.visible : styles.hiding}`}>
                <div className={styles.sidebarHeader}
                     onClick={handleSidebarHeaderClick}
                     onMouseEnter={() => setIsHeaderHovered(true)}
                     onMouseLeave={() => setIsHeaderHovered(false)}
                     style={{cursor: 'pointer'}}
                     title={isHeaderHovered ? "点击重置所有选择" : ""}>
                    <div className={styles.headerTopRow}>
                        <h1 className={styles.mainTitle}>Somnium Nexus</h1>
                    </div>
                    <p className={styles.subtitle}>
                        {userStore.isLoggedIn
                            ? `${userStore.username || userStore.email}`
                            : "图集项目 | Image Collection"
                        }
                    </p>
                    <div className={styles.signatureOverlay}>
                        <img src={signLineImg} alt="" className={styles.signatureImage} />
                    </div>
                </div>

                    <div className={styles.projectTabs}>
                        <div className={`${styles.tabsContainer} ${styles.expanded}`}>
                            {/* 左侧主tabsFlow - 项目分类和操作分类 */}
                            <div className={styles.tabsFlowLeft}>
                                {/* 项目分类 */}
                                {categories.map((categoryKey, index) => {
                                    const hasSubMenu = somniumNexusStore.galleryCategories[categoryKey].hasSubMenu;
                                    return (
                                        <div key={categoryKey} className={styles.tabWrapper}>
                                            <div
                                                className={`${styles.projectTab} ${styles.projectCategoryTab} ${
                                                    somniumNexusStore.selectedCategory === categoryKey ? styles.active : ''
                                                } ${
                                                    hoveredCategory === categoryKey ? styles.hovered : ''
                                                }`}
                                                data-tab-type="project"
                                                data-project-key={categoryKey}
                                                onClick={() => handleProjectClick(categoryKey)}
                                                onMouseEnter={() => handleCategoryHover(categoryKey)}
                                                onMouseLeave={handleCategoryLeave}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        handleProjectClick(categoryKey);
                                                    }
                                                }}
                                            >
                                                <span className={styles.tabText}
                                                    data-active={somniumNexusStore.selectedCategory === categoryKey}
                                                >
                                                    {somniumNexusStore.galleryCategories[categoryKey].title}
                                                </span>
                                                {hasSubMenu && (
                                                    <div className={`${styles.subMenuIndicator} ${
                                                        somniumNexusStore.selectedCategory === categoryKey ? styles.active : ''
                                                    }`}
                                                    >
                                                        ›
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}

                                {/* 操作分类分隔线 - 仅对user_level为-1的登录用户显示 */}
                                {userStore.canAccessActionTabs && (
                                    <div className={styles.actionTabsDivider}></div>
                                )}

                                {/* 操作分类 - 仅对user_level为-1的登录用户显示 */}
                                {userStore.canAccessActionTabs && actionStore.actionCategoryKeys.map((actionKey) => {
                                    const actionData = actionStore.actionCategories[actionKey];
                                    const isActive = actionStore.selectedActionCategory === actionKey;
                                    const isHovered = hoveredActionCategory === actionKey;

                                    return (
                                        <div key={`action-${actionKey}`} className={styles.tabWrapper}>
                                            <div
                                                className={`${styles.projectTab} ${styles.actionTab} ${
                                                    isActive ? styles.active : ''
                                                } ${
                                                    isHovered ? styles.hovered : ''
                                                }`}
                                                data-tab-type="action"
                                                data-action-key={actionKey}
                                                onClick={() => {
                                                    // 操作tab的点击逻辑 - 使用临时子菜单避免与project子菜单冲突
                                                    if (actionData.hasSubMenu) {
                                                        // 清除项目的选中状态，确保操作tab优先
                                                        somniumNexusStore.setSelectedCategory(null);
                                                        somniumNexusStore.setSubCategoriesForHover([]);
                                                        setShowSecondFlow(false); // 隐藏项目子菜单

                                                        // 设置操作tab状态并显示临时子菜单
                                                        actionStore.setSelectedActionCategory(actionKey);
                                                        actionStore.setActionSubCategoriesForHover(actionData.subCategories || []);
                                                        setShowActionTempSubMenu(true); // 显示临时action子菜单
                                                    } else {
                                                        // 没有子菜单的操作，执行后不保持选中态
                                                        actionStore.executeAction(actionKey);
                                                        setShowActionTempSubMenu(false); // 隐藏临时子菜单
                                                    }
                                                }}
                                                onMouseEnter={() => {
                                                    setHoveredActionCategory(actionKey);
                                                    if (actionData.hasSubMenu) {
                                                        actionStore.setActionSubCategoriesForHover(actionData.subCategories || []);
                                                    }
                                                }}
                                                onMouseLeave={handleCategoryLeave}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        if (actionData.hasSubMenu) {
                                                            // 清除项目的选中状态，确保操作tab优先
                                                            somniumNexusStore.setSelectedCategory(null);
                                                            somniumNexusStore.setSubCategoriesForHover([]);
                                                            setShowSecondFlow(false); // 隐藏项目子菜单

                                                            // 设置操作tab状态并显示临时子菜单
                                                            actionStore.setSelectedActionCategory(actionKey);
                                                            actionStore.setActionSubCategoriesForHover(actionData.subCategories || []);
                                                            setShowActionTempSubMenu(true); // 显示临时action子菜单
                                                        } else {
                                                            actionStore.executeAction(actionKey);
                                                            setShowActionTempSubMenu(false); // 隐藏临时子菜单
                                                        }
                                                    }
                                                }}
                                            >
                                                <span className={styles.tabText}
                                                    data-active={isActive}
                                                >
                                                    {actionData.title}
                                                </span>
                                                {actionData.hasSubMenu && (
                                                    <div className={`${styles.subMenuIndicator} ${
                                                        isActive ? styles.active : ''
                                                    }`}
                                                    >
                                                        ›
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 临时action子菜单 - 避免与项目子菜单冲突 */}
                            {showActionTempSubMenu && actionStore.hoverActionSubCategories.length > 0 && (
                                <div className={styles.actionTempSubMenu}>
                                    {/* 操作子分类列表 */}
                                    {actionStore.hoverActionSubCategories.map((subCategory) => (
                                        <div key={`action-sub-${subCategory.key}`} className={styles.tabWrapper}>
                                            <div
                                                className={`${styles.projectTab} ${styles.actionSubCategoryTab} ${
                                                    actionStore.selectedActionSubCategory === subCategory.key ? styles.active : ''
                                                }`}
                                                data-tab-type="action-sub"
                                                data-action-sub-key={subCategory.key}
                                                onClick={() => handleActionSubCategoryClick(subCategory.key)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        handleActionSubCategoryClick(subCategory.key);
                                                    }
                                                }}
                                            >
                                                <span className={styles.tabText}
                                                    data-active={actionStore.selectedActionSubCategory === subCategory.key}
                                                >
                                                    {subCategory.key === 'edit-toggle'
                                                        ? `${subCategory.title} (${actionStore.isEditModeActive ? '开启' : '关闭'})`
                                                        : subCategory.key === 'flex' || subCategory.key === 'freeform'
                                                        ? `${subCategory.title} ${actionStore.currentLayoutType === subCategory.key ? '(当前)' : ''}`
                                                        : subCategory.key === 'test' || subCategory.key === 'production'
                                                        ? `${subCategory.title} ${actionStore.isUsingTestData === (subCategory.key === 'test') ? '(当前)' : ''}`
                                                        : subCategory.title
                                                    }
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {/* 退出选项 - 什么都不选 */}
                                    <div className={styles.tabWrapper}>
                                        <div
                                            className={`${styles.projectTab} ${styles.actionExitTab}`}
                                            data-tab-type="action-exit"
                                            onClick={() => {
                                                // 退出操作：清除选中状态并隐藏子菜单
                                                actionStore.clearActionSelection();
                                                setShowActionTempSubMenu(false);
                                            }}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    actionStore.clearActionSelection();
                                                    setShowActionTempSubMenu(false);
                                                }
                                            }}
                                        >
                                            <span className={styles.tabText}>
                                                退出
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 右侧子菜单tabsFlow - 显示项目或操作的次级菜单 */}
                            <div className={styles.tabsFlowRight}>
                                {/* 项目次级菜单 */}
                                {showSecondFlow && somniumNexusStore.hoverSubCategories.length > 0 && (
                                    somniumNexusStore.hoverSubCategories.map((subCategory) => (
                                        <div key={subCategory.key} className={styles.tabWrapper}>
                                            <div
                                                className={`${styles.projectTab} ${styles.projectSubCategoryTab} ${
                                                    somniumNexusStore.selectedSubCategory === subCategory.key ? styles.active : ''
                                                }`}
                                                data-tab-type="project-sub"
                                                data-sub-category-key={subCategory.key}
                                                onClick={() => handleSubCategoryClick(subCategory.key)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        handleSubCategoryClick(subCategory.key);
                                                    }
                                                }}
                                            >
                                                <span className={styles.tabText}
                                                    data-active={somniumNexusStore.selectedSubCategory === subCategory.key}
                                                >
                                                    {subCategory.title}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}

                                {/* 操作次级菜单 - 仅对user_level为-1的登录用户显示 */}
                                {userStore.canAccessActionTabs && actionStore.showActionSecondFlow && actionStore.hoverActionSubCategories.length > 0 && (
                                    actionStore.hoverActionSubCategories.map((subCategory) => (
                                        <div key={`action-sub-${subCategory.key}`} className={styles.tabWrapper}>
                                            <div
                                                className={`${styles.projectTab} ${styles.actionSubCategoryTab} ${
                                                    actionStore.selectedActionSubCategory === subCategory.key ? styles.active : ''
                                                }`}
                                                data-tab-type="action-sub"
                                                data-action-sub-key={subCategory.key}
                                                onClick={() => handleActionSubCategoryClick(subCategory.key)}
                                                role="button"
                                                tabIndex={0}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        handleActionSubCategoryClick(subCategory.key);
                                                    }
                                                }}
                                            >
                                                <span className={styles.tabText}
                                                    data-active={actionStore.selectedActionSubCategory === subCategory.key}
                                                >
                                                    {subCategory.title}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}

                                {/* 空子菜单状态显示 */}
                                {((showSecondFlow && somniumNexusStore.hoverSubCategories.length === 0) ||
                                 (userStore.canAccessActionTabs && actionStore.showActionSecondFlow && actionStore.hoverActionSubCategories.length === 0)) && (
                                    <div className={styles.emptySubMenu}>
                                        <span className={styles.emptyText}>-</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.sidebarFooter}>
                        <div className={styles.languageSwitch}>
                            <button className={styles.langButton}>EN</button>
                            <span className={styles.langSeparator}>/</span>
                            <button className={styles.langButton}>JP</button>
                        </div>
                        <p className={styles.copyright}>© 2025 Somnium Nexus</p>
                        <TriangleLoginIcon onClick={() => setShowLoginModal(true)} />
                    </div>
                </aside>

                {/* 收缩状态侧边栏 - 始终存在，通过 visible 类控制动画 */}
                <CollapsedSidebar
                    className=''
                    show={!sidebarExpanded}  // 根据状态控制显示/隐藏
                    onToggle={handleSidebarToggle}
                    onProjectClick={handleProjectClick}
                    onGetStarted={handleGetStarted}
                    hasSelected={hasSelected}
                    currentCategoryTitle={somniumNexusStore.galleryCategories[somniumNexusStore.selectedCategory]?.title}
                    currentSubCategoryTitle={somniumNexusStore.subCategories.find(sub => sub.key === somniumNexusStore.selectedSubCategory)?.title}
                    categories={categories}
                    isAnimating={isAnimating}
                />

            {/* 右侧主内容区 | Right Main Content - 固定位置和大小，不受侧边栏状态影响 */}
            <main className={styles.mainContent}>
                {/* 透明蒙版 - 当侧边栏展开时显示 */}
                {sidebarExpanded && (
                    <div
                        className={styles.overlay}
                        onClick={handleSidebarToggle}
                        aria-label="点击关闭侧边栏"
                    />
                )}
                {(!hasSelected && !sidebarExpanded) ? (
                    <SimpleWelcomeModule onGetStarted={handleGetStarted} />
                ) : (!hasSelected || !somniumNexusStore.selectedCategory) ? (
                    // 保持欢迎页面显示，即使侧栏展开但未选择项目
                    <SimpleWelcomeModule onGetStarted={handleGetStarted} />
                ) : (
                    <div className={styles.galleryWrapper}>
                        {currentLayout === LAYOUT_TYPES.FLEX ? (
                            <FlexGalleryContainer
                                images={currentImages}
                                onImageClick={handleImageClick}
                                itemSize="medium"
                                gap={8}
                                categoryId={category || 'flex'}
                            />
                        ) : (
                            <GalleryFlex
                                images={currentImages}
                                onImageClick={handleImageClick}
                                columns={3}
                                categoryId={category || 'default'}
                            />
                        )}
                    </div>
                )}
            </main>

            {/* 图片详情模态框 | Image Detail Modal */}
            {somniumNexusStore.isModalOpen && somniumNexusStore.selectedImage && (
                <div
                    className={styles.modalOverlay}
                    onClick={handleModalClose}
                >
                    <div className={styles.modalContent}>
                        <GracefulImage
                            src={somniumNexusStore.selectedImage.src}
                            alt={somniumNexusStore.selectedImage.title}
                            className={styles.modalImage}
                            aspectRatio="16:9"
                            skeletonSize="large"
                            showRetry={true}
                            errorMessage="作品图片加载失败"
                        />
                        <div className={styles.modalInfo}>
                            <h2 className={styles.modalTitle}>
                                {somniumNexusStore.selectedImage.title}
                            </h2>
                            <p className={styles.modalYear}>
                                {somniumNexusStore.selectedImage.year}
                            </p>
                        </div>
                        <button
                            className={styles.closeButton}
                            onClick={handleModalClose}
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}

            {/* 登录模态框 */}
            <SomniumLogin
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />

            {/* 新建项目模态框 */}
            <NewProjectModal />
        </div>
    );
});

export {SomniumNexus};