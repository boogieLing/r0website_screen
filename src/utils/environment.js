/**
 * 环境配置工具
 * 用于管理测试环境和正式环境的切换
 */

import React from 'react';

import somniumNexusStore from "@/stores/somniumNexusStore";
import testDataStore from "@/stores/testDataStore";

// 环境类型枚举
export const ENVIRONMENT_TYPES = {
    TEST: 'test',
    PRODUCTION: 'production'
};

/**
 * 环境管理器
 */
class EnvironmentManager {
    constructor() {
        this.currentEnvironment = ENVIRONMENT_TYPES.PRODUCTION;
        this.environmentChangeListeners = [];
    }

    /**
     * 切换到测试环境
     */
    switchToTestEnvironment() {
        this.currentEnvironment = ENVIRONMENT_TYPES.TEST;
        somniumNexusStore.enableTestEnvironment();
        this.notifyEnvironmentChange();
        console.log('已切换到测试环境');
    }

    /**
     * 切换到正式环境
     */
    switchToProductionEnvironment() {
        this.currentEnvironment = ENVIRONMENT_TYPES.PRODUCTION;
        somniumNexusStore.disableTestEnvironment();
        this.notifyEnvironmentChange();
        console.log('已切换到正式环境');
    }

    /**
     * 获取当前环境类型
     */
    getCurrentEnvironment() {
        return this.currentEnvironment;
    }

    /**
     * 检查是否为测试环境
     */
    isTestEnvironment() {
        return this.currentEnvironment === ENVIRONMENT_TYPES.TEST;
    }

    /**
     * 检查是否为正式环境
     */
    isProductionEnvironment() {
        return this.currentEnvironment === ENVIRONMENT_TYPES.PRODUCTION;
    }

    /**
     * 注册环境变化监听器
     */
    addEnvironmentChangeListener(listener) {
        this.environmentChangeListeners.push(listener);
    }

    /**
     * 移除环境变化监听器
     */
    removeEnvironmentChangeListener(listener) {
        const index = this.environmentChangeListeners.indexOf(listener);
        if (index > -1) {
            this.environmentChangeListeners.splice(index, 1);
        }
    }

    /**
     * 通知环境变化
     */
    notifyEnvironmentChange() {
        const environmentInfo = this.getEnvironmentInfo();
        this.environmentChangeListeners.forEach(listener => {
            try {
                listener(environmentInfo);
            } catch (error) {
                console.error('环境变化监听器执行失败:', error);
            }
        });
    }

    /**
     * 获取环境信息
     */
    getEnvironmentInfo() {
        return {
            type: this.currentEnvironment,
            isTest: this.isTestEnvironment(),
            isProduction: this.isProductionEnvironment(),
            storeInfo: somniumNexusStore.getEnvironmentInfo(),
            testDataInfo: this.isTestEnvironment() ? testDataStore.getTestLayoutBackupInfo() : null
        };
    }

    /**
     * 保存当前环境配置到本地存储
     */
    saveEnvironmentConfig() {
        try {
            const config = {
                environment: this.currentEnvironment,
                timestamp: Date.now()
            };
            localStorage.setItem('somnium_environment_config', JSON.stringify(config));
        } catch (error) {
            console.error('保存环境配置失败:', error);
        }
    }

    /**
     * 从本地存储加载环境配置
     */
    loadEnvironmentConfig() {
        try {
            const savedConfig = localStorage.getItem('somnium_environment_config');
            if (savedConfig) {
                const config = JSON.parse(savedConfig);
                if (config.environment === ENVIRONMENT_TYPES.TEST) {
                    this.switchToTestEnvironment();
                } else {
                    this.switchToProductionEnvironment();
                }
                return true;
            }
        } catch (error) {
            console.error('加载环境配置失败:', error);
        }
        return false;
    }

    /**
     * 清除本地存储的环境配置
     */
    clearEnvironmentConfig() {
        try {
            localStorage.removeItem('somnium_environment_config');
        } catch (error) {
            console.error('清除环境配置失败:', error);
        }
    }

    /**
     * 获取测试环境快捷操作
     */
    getTestEnvironmentShortcuts() {
        return {
            'Ctrl+Shift+T': () => this.switchToTestEnvironment(),
            'Ctrl+Shift+P': () => this.switchToProductionEnvironment(),
            'Ctrl+Shift+I': () => console.log('环境信息:', this.getEnvironmentInfo())
        };
    }

    /**
     * 初始化环境（从本地存储加载或默认正式环境）
     */
    initialize() {
        const loaded = this.loadEnvironmentConfig();
        if (!loaded) {
            // 默认使用正式环境
            this.switchToProductionEnvironment();
        }
        console.log('环境管理器已初始化 - Environment manager initialized');
    }

    /**
     * 获取环境状态指示器配置
     */
    getEnvironmentIndicator() {
        if (this.isTestEnvironment()) {
            return {
                text: '测试环境',
                color: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderColor: '#ff6b6b'
            };
        } else {
            return {
                text: '正式环境',
                color: '#4ecdc4',
                backgroundColor: 'rgba(78, 205, 196, 0.1)',
                borderColor: '#4ecdc4'
            };
        }
    }
}

// 创建全局环境管理器实例
export const environmentManager = new EnvironmentManager();

/**
 * React Hook 用于环境管理
 */
export function useEnvironment() {
    const [envInfo, setEnvInfo] = React.useState(() => environmentManager.getEnvironmentInfo());

    React.useEffect(() => {
        const handleEnvironmentChange = (newEnvironment) => {
            setEnvInfo(newEnvironment);
        };

        environmentManager.addEnvironmentChangeListener(handleEnvironmentChange);

        return () => {
            environmentManager.removeEnvironmentChangeListener(handleEnvironmentChange);
        };
    }, []);

    return {
        environment: envInfo,
        switchToTest: () => environmentManager.switchToTestEnvironment(),
        switchToProduction: () => environmentManager.switchToProductionEnvironment(),
        isTest: environmentManager.isTestEnvironment(),
        isProduction: environmentManager.isProductionEnvironment()
    };
}

/**
 * 环境切换组件
 */
export function EnvironmentToggle({ className = "" }) {
    const { environment, switchToTest, switchToProduction, isTest } = useEnvironment();
    const indicator = environmentManager.getEnvironmentIndicator();

    return (
        <div className={`environment-toggle ${className}`} style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: indicator.backgroundColor,
            border: `1px solid ${indicator.borderColor}`,
            color: indicator.color,
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
        }}
        onClick={() => isTest ? switchToProduction() : switchToTest()}
        >
            {indicator.text} | 点击切换
        </div>
    );
}

// 初始化环境管理器
environmentManager.initialize();

export default environmentManager;