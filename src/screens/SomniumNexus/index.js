import React, {useEffect, useState, useCallback} from "react";
import {observer} from "mobx-react-lite";
import {useParams} from "react-router-dom";
import globalStore from "@/stores/globalStore";
import somniumNexusStore from "@/stores/somniumNexusStore";
import InfiniteGallery from "@/components/InfiniteGallery/InfiniteGallery";
import GracefulImage from "@/components/SkeletonImage/GracefulImage";
import SimpleWelcomeModule from "./SimpleWelcomeModule";
import CollapsedSidebar from "./CollapsedSidebar";
import styles from "./index.module.less";

const SomniumNexus = observer(() => {
    const {category} = useParams();
    // eslint-disable-next-line
    const [, setSelectedProject] = useState("stillness");
    const [showSecondFlow, setShowSecondFlow] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(false); // 默认展开侧边栏
    const [isAnimating, setIsAnimating] = useState(false); // 动画状态
    const [hasSelected, setHasSelected] = useState(false); // 跟踪用户是否选择了项目

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

    const handleSubCategoryClick = useCallback((subCategoryKey) => {
        somniumNexusStore.setSelectedSubCategory(subCategoryKey);

        // 选择子分类后自动收缩侧边栏，让用户专注于内容
        setTimeout(() => {
            setSidebarExpanded(false);
        }, 200); // 稍微延迟，让用户看到选择反馈
    }, []);

    const handleImageClick = useCallback((image) => {
        somniumNexusStore.setSelectedImage(image);
    }, []);

    const handleModalClose = () => {
        somniumNexusStore.closeModal();
    };

    // 处理开始探索
    const handleGetStarted = () => {
        setHasSelected(true);
        // 可以选择第一个项目作为默认展示
        if (categories.length > 0) {
            const firstCategory = categories[0];
            somniumNexusStore.setSelectedCategory(firstCategory);

            // 清除子分类选择，显示所有图片
            somniumNexusStore.clearSelectedSubCategory();

            // 如果第一个项目有子菜单，不自动展开侧边栏，但标记次级菜单可用
            if (somniumNexusStore.galleryCategories[firstCategory].hasSubMenu) {
                setSidebarExpanded(false); // 不自动展开侧边栏
                setShowSecondFlow(true); // 但次级菜单可用
            }
        }
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

        // 动画完成后重置状态
        setTimeout(() => {
            setIsAnimating(false);
        }, 400);
    }, [isAnimating]);

    return (
        <div className={styles.somniumNexusContainer}>
            {/* 侧边栏组件 - 两个组件始终存在，通过 CSS 控制动画 */}
            {/* 展开状态侧边栏 - 始终存在，通过 visible 类控制动画 */}
            <aside className={`${styles.expandedSidebar} ${sidebarExpanded ? styles.visible : styles.hiding}`}>
                <div className={styles.sidebarHeader}>
                    <h1 className={styles.mainTitle}>Somnium Nexus</h1>
                    <p className={styles.subtitle}>图集项目 | Image Collection</p>
                </div>

                    <div className={styles.projectTabs}>
                        <div className={`${styles.tabsContainer} ${styles.expanded}`}>
                            {/* 左侧主tabsFlow */}
                            <div className={styles.tabsFlowLeft}>
                                {categories.map((categoryKey, index) => {
                                    const hasSubMenu = somniumNexusStore.galleryCategories[categoryKey].hasSubMenu;
                                    return (
                                        <div key={categoryKey} className={styles.tabWrapper}>
                                            <div
                                                className={`${styles.projectTab} ${
                                                    somniumNexusStore.selectedCategory === categoryKey ? styles.active : ''
                                                }`}
                                                onClick={() => handleProjectClick(categoryKey)}
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
                            </div>

                            {/* 右侧子菜单tabsFlow */}
                            <div className={styles.tabsFlowRight}>
                                {somniumNexusStore.hasSubMenu && showSecondFlow && somniumNexusStore.subCategories.map((subCategory) => (
                                    <div key={subCategory.key} className={styles.tabWrapper}>
                                        <div
                                            className={`${styles.projectTab} ${
                                                somniumNexusStore.selectedSubCategory === subCategory.key ? styles.active : ''
                                            }`}
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
                                ))}
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

            {/* 右侧主内容区 | Right Main Content - 固定位置和大小 */}
            <main className={styles.mainContent}>
                {/* 透明蒙版 - 当侧边栏展开时显示 */}
                {sidebarExpanded && (
                    <div
                        className={styles.overlay}
                        onClick={handleSidebarToggle}
                        aria-label="点击关闭侧边栏"
                    />
                )}
                {!hasSelected ? (
                    <SimpleWelcomeModule onGetStarted={handleGetStarted} />
                ) : (
                    <div className={styles.galleryWrapper}>
                        <InfiniteGallery
                            images={currentImages}
                            onImageClick={handleImageClick}
                            columns={3}
                            gap={60}
                        />
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
        </div>
    );
});

export {SomniumNexus};