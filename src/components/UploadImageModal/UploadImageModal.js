import React, {useState} from 'react';
import {observer} from 'mobx-react-lite';
import actionStore from '@/stores/actionStore';
import styles from './UploadImageModal.module.less';

const UploadImageModal = observer(() => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [tags, setTags] = useState('');
    const [error, setError] = useState('');

    if (!actionStore.isUploadImageModalOpen) {
        return null;
    }

    const handleFileChange = (e) => {
        const selected = e.target.files && e.target.files[0];
        setFile(selected || null);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!file) {
            setError('请选择要上传的图片文件');
            return;
        }

        const payload = {
            name: name.trim() || undefined,
            tags: tags.trim() || undefined
        };

        // 启动异步上传任务，不阻塞当前弹窗
        actionStore.uploadImageAsync(file, payload);

        // 立即关闭上传弹窗并重置本地状态
        setFile(null);
        setName('');
        setTags('');
        setError('');
        actionStore.closeUploadImageModal();
    };

    const handleCancel = () => {
        actionStore.closeUploadImageModal();
        setFile(null);
        setName('');
        setTags('');
        setError('');
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCancel();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>上传图片</h2>
                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={handleCancel}
                    >
                        ×
                    </button>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>图片文件</label>
                        <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.gif,.webp"
                            className={styles.fileInput}
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>图片名称（可选）</label>
                        <input
                            type="text"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="不填写则使用文件名"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>标签（可选，逗号分隔）</label>
                        <input
                            type="text"
                            className={styles.tagsInput}
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="例如：风景,日系,人像"
                        />
                    </div>

                    {error && (
                        <div className={styles.error}>{error}</div>
                    )}

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={styles.cancelButton}
                            onClick={handleCancel}
                            disabled={actionStore.isUploadingImage}
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={actionStore.isUploadingImage}
                        >
                            {actionStore.isUploadingImage ? '上传中...' : '上传'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
});

export default UploadImageModal;
