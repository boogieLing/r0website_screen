import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './CollapsedSidebar.module.less';

const CollapsedSidebar = observer(({
    onToggle,
    onProjectClick,
    onGetStarted,
    hasSelected,
    currentCategoryTitle,
    currentSubCategoryTitle,
    categories,
    isAnimating
}) => {

    const handleProjectInteraction = () => {
        if (isAnimating) return; // 防止动画期间重复点击

        if (hasSelected) {
            // 已选择状态下，点击展开侧边栏
            onToggle();
        } else {
            // 未选择状态下，开始探索
            onGetStarted();
        }
    };

    return (
        <div className={styles.collapsedSidebar}>
            {/* 合并的项目显示和切换区域 - 整个区域都是可点击的 */}
            <div className={styles.contentArea}>
                {!hasSelected ? (
                    // 未选择状态时显示简约提示
                    <div
                        className={styles.defaultPrompt}
                        onClick={handleProjectInteraction}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleProjectInteraction();
                            }
                        }}
                    >
                        <div className={styles.promptText}>
                            选择
                        </div>
                        <div className={styles.promptSubText}>
                            项目
                        </div>
                    </div>
                ) : (
                    // 已选择状态时显示A-B格式，同时作为切换按钮
                    <div
                        className={styles.selectedProject}
                        onClick={handleProjectInteraction}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                handleProjectInteraction();
                            }
                        }}
                    >
                        <div className={styles.mainProject}>
                            {currentCategoryTitle}
                        </div>
                        {currentSubCategoryTitle && (
                            <div className={styles.subProject}>
                                {currentSubCategoryTitle}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 底部简约标识 */}
            <div className={styles.bottomIndicator}>
                <div className={styles.siteName}>
                    SN
                </div>
            </div>
        </div>
    );
});

export default CollapsedSidebar;