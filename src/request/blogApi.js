import {get, post, put} from '@/request';

export const createTimeDescend = {
    sort_direction: -1,
    sort_flag: true
};
export const createTimeAscending = {
    sort_direction: 1,
    sort_flag: true
};
export const updateTimeDescend = {
    sort_direction: -1,
    sort_flag: true
};
export const updateTimeAscending = {
    sort_direction: 1,
    sort_flag: true
};
export const getPostListByR0 = (pageParams, sortParams, handler) => {
    // 默认按创建时间降序
    if (!pageParams) {
        pageParams = {
            number: 1,
            size: 5,
        }
    }
    get("api/base/article", {
        author: "r0",
        ...sortParams,
        page_number: pageParams.number,
        page_size: pageParams.size,
        lazy: "true",
    }).then(r => handler(r));
}
export const getArticleInCategory = (category, pageParams, sortParams, handler) => {
    if (!pageParams) {
        pageParams = {
            number: 1,
            size: 5,
        };
    }
    if (!sortParams) {
        sortParams = updateTimeDescend;
    }
    get("api/base/article/category/" + category, {
        ...sortParams,
        page_number: pageParams.number,
        page_size: pageParams.size,
        lazy: "true",
    }).then(r => handler(r));
}
export const getDetailById = (id, handler) => {
    get("api/base/article/" + id, {}).then(r => handler(r));
}
export const getCategories = (handler) => {
    get("api/base/category/all", {}).then(r => handler(r));
}
export const addPv = (id, handler) => {
    put(`api/base/article/${id}/pv`, {}).then(r => handler(r));
}
export const addPraise = (id, handler) => {
    put(`api/base/article/${id}/praise`, {}).then(r => handler(r));
}
