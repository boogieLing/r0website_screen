import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import styles from "./NewProjectForm.module.less";

const NewProjectForm = observer(({onSubmit, onCancel}) => {
    const [formData, setFormData] = useState({
        projectKey: '',
        title: '',
        description: '',
        hasSubMenu: false,
        subCategories: [],
        images: []
    });

    const [subCategoryInput, setSubCategoryInput] = useState('');
    const [errors, setErrors] = useState({});

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // 清除对应字段的错误
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleSubMenuToggle = () => {
        const newHasSubMenu = !formData.hasSubMenu;
        setFormData(prev => ({
            ...prev,
            hasSubMenu: newHasSubMenu,
            subCategories: newHasSubMenu ? prev.subCategories : []
        }));
    };

    const addSubCategory = () => {
        if (subCategoryInput.trim()) {
            const newSubCategory = {
                key: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                title: subCategoryInput.trim()
            };
            setFormData(prev => ({
                ...prev,
                subCategories: [...prev.subCategories, newSubCategory]
            }));
            setSubCategoryInput('');
        }
    };

    const removeSubCategory = (key) => {
        setFormData(prev => ({
            ...prev,
            subCategories: prev.subCategories.filter(sub => sub.key !== key)
        }));
    };

    const generateProjectKey = () => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 4);
        const key = `project_${timestamp}_${random}`;
        handleInputChange('projectKey', key);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.projectKey.trim()) {
            newErrors.projectKey = '项目标识不能为空';
        }

        if (!formData.title.trim()) {
            newErrors.title = '项目标题不能为空';
        }

        if (formData.hasSubMenu && formData.subCategories.length === 0) {
            newErrors.subCategories = '启用子菜单时至少需要添加一个子分类';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const projectData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                images: formData.images,
                hasSubMenu: formData.hasSubMenu,
                subCategories: formData.subCategories
            };

            onSubmit(formData.projectKey.trim(), projectData);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.target.name === 'subCategoryInput') {
                addSubCategory();
            }
        }
    };

    return (
        <div className={styles.formOverlay} onClick={onCancel}>
            <div className={styles.formContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.formHeader}>
                    <h3 className={styles.formTitle}>新增项目</h3>
                    <p className={styles.formSubtitle}>创建新的图集项目</p>
                </div>

                <form className={styles.formContent} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            项目标识
                            <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.inputGroup}>
                            <input
                                type="text"
                                name="projectKey"
                                value={formData.projectKey}
                                onChange={(e) => handleInputChange('projectKey', e.target.value)}
                                className={`${styles.formInput} ${errors.projectKey ? styles.error : ''}`}
                                placeholder="输入唯一标识符"
                            />
                            <button
                                type="button"
                                onClick={generateProjectKey}
                                className={styles.generateButton}
                            >
                                生成
                            </button>
                        </div>
                        {errors.projectKey && (
                            <span className={styles.errorMessage}>{errors.projectKey}</span>
                        )}
                        <p className={styles.helpText}>用于系统内部识别的唯一标识符</p>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>
                            项目标题
                            <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className={`${styles.formInput} ${errors.title ? styles.error : ''}`}
                            placeholder="输入项目标题"
                        />
                        {errors.title && (
                            <span className={styles.errorMessage}>{errors.title}</span>
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.formLabel}>项目描述</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className={styles.formTextarea}
                            placeholder="输入项目描述（可选）"
                            rows="3"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <div className={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                id="hasSubMenu"
                                checked={formData.hasSubMenu}
                                onChange={handleSubMenuToggle}
                                className={styles.checkbox}
                            />
                            <label htmlFor="hasSubMenu" className={styles.checkboxLabel}>
                                启用子菜单
                            </label>
                        </div>
                        <p className={styles.helpText}>启用后可以为项目添加子分类</p>
                    </div>

                    {formData.hasSubMenu && (
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>
                                子分类
                                {formData.subCategories.length > 0 && (
                                    <span className={styles.count}>({formData.subCategories.length})</span>
                                )}
                            </label>
                            <div className={styles.subCategoryInputGroup}>
                                <input
                                    type="text"
                                    name="subCategoryInput"
                                    value={subCategoryInput}
                                    onChange={(e) => setSubCategoryInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className={styles.formInput}
                                    placeholder="输入子分类名称"
                                />
                                <button
                                    type="button"
                                    onClick={addSubCategory}
                                    className={styles.addButton}
                                    disabled={!subCategoryInput.trim()}
                                >
                                    添加
                                </button>
                            </div>
                            {errors.subCategories && (
                                <span className={styles.errorMessage}>{errors.subCategories}</span>
                            )}

                            {formData.subCategories.length > 0 && (
                                <div className={styles.subCategoryList}>
                                    {formData.subCategories.map((subCategory) => (
                                        <div key={subCategory.key} className={styles.subCategoryItem}>
                                            <span className={styles.subCategoryTitle}>{subCategory.title}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeSubCategory(subCategory.key)}
                                                className={styles.removeButton}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={onCancel}
                            className={`${styles.button} ${styles.cancelButton}`}
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className={`${styles.button} ${styles.submitButton}`}
                        >
                            创建项目
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default NewProjectForm;