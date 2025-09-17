import request from "@/request"; // 假设你已有封装好的 fetch/axios 请求工具

const prefix = "/picbed/album";

export const createAlbum = (data) => request.post(`${prefix}`, data);

export const getAlbumDetail = (id) => request.get(`${prefix}/${id}`);

export const listAlbums = () => request.get(`${prefix}`);

export const findAlbumsByTag = (tag) => request.get(`${prefix}/tag/${tag}`);

export const findAlbumsByAuthor = (author) => request.get(`${prefix}/author/${author}`);

export const searchAlbumsByKeyword = (kw) => request.get(`${prefix}/search/${kw}`);

export const updateAlbum = (id, data) => request.put(`${prefix}/${id}`, data);

export const deleteAlbum = (id) => request.delete(`${prefix}/${id}`);

// 图集中图片引用与布局

export const addOrUpdateImageRef = (albumId, imageRefData) =>
  request.put(`${prefix}/${albumId}/image`, imageRefData);

export const updateImageLayout = (albumId, imageId, layoutData) =>
  request.put(`${prefix}/${albumId}/image/${imageId}/layout`, layoutData);

export const removeImageFromAlbum = (albumId, imageId) =>
  request.delete(`${prefix}/${albumId}/image/${imageId}`);

export const moveImageToAnotherAlbum = (data) =>
  request.put(`/picbed/image/move`, data);
