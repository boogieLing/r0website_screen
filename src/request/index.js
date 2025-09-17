import axios from "axios"
import axiosRetry from "axios-retry";


const serverClient = axios.create({
    // baseURL: "https://www.r0r0.pink/server/",
    baseURL: "https://www.shyr0.com/server/",
    timeout: 10000 //请求的超时时间
});
serverClient.defaults.headers.post["Content-Type"] = "application/json";
// 当请求失败后，自动重新请求，只有3次失败后才真正失败
axiosRetry(serverClient, {retries: 3});

/** 添加请求拦截器 **/
serverClient.interceptors.request.use(config => {
    // 文件上传，发送的是二进制流，所以需要设置请求头的"Content-Type"
    if (config.url.includes("upload")) {
        config.headers["Content-Type"] = "multipart/form-data";
    }
    return config
}, error => {
    return Promise.reject(error)
})
/** 添加响应拦截器  **/
serverClient.interceptors.response.use(response => {

    return Promise.resolve(response);
}, error => {
    if (error.response) {
        console.log(error);
        return Promise.reject(error)
    } else {
        return Promise.reject('请求超时, 请刷新重试')
    }
})

/* 统一封装get请求 */
export const get = (url, params, config = {}) => {
    return new Promise((resolve, reject) => {
        serverClient({
            method: 'get',
            url,
            params,
            ...config
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}

/* 统一封装post请求  */
export const post = (url, data, config = {}) => {
    return new Promise((resolve, reject) => {
        serverClient({
            method: 'post',
            url,
            data,
            ...config
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}
/* 统一封装put请求  */
export const put= (url, data, config = {}) => {
    return new Promise((resolve, reject) => {
        serverClient({
            method: 'put',
            url,
            data,
            ...config
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error)
        })
    })
}
