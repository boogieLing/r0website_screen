import {makeAutoObservable, runInAction} from 'mobx';
import {login as loginApi} from '@/request/userApi';
import actionStore from './actionStore';

class UserStore {
    token = localStorage.getItem('token') || '';
    username = localStorage.getItem('username') || '';
    email = localStorage.getItem('email') || '';
    phone = localStorage.getItem('phone') || '';
    brief = localStorage.getItem('brief') || '';
    userLevel = parseInt(localStorage.getItem('userLevel')) || -1;
    isAuthenticated = !!this.token;
    isLoading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
        if (this.token) {
            this.validateCurrentUser();
        }
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('token', token);
            this.isAuthenticated = true;
        } else {
            localStorage.removeItem('token');
            this.isAuthenticated = false;
        }
    }

    setUserInfo(username, email, phone = '', brief = '', userLevel = -1) {
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.brief = brief;
        this.userLevel = userLevel;

        localStorage.setItem('username', username);
        localStorage.setItem('email', email);
        localStorage.setItem('phone', phone);
        localStorage.setItem('brief', brief);
        localStorage.setItem('userLevel', userLevel.toString());
    }

    setLoading(loading) {
        this.isLoading = loading;
    }

    setError(error) {
        this.error = error;
    }

    clearError() {
        this.error = null;
    }

    async login(email, password) {
        this.setLoading(true);
        this.clearError();

        return new Promise((resolve, reject) => {
            loginApi(email, password, (response) => {
                runInAction(() => {
                    if (response.data.code === "001001200") {
                        const {data} = response.data;
                        const {token, username, email: userEmail, phone = '', brief = '', user_level = -1} = data;

                        this.setToken(token);
                        this.setUserInfo(username || '', userEmail || '', phone, brief, user_level);
                        this.clearError();
                        resolve(true);
                    } else {
                        this.setError(response.data.msg || '登录失败，请检查邮箱和密码');
                        resolve(false);
                    }
                    this.setLoading(false);
                });
            });
        }).catch((error) => {
            runInAction(() => {
                this.setLoading(false);
                this.setError('网络错误，请稍后重试');
            });
            console.error('Login error:', error);
            return false;
        });
    }

    async logout() {
        // 简化登出逻辑，直接清除本地存储
        this.setToken('');
        this.setUserInfo('', '');
        this.clearError();

        // 清除Somnium Nexus相关的本地存储数据（这些是缓存的增量数据）
        try {
            // 清除用户项目数据
            localStorage.removeItem('somnium_user_projects');

            // 清除环境配置
            localStorage.removeItem('somnium_environment_config');

            // 清除测试数据备份
            localStorage.removeItem('somnium_test_data_backup');

            // 重置操作状态
            actionStore.resetAllActionStates();

            console.log('用户注销时清除了Somnium Nexus本地存储数据和操作状态');
        } catch (error) {
            console.error('清除Somnium Nexus本地存储数据失败:', error);
        }
    }

    async validateCurrentUser() {
        if (!this.token) return;

        // 使用本地存储验证用户，避免调用不存在的API
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email');
        const phone = localStorage.getItem('phone');
        const brief = localStorage.getItem('brief');
        const userLevel = parseInt(localStorage.getItem('userLevel')) || -1;

        if (username || email) {
            this.setUserInfo(username || '', email || '', phone, brief, userLevel);
        } else {
            // 如果本地没有用户信息，清除token
            this.setToken('');
            this.setUserInfo('', '', '', '', -1);
        }
    }

    get isLoggedIn() {
        return this.isAuthenticated && !!this.token;
    }

    get userDisplayName() {
        return this.username || this.email || '用户';
    }

    get canAccessActionTabs() {
        return this.isLoggedIn && this.userLevel === -1;
    }

    clearUserData() {
        this.setToken('');
        this.setUserInfo('', '', '', '', -1);
        this.clearError();
    }
}

export default new UserStore();