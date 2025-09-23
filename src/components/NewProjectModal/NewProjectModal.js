import React, {useState, useEffect} from 'react';
import { observer } from 'mobx-react-lite';
import actionStore from '../../stores/actionStore';
import somniumNexusStore from '../../stores/somniumNexusStore';
import styles from './NewProjectModal.module.less';

const NewProjectModal = observer(() => {
    const [projectName, setProjectName] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 同步actionStore中的项目名稱
    useEffect(() => {
        setProjectName(actionStore.newProjectName);
    }, [actionStore.newProjectName]);

    const handleNameChange = (e) => {
        const value = e.target.value;
        setProjectName(value);
        actionStore.setNewProjectName(value);
        setError(''); // 清除错误信息
    };

    const validateProjectName = (name) => {
        if (!name.trim()) {
            return '请输入项目名称';
        }
        if (name.length > 50) {
            return '项目名称长度应在1-50个字符之间';
        }
        if (!/^[\u4e00-\u9fa5a-zA-Z0-9\s\-_]+$/.test(name)) {
            return '项目名称只能包含中文、英文、数字、空格、连字符和下划线';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateProjectName(projectName);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);

        try {
            const projectData = await actionStore.createNewProject();

            if (projectData) {
                // 添加到 somniumNexusStore 的用户项目（增量数据）
                somniumNexusStore.addUserProject(projectData.key, {
                    title: projectData.title,
                    key: projectData.key,
                    hasSubMenu: true,
                    subCategories: [],
                    images: [],
                    isNewProject: true,
                    createdAt: projectData.createdAt
                });

                // 显示成功消息（使用简单的alert代替message）
                alert(`项目 "${projectData.title}" 创建成功`);

                // 自动选中新创建的项目
                somniumNexusStore.setSelectedCategory(projectData.key);

                // 重置表单
                setProjectName('');
                setError('');
            }
        } catch (error) {
            console.error('创建项目失败:', error);
            setError('创建项目失败，请重试');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        actionStore.closeNewProjectModal();
        setProjectName('');
        setError('');
        setIsSubmitting(false);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    };

    if (!actionStore.isNewProjectModalOpen) return null;

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>新建项目</h2>
                    <button className={styles.closeButton} onClick={handleCancel}>
                        ×
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            项目名称
                        </label>
                        <input
                            type="text"
                            className={styles.input}
                            value={projectName}
                            onChange={handleNameChange}
                            placeholder="请输入项目名称"
                            maxLength={50}
                            autoFocus
                            disabled={isSubmitting}
                        />
                        <div className={styles.characterCount}>
                            {projectName.length}/50
                        </div>
                    </div>

                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={handleCancel}
                            disabled={isSubmitting}
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isSubmitting || !projectName.trim()}
                        >
                            {isSubmitting ? '创建中...' : '创建'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default NewProjectModal;