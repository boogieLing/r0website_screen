import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import userStore from '@/stores/userStore';
import styles from './TriangleLoginIcon.module.less';

const TriangleLoginIcon = observer(({onClick}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        if (userStore.isLoading) return;

        if (userStore.isLoggedIn) {
            // 如果已登录，执行注销
            userStore.logout();
        } else {
            // 如果未登录，打开登录模态框
            onClick();
        }
    };

    const getTooltipText = () => {
        if (userStore.isLoading) return "处理中...";
        if (userStore.isLoggedIn) return `点击注销 (${userStore.userDisplayName})`;
        return "点击登录";
    };

    return (
        <div className={styles.triangleContainer}>
            <div
                className={`${styles.triangleIcon} ${
                    userStore.isLoggedIn ? styles.loggedIn : ''
                } ${userStore.isLoading ? styles.loading : ''} ${
                    isHovered ? styles.expanded : ''
                }`}
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleClick();
                    }
                }}
            >
                {isHovered && !userStore.isLoading && (
                    <div className={styles.hoverGlow} />
                )}
                {isHovered && (
                    <div className={styles.tooltip}>
                        {getTooltipText()}
                    </div>
                )}
            </div>
        </div>
    );
});

export default TriangleLoginIcon;