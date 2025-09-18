import React from 'react';
import styles from './WelcomeModule.module.less';

const WelcomeModule = ({ onGetStarted }) => {
    return (
        <div className={styles.welcomeContainer}>
            <div className={styles.welcomeContent}>
                <div className={styles.welcomeHeader}>
                    <h1 className={styles.welcomeTitle}>Somnium Nexus</h1>
                    <p className={styles.welcomeSubtitle}>视觉图集 | Visual Collection</p>
                </div>

                <div className={styles.welcomeDescription}>
                    <p className={styles.descriptionText}>
                        这是一个精心策划的视觉图集项目，展示了不同主题下的摄影作品。
                        通过左侧的导航栏，您可以探索各种摄影系列。
                    </p>
                    <p className={styles.descriptionText}>
                        每个系列都有其独特的视觉语言和故事，希望这些作品能为您带来灵感。
                    </p>
                </div>

                <div className={styles.welcomeFeatures}>
                    <h3 className={styles.featuresTitle}>使用指南</h3>
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>🎯</div>
                            <h4 className={styles.featureTitle}>选择项目</h4>
                            <p className={styles.featureDesc}>点击左侧边栏中的项目名称来查看对应的图集</p>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>📱</div>
                            <h4 className={styles.featureTitle}>收缩边栏</h4>
                            <p className={styles.featureDesc}>使用切换按钮可以收缩侧边栏获得更大视野</p>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>🖼️</div>
                            <h4 className={styles.featureTitle}>查看图片</h4>
                            <p className={styles.featureDesc}>点击图片可以查看大图和详细信息</p>
                        </div>
                        <div className={styles.featureItem}>
                            <div className={styles.featureIcon}>⚡</div>
                            <h4 className={styles.featureTitle}>流畅体验</h4>
                            <p className={styles.featureDesc}>所有交互都经过优化，提供流畅的用户体验</p>
                        </div>
                    </div>
                </div>

                <div className={styles.welcomeAction}>
                    <button className={styles.getStartedButton} onClick={onGetStarted}>
                        开始探索
                        <span className={styles.buttonArrow}>→</span>
                    </button>
                </div>

                <div className={styles.welcomeFooter}>
                    <p className={styles.footerText}>© 2025 Somnium Nexus - 用心呈现每一个视觉故事</p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModule;