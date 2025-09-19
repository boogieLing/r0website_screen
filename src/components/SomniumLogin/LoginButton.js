import React from 'react';
import {observer} from 'mobx-react-lite';
import userStore from '@/stores/userStore';
import styles from './LoginButton.module.less';

// 简单的语言切换工具
const getText = (key) => {
    const lang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    const texts = {
        zh: {
            signIn: '登录',
            signOut: '登出',
            processing: '处理中...'
        },
        en: {
            signIn: 'Sign In',
            signOut: 'Sign Out',
            processing: 'Processing...'
        }
    };
    return texts[lang][key] || texts.en[key];
};

const LoginButton = observer(({onClick, isInSidebar = false}) => {
    const handleClick = () => {
        if (userStore.isLoggedIn) {
            userStore.logout();
        } else {
            onClick();
        }
    };

    return (
        <button
            className={`${styles.loginButton} ${isInSidebar ? styles.sidebarButton : ''}`}
            onClick={handleClick}
            disabled={userStore.isLoading}
        >
            <span className={styles.buttonText}>
                {userStore.isLoading
                    ? getText('processing')
                    : userStore.isLoggedIn
                    ? getText('signOut')
                    : getText('signIn')}
            </span>
            {!isInSidebar && (
                <span className={styles.userInfo}>
                    {userStore.isLoggedIn && userStore.userDisplayName}
                </span>
            )}
        </button>
    );
});

export default LoginButton;