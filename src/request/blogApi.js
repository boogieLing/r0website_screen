import {get, post} from '@/request';

const createTimeDescend = {
    sort_direction: -1,
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
export const postDetailById = (id, handler) => {
    get("api/base/article/" + id, {
        create_time_sort: createTimeDescend,
    }).then(r => handler(r));
}