import React from 'react';
import {observer} from 'mobx-react-lite';
import userStore from '@/stores/userStore';
import styles from './LoginIcon.module.less';

const LoginIcon = observer(({onClick}) => {
    const handleClick = () => {
        if (userStore.isLoading) return;
        onClick();
    };

    return (
        <div
            className={`${styles.loginIcon} ${userStore.isLoggedIn ? styles.loggedIn : ''} ${userStore.isLoading ? styles.loading : ''}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            {userStore.isLoading ? (
                // 极简加载状态 - 单点旋转
                <div className={styles.loadingDot} />
            ) : userStore.isLoggedIn ? (
                // 已登录状态 - 极简实心点
                <div className={styles.loggedInDot} />
            ) : (
                // 未登录状态 - 极简轮廓
                <div className={styles.loginOutline} />
            )}
        </div>
    );
});

export default LoginIcon;