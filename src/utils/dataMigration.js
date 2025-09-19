/**
 * 数据迁移工具
 * 用于从测试数据迁移到正式环境数据
 */

import React from 'react';

import somniumNexusStore from "@/stores/somniumNexusStore";
import testDataStore from "@/stores/testDataStore";
import galleryStore from "@/stores/galleryStore";

/**
 * 数据迁移管理器
 */
class DataMigrationManager {
    constructor() {
        this.migrationHistory = [];
        this.currentMigration = null;
    }

    /**
     * 从测试数据创建正式数据结构
     */
    createProductionDataFromTest() {
        const testData = testDataStore.getTestGalleryData();
        if (!testData) {
            console.error('无法获取测试数据');
            return null;
        }

        const productionData = {};

        Object.keys(testData).forEach(categoryKey => {
            const category = testData[categoryKey];
            productionData[categoryKey] = {
                title: category.title,
                description: category.description,
                hasSubMenu: category.hasSubMenu || false,
                subCategories: category.subCategories || [],
                images: category.images.map(image => ({
                    ...image,
                    // 添加正式环境需要的额外字段
                    isProduction: true,
                    migratedFromTest: true,
                    migrationDate: new Date().toISOString()
                }))
            };
        });

        return productionData;
    }

    /**
     * 迁移布局数据
     */
    migrateLayoutData(categoryId) {
        const testLayoutData = testDataStore.restoreLayoutData(categoryId);
        if (!testLayoutData) {
            console.warn(`未找到分类 ${categoryId} 的测试布局数据`);
            return null;
        }

        // 将测试布局数据应用到正式环境
        const layoutData = {};
        testLayoutData.forEach((item, itemId) => {
            layoutData[itemId] = {
                ...item,
                migratedFromTest: true,
                migrationDate: new Date().toISOString()
            };
        });

        return layoutData;
    }

    /**
     * 执行完整的数据迁移
     */
    async performFullMigration(options = {}) {
        const {
            includeLayoutData = true,
            backupTestData = true,
            clearAfterMigration = false,
            onProgress = null
        } = options;

        try {
            this.currentMigration = {
                id: `migration_${Date.now()}`,
                startTime: new Date(),
                status: 'running',
                steps: []
            };

            // 步骤1: 备份测试数据
            if (backupTestData) {
                this.reportProgress('备份测试数据...', 10);
                this.backupTestData();
            }

            // 步骤2: 创建正式数据结构
            this.reportProgress('创建正式数据结构...', 30);
            const productionData = this.createProductionDataFromTest();
            if (!productionData) {
                throw new Error('无法创建正式数据结构');
            }

            // 步骤3: 设置正式数据
            this.reportProgress('设置正式数据...', 50);
            somniumNexusStore.setProductionData(productionData);

            // 步骤4: 迁移布局数据
            if (includeLayoutData) {
                this.reportProgress('迁移布局数据...', 70);
                Object.keys(productionData).forEach(categoryId => {
                    const layoutData = this.migrateLayoutData(categoryId);
                    if (layoutData) {
                        // 应用到galleryStore
                        Object.entries(layoutData).forEach(([itemId, item]) => {
                            galleryStore.updateItem(itemId, item);
                        });
                    }
                });
            }

            // 步骤5: 切换到正式环境
            this.reportProgress('切换到正式环境...', 90);
            somniumNexusStore.disableTestEnvironment();

            // 步骤6: 清理（可选）
            if (clearAfterMigration) {
                this.reportProgress('清理测试数据...', 95);
                testDataStore.clearTestLayoutBackups();
            }

            // 完成迁移
            this.currentMigration.endTime = new Date();
            this.currentMigration.status = 'completed';
            this.currentMigration.steps.push('迁移完成');

            this.reportProgress('数据迁移完成！', 100);

            // 保存迁移历史
            this.migrationHistory.push({ ...this.currentMigration });

            return {
                success: true,
                migrationId: this.currentMigration.id,
                duration: this.currentMigration.endTime - this.currentMigration.startTime,
                data: productionData
            };

        } catch (error) {
            this.currentMigration.status = 'failed';
            this.currentMigration.error = error.message;
            this.reportProgress(`迁移失败: ${error.message}`, 0);

            return {
                success: false,
                error: error.message,
                migrationId: this.currentMigration.id
            };
        } finally {
            this.currentMigration = null;
        }
    }

    /**
     * 备份测试数据
     */
    backupTestData() {
        const testData = testDataStore.getTestGalleryData();
        if (testData) {
            const backup = {
                timestamp: Date.now(),
                data: JSON.parse(JSON.stringify(testData)), // 深拷贝
                type: 'test_data_backup'
            };

            // 保存到本地存储
            try {
                localStorage.setItem('somnium_test_data_backup', JSON.stringify(backup));
                console.log('测试数据已备份');
            } catch (error) {
                console.error('备份测试数据失败:', error);
            }
        }
    }

    /**
     * 恢复测试数据
     */
    restoreTestData() {
        try {
            const backupData = localStorage.getItem('somnium_test_data_backup');
            if (backupData) {
                const backup = JSON.parse(backupData);
                if (backup.type === 'test_data_backup') {
                    // 恢复测试数据到testDataStore
                    Object.keys(backup.data).forEach(categoryKey => {
                        testDataStore.testGalleryData[categoryKey] = backup.data[categoryKey];
                    });
                    console.log('测试数据已恢复');
                    return true;
                }
            }
        } catch (error) {
            console.error('恢复测试数据失败:', error);
        }
        return false;
    }

