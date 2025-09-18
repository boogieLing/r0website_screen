import React, {useEffect, useState, useCallback} from "react";
import {observer} from "mobx-react-lite";
import {useParams} from "react-router-dom";
import globalStore from "@/stores/globalStore";
import somniumNexusStore from "@/stores/somniumNexusStore";
import InfiniteGallery from "@/components/InfiniteGallery/InfiniteGallery";
import GracefulImage from "@/components/SkeletonImage/GracefulImage";
import styles from "./index.module.less";

const SomniumNexus = observer(() => {
    const {category} = useParams();
    // eslint-disable-next-line
    const [, setSelectedProject] = useState("stillness");
    const [showSecondFlow, setShowSecondFlow] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    const currentCategory = somniumNexusStore.currentCategory;
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
        // 检查是否选中了新的项目
        const isNewSelection = somniumNexusStore.selectedCategory !== projectKey;

        somniumNexusStore.setSelectedCategory(projectKey);

        // 如果选中有子菜单的项目，显示第二个flow
        if (somniumNexusStore.galleryCategories[projectKey].hasSubMenu) {
            if (isNewSelection) {
                // 新项目选择，展开侧栏并显示第二个flow
                setSidebarExpanded(true);
                setShowSecondFlow(false);
                setIsAnimating(true);

                // 延迟显示第二个flow，创建弹出动画效果
                setTimeout(() => {
                    setShowSecondFlow(true);
                    setIsAnimating(false);
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
    }, [showSecondFlow, sidebarExpanded]);

    const handleSubCategoryClick = useCallback((subCategoryKey) => {
        somniumNexusStore.setSelectedSubCategory(subCategoryKey);
    }, []);

    const handleImageClick = useCallback((image) => {
        somniumNexusStore.setSelectedImage(image);
    }, []);

    const handleModalClose = () => {
        somniumNexusStore.closeModal();
    };

    return (
        <div className={styles.somniumNexusContainer}>
            {/* 左侧导航栏 | Left Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarExpanded ? styles.expanded : styles.collapsed}`}>
                <div className={styles.sidebarHeader}>
                    <h1 className={styles.mainTitle}>Somnium Nexus</h1>
                    <p className={styles.subtitle}>图集项目 | Image Collection</p>
                </div>

                <div className={styles.projectTabs}>
                    <div className={`${styles.tabsContainer} ${sidebarExpanded ? styles.expanded : styles.collapsed}`}>
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
                                                }`}>
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

            {/* 右侧主内容区 | Right Main Content */}
            <main className={`${styles.mainContent} ${sidebarExpanded ? styles.expanded : styles.collapsed}`}>
                <div className={styles.galleryHeader}>
                    <h2 className={styles.projectTitle}>{currentCategory.title}</h2>
                    <p className={styles.projectDesc}>{currentCategory.description}</p>
                </div>

                <div className={styles.galleryWrapper}>
                    <InfiniteGallery
                        images={currentImages}
                        onImageClick={handleImageClick}
                        columns={3}
                        gap={60}
                    />
                </div>
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