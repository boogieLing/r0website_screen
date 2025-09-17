import request from "@/request";

const prefix = "/picbed/image";

export const uploadImage = (formData) =>
  request.post(`${prefix}`, formData); // Content-Type: multipart/form-data

export const getImageDetail = (id) => request.get(`${prefix}/${id}`);

export const listImages = () => request.get(`${prefix}`);

export const findImagesByTag = (tag) => request.get(`${prefix}/tag/${tag}`);

export const searchImageByName = (kw) => request.get(`${prefix}/search/${kw}`);

export const getImageAlbums = (id) => request.get(`${prefix}/${id}/albums`);

export const deleteImage = (id) => request.delete(`${prefix}/${id}`);
