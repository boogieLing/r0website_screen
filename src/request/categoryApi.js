import {get, post, put} from '@/request';

const prefix = '/api/base/picbed/category';

export const createCategory = (data) => post(prefix, data);

export const listCategories = () => get(prefix);

export const getCategoryImages = (id, params = {}) =>
    get(`${prefix}/${id}/images`, params);

export const updateCategory = (id, data) => put(`${prefix}/${id}`, data);

// 更新分类的布局模式（flex / freedom）
export const updateCategoryLayoutMode = (id, layoutMode) =>
    put(`${prefix}/${id}/layout`, {layoutMode});

// 将图片添加到指定分类下
export const addImageToCategory = (categoryId, data) =>
    post(`${prefix}/${categoryId}/images`, data);
