import {get, post, put} from '@/request';

/**
 * 用户登录
 * @param {string} email - 用户邮箱
 * @param {string} password - 用户密码
 * @param {function} handler - 回调函数，处理响应数据
 */
export const login = (email, password, handler) => {
    post("api/base/login", {
        email: email,
        password: password
    }).then(r => handler(r));
}

/**
 * 用户登出
 * @param {function} handler - 回调函数，处理响应数据
 */
export const logout = (handler) => {
    post("api/base/logout", {}).then(r => handler(r));
}

/**
 * 用户注册
 * @param {string} email - 用户邮箱
 * @param {string} password - 用户密码
 * @param {string} username - 用户名（可选）
 * @param {function} handler - 回调函数，处理响应数据
 */
export const register = (email, password, username, handler) => {
    post("api/base/register", {
        email: email,
        password: password,
        username: username
    }).then(r => handler(r));
}

/**
 * 获取当前用户信息（简化版本）
 * @param {function} handler - 回调函数，处理响应数据
 */
export const getCurrentUser = (handler) => {
    // 使用本地存储验证用户，避免调用不存在的API
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (token && (username || email)) {
        handler({
            data: {
                code: "001001200",
                msg: "操作成功",
                data: {
                    username,
                    email,
                    token,
                    phone: localStorage.getItem('phone') || '',
                    brief: localStorage.getItem('brief') || '',
                    user_level: parseInt(localStorage.getItem('userLevel')) || -1
                }
            }
        });
    } else {
        handler({
            data: {
                code: "001001404",
                msg: "用户未登录",
                data: null
            }
        });
    }
}

/**
 * 更新用户信息
 * @param {object} userData - 用户数据对象
 * @param {function} handler - 回调函数，处理响应数据
 */
export const updateUser = (userData, handler) => {
    put("api/base/user", userData).then(r => handler(r));
}

/**
 * 修改密码
 * @param {string} oldPassword - 旧密码
 * @param {string} newPassword - 新密码
 * @param {function} handler - 回调函数，处理响应数据
 */
export const changePassword = (oldPassword, newPassword, handler) => {
    put("api/base/user/password", {
        oldPassword: oldPassword,
        newPassword: newPassword
    }).then(r => handler(r));
}

/**
 * 重置密码请求
 * @param {string} email - 用户邮箱
 * @param {function} handler - 回调函数，处理响应数据
 */
export const requestPasswordReset = (email, handler) => {
    post("api/base/user/password/reset", {
        email: email
    }).then(r => handler(r));
}

/**
 * 验证重置密码令牌
 * @param {string} token - 重置令牌
 * @param {function} handler - 回调函数，处理响应数据
 */
export const verifyResetToken = (token, handler) => {
    get("api/base/user/password/reset/verify", {
        token: token
    }).then(r => handler(r));
}

/**
 * 确认重置密码
 * @param {string} token - 重置令牌
 * @param {string} newPassword - 新密码
 * @param {function} handler - 回调函数，处理响应数据
 */
export const confirmPasswordReset = (token, newPassword, handler) => {
    post("api/base/user/password/reset/confirm", {
        token: token,
        newPassword: newPassword
    }).then(r => handler(r));
}

/**
 * 获取用户列表（管理员功能）
 * @param {object} pageParams - 分页参数
 * @param {function} handler - 回调函数，处理响应数据
 */
export const getUserList = (pageParams, handler) => {
    if (!pageParams) {
        pageParams = {
            number: 1,
            size: 20,
        };
    }
    get("api/base/user", {
        page_number: pageParams.number,
        page_size: pageParams.size,
    }).then(r => handler(r));
}

/**
 * 删除用户（管理员功能）
 * @param {string} userId - 用户ID
 * @param {function} handler - 回调函数，处理响应数据
 */
export const deleteUser = (userId, handler) => {
    post(`api/base/user/${userId}/delete`, {}).then(r => handler(r));
}

/**
 * 更新用户状态（管理员功能）
 * @param {string} userId - 用户ID
 * @param {string} status - 用户状态（active, inactive, banned等）
 * @param {function} handler - 回调函数，处理响应数据
 */
export const updateUserStatus = (userId, status, handler) => {
    put(`api/base/user/${userId}/status`, {
        status: status
    }).then(r => handler(r));
}

/**
 * 获取用户统计信息
 * @param {function} handler - 回调函数，处理响应数据
 */
export const getUserStats = (handler) => {
    get("api/base/user/stats", {}).then(r => handler(r));
}