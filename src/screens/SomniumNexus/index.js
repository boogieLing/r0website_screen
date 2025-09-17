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
    const [selectedProject, setSelectedProject] = useState("stillness");

    const currentCategory = somniumNexusStore.currentCategory;
    const categories = somniumNexusStore.categories;
    const currentImages = somniumNexusStore.currentCategoryImages;

    useEffect(() => {
        // 设置页面标题 | Set page title
        globalStore.setWebSiteTitle("Somnium Nexus - R0!");

        // 如果有URL参数，设置选中分类 | If URL param exists, set selected category
        if (category && somniumNexusStore.galleryCategories[category]) {
            somniumNexusStore.setSelectedCategory(category);
            setSelectedProject(category);
        }
    }, [category]);

    const handleProjectClick = useCallback((projectKey) => {
        somniumNexusStore.setSelectedCategory(projectKey);
        setSelectedProject(projectKey);
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
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h1 className={styles.mainTitle}>Somnium Nexus</h1>
                    <p className={styles.subtitle}>图集项目 | Image Collection</p>
                </div>

                <div className={styles.projectTabs}>
                    <div className={styles.tabsFlow}>
                        {categories.map((categoryKey, index) => (
                            <React.Fragment key={categoryKey}>
                                <button
                                    className={`${styles.projectTab} ${
                                        somniumNexusStore.selectedCategory === categoryKey ? styles.active : ''
                                    }`}
                                    onClick={() => handleProjectClick(categoryKey)}
                                >
                                    <span className={styles.tabText}
                                        data-active={somniumNexusStore.selectedCategory === categoryKey}
                                    >
                                        {somniumNexusStore.galleryCategories[categoryKey].title}
                                    </span>
                                </button>
                                <span className={styles.tabSeparator}
                                    style={{
                                        color: index < categories.length - 1 ? '#ccc' : 'transparent'
                                    }}
                                >
                                    {index % 2 === 0 ? ' / ' : ' // '}
                                </span>
                            </React.Fragment>
                        ))}
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
            <main className={styles.mainContent}>
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