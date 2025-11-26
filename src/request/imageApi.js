import {del, get, post, put} from '@/request';

const prefix = '/api/base/picbed/image';

export const uploadImage = (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);

    if (options.name) {
        formData.append('name', options.name);
    }

    if (options.tags) {
        formData.append('tags', options.tags);
    }

    // 图片上传可能耗时较长，这里单独关闭超时限制并显式使用 multipart/form-data
    return post(prefix, formData, {
        timeout: 0, // 0 表示不限制超时时间，让后端自行控制
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const getImageDetail = (id) => get(`${prefix}/${id}`);

export const listImages = () => get(prefix);

export const findImagesByTag = (tag) => get(`${prefix}/tag/${tag}`);

export const searchImageByName = (kw) => get(`${prefix}/search/${kw}`);

// 更新图片在某个分类下的位置与布局信息
export const updateImagePosition = (id, data) => put(`${prefix}/${id}/position`, data);

// 删除图片
export const deleteImage = (id) => del(`${prefix}/${id}`);
