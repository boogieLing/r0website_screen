import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import userStore from '@/stores/userStore';
import styles from './TriangleLoginIcon.module.less';

const TriangleLoginIcon = observer(({onClick}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        if (userStore.isLoading) return;
        onClick();
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
            </div>
        </div>
    );
});

export default TriangleLoginIcon;