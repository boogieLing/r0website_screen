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
    const [sidebarExpanded, setSidebarExpanded] = useState(true); // 默认展开侧边栏
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
        }
    }, [category]);

    const handleProjectClick = useCallback((projectKey) => {
        // 标记用户已选择项目
        setHasSelected(true);

        // 检查是否选中了新的项目
        const isNewSelection = somniumNexusStore.selectedCategory !== projectKey;

        somniumNexusStore.setSelectedCategory(projectKey);

        // 如果选中有子菜单的项目，显示第二个flow
        if (somniumNexusStore.galleryCategories[projectKey].hasSubMenu) {
            if (isNewSelection) {
                // 新项目选择，展开侧栏并显示第二个flow
                setSidebarExpanded(true);
                setShowSecondFlow(false);

                // 延迟显示第二个flow，创建弹出动画效果
                setTimeout(() => {
                    setShowSecondFlow(true);
                }, 200);
            } else {
                // 同一个项目重复点击，切换显示状态并相应调整侧栏
                const newExpandedState = !sidebarExpanded;
                setSidebarExpanded(newExpandedState);
                setShowSecondFlow(newExpandedState);
            }
        } else {
            // 没有子菜单的项目，收缩侧栏并隐藏第二个flow
            setShowSecondFlow(false);
            setSidebarExpanded(false);
        }
    }, [sidebarExpanded]);

    const handleSubCategoryClick = useCallback((subCategoryKey) => {
        somniumNexusStore.setSelectedSubCategory(subCategoryKey);

        // 选择子项目后自动收缩侧边栏
        console.log('选择子项目，准备自动收缩侧边栏');
        setTimeout(() => {
            console.log('执行侧边栏收缩');
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
            handleProjectClick(categories[0]);
        }
    };

    // 流畅的侧边栏切换动画
    const handleSidebarToggle = useCallback(() => {
        if (isAnimating) return; // 防止动画期间重复点击

        setIsAnimating(true);
        setSidebarExpanded(prev => !prev);

        // 动画完成后重置状态
        setTimeout(() => {
            setIsAnimating(false);
        }, 400);
    }, [isAnimating]);

    return (
        <div className={styles.somniumNexusContainer}>
            {/* 根据状态渲染不同的侧边栏组件 */}
            {sidebarExpanded ? (
                // 展开状态 - 完整侧边栏
                <aside className={styles.expandedSidebar}>
                    {/* 收缩/展开切换按钮 - 添加动画类名 */}
                    <button
                        className={`${styles.toggleButton} ${isAnimating ? styles.animating : ''}`}
                        onClick={handleSidebarToggle}
                        aria-label="收缩侧边栏"
                        disabled={isAnimating}
                    >
                        <span className={styles.toggleIcon}>‹</span>
                    </button>

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
            ) : (
                // 收缩状态 - CollapsedSidebar组件
                <CollapsedSidebar
                    onToggle={handleSidebarToggle}
                    onProjectClick={handleProjectClick}
                    onGetStarted={handleGetStarted}
                    hasSelected={hasSelected}
                    currentCategoryTitle={somniumNexusStore.galleryCategories[somniumNexusStore.selectedCategory]?.title}
                    currentSubCategoryTitle={somniumNexusStore.subCategories.find(sub => sub.key === somniumNexusStore.selectedSubCategory)?.title}
                    categories={categories}
                    isAnimating={isAnimating}
                />
            )}

            {/* 右侧主内容区 | Right Main Content */}
            <main className={`${styles.mainContent} ${sidebarExpanded ? styles.expanded : ''}`}>
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