    /**
     * 报告进度
     */
    reportProgress(message, percentage) {
        console.log(`[数据迁移] ${message} (${percentage}%)`);

        if (this.currentMigration) {
            this.currentMigration.steps.push({
                message,
                percentage,
                timestamp: new Date()
            });
        }
    }

    /**
     * 获取迁移历史
     */
    getMigrationHistory() {
        return this.migrationHistory.map(migration => ({
            id: migration.id,
            startTime: migration.startTime,
            endTime: migration.endTime,
            status: migration.status,
            duration: migration.endTime - migration.startTime,
            stepCount: migration.steps.length
        }));
    }

    /**
     * 验证迁移后的数据完整性
     */
    validateMigratedData() {
        const errors = [];
        const warnings = [];

        try {
            const productionData = somniumNexusStore.galleryCategories;
            if (!productionData) {
                errors.push('无法获取正式环境数据');
                return { valid: false, errors, warnings };
            }

            // 验证每个分类
            Object.keys(productionData).forEach(categoryKey => {
                const category = productionData[categoryKey];

                if (!category.title) {
                    errors.push(`分类 ${categoryKey} 缺少标题`);
                }

                if (!category.description) {
                    warnings.push(`分类 ${categoryKey} 缺少描述`);
                }

                if (!category.images || category.images.length === 0) {
                    warnings.push(`分类 ${categoryKey} 没有图片`);
                } else {
                    // 验证图片数据
                    category.images.forEach((image, index) => {
                        if (!image.id) {
                            errors.push(`分类 ${categoryKey} 的图片 ${index} 缺少ID`);
                        }
                        if (!image.src) {
                            errors.push(`分类 ${categoryKey} 的图片 ${index} 缺少源文件`);
                        }
                    });
                }
            });

            return {
                valid: errors.length === 0,
                errors,
                warnings
            };

        } catch (error) {
            errors.push(`验证过程出错: ${error.message}`);
            return { valid: false, errors, warnings };
        }
    }

    /**
     * 生成迁移报告
     */
    generateMigrationReport() {
        const validation = this.validateMigratedData();
        const environmentInfo = somniumNexusStore.getEnvironmentInfo();

        return {
            timestamp: new Date().toISOString(),
            environmentInfo,
            validation,
            migrationHistory: this.getMigrationHistory(),
            recommendations: this.generateRecommendations(validation)
        };
    }

    /**
     * 生成迁移建议
     */
    generateRecommendations(validation) {
        const recommendations = [];

        if (!validation.valid) {
            recommendations.push('请修复数据验证错误后再进行正式部署');
        }

        if (validation.warnings.length > 0) {
            recommendations.push('请检查并处理数据验证警告');
        }

        if (somniumNexusStore.isUsingTestData) {
            recommendations.push('当前仍在使用测试数据，建议切换到正式环境');
        }

        return recommendations;
    }
}

// 创建全局迁移管理器实例
export const dataMigrationManager = new DataMigrationManager();

/**
 * 快速迁移函数
 */
export async function quickMigrateToProduction(options = {}) {
    return dataMigrationManager.performFullMigration({
        includeLayoutData: true,
        backupTestData: true,
        clearAfterMigration: false,
        ...options
    });
}

/**
 * 迁移工具UI组件
 */
export function MigrationTool({ onComplete, onError }) {
    const [isMigrating, setIsMigrating] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [message, setMessage] = React.useState('');

    const handleMigrate = async () => {
        setIsMigrating(true);
        setProgress(0);
        setMessage('开始数据迁移...');

        try {
            // 自定义进度回调
            const onProgress = (msg, pct) => {
                setMessage(msg);
                setProgress(pct);
            };

            const result = await dataMigrationManager.performFullMigration({
                onProgress,
                includeLayoutData: true,
                backupTestData: true,
                clearAfterMigration: false
            });

            if (result.success) {
                setMessage('迁移完成！');
                setProgress(100);
                if (onComplete) onComplete(result);
            } else {
                setMessage(`迁移失败: ${result.error}`);
                if (onError) onError(result);
            }
        } catch (error) {
            setMessage(`迁移出错: ${error.message}`);
            if (onError) onError({ success: false, error: error.message });
        } finally {
            setIsMigrating(false);
        }
    };

    return (
        <div className="migration-tool" style={{
            padding: '20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            maxWidth: '400px'
        }}>
            <h3>数据迁移工具</h3>
            <p>将测试数据迁移到正式环境</p>

            <div style={{ margin: '15px 0' }}>
                <button
                    onClick={handleMigrate}
                    disabled={isMigrating}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: isMigrating ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: isMigrating ? 'not-allowed' : 'pointer'
                    }}
                >
                    {isMigrating ? '迁移中...' : '开始迁移'}
                </button>
            </div>

            {isMigrating && (
                <div>
                    <div style={{
                        backgroundColor: '#e9ecef',
                        borderRadius: '4px',
                        padding: '10px',
                        marginBottom: '10px'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '20px',
                            backgroundColor: '#28a745',
                            borderRadius: '2px',
                            transition: 'width 0.3s ease'
                        }}></div>
                    </div>
                    <p style={{ fontSize: '14px', color: '#666' }}>{message}</p>
                </div>
            )}
        </div>
    );
}

export default dataMigrationManager;