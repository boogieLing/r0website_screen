import {get, post} from '@/request';

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
export const getPostListByR0 = (pageParams, handler) => {
    // 默认按创建时间降序
    get("api/base/article", {
        author: "r0",
        create_time_sort: createTimeDescend,
        page_number: pageParams.number,
        page_size: pageParams.size,
    }).then(r => handler(r));
}
export const getArticleInCategory = (category, handler) => {
    get("api/base/article/category/"+category, {
        lazy:"true",
    }).then(r => handler(r));
}
export const getDetailById = (id, handler) => {
    get("api/base/article/" + id, {
        create_time_sort: createTimeDescend,
    }).then(r => handler(r));
}
export const getCategories = (handler) => {
    get("api/base/category/all", {}).then(r => handler(r));
}

