import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import userStore from '@/stores/userStore';
import styles from './SomniumLogin.module.less';

// 简单的语言切换工具
const getText = (key) => {
    const lang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    const texts = {
        zh: {
            signIn: '登录',
            email: '邮箱地址',
            password: '密码',
            emailPlaceholder: 'your@email.com',
            passwordPlaceholder: '••••••••',
            processing: '处理中...',
            signInButton: '登录',
            forgotPassword: '-',
            signOut: '登出',
            userInfo: '用户信息'
        },
        en: {
            signIn: 'Sign In',
            email: 'Email Address',
            password: 'Password',
            emailPlaceholder: 'your@email.com',
            passwordPlaceholder: '••••••••',
            processing: 'Processing...',
            signInButton: 'Sign In',
            forgotPassword: 'Forgot password? Please contact administrator.',
            signOut: 'Sign Out',
            userInfo: 'User Info'
        }
    };
    return texts[lang][key] || texts.en[key];
};

const SomniumLogin = observer(({isOpen, onClose}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const success = await userStore.login(email, password);

        if (success) {
            onClose();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{getText('signIn')}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleLogin}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {getText('email')}
                        </label>
                        <input
                            type="email"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={getText('emailPlaceholder')}
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            {getText('password')}
                        </label>
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={getText('passwordPlaceholder')}
                            required
                        />
                    </div>

                    {userStore.error && (
                        <div className={styles.error}>
                            {userStore.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={userStore.isLoading}
                    >
                        {userStore.isLoading ? getText('processing') : getText('signInButton')}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p className={styles.footerText}>
                        {getText('forgotPassword')}
                    </p>
                </div>
            </div>
        </div>
    );
});

export default SomniumLogin;