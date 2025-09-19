import { makeAutoObservable } from 'mobx';

/**
 * TestDataStore - 测试数据管理
 * 专门管理测试阶段使用的模拟数据，与正式环境数据分离
 */
class TestDataStore {
    constructor() {
        makeAutoObservable(this);
    }

    // 测试环境标识
    isTestEnvironment = false;

    // 测试用的图集数据 - 从somniumNexusStore迁移的测试数据
    testGalleryData = {
        "stillness": {
            title: "Stillness",
            description: "静谧时刻的诗意捕捉，探寻日常中的禅意美学",
            hasSubMenu: true,
            subCategories: [
                {key: "morning", title: "晨雾"},
                {key: "reflection", title: "倒影"},
                {key: "silence", title: "静默"},
                {key: "space", title: "留白"}
            ],
            images: [
                {id: 1, title: "晨雾", year: "2024", src: "/static/images/stillness-01.jpg", category: "stillness", subCategory: "morning"},
                {id: 2, title: "倒影", year: "2024", src: "/static/images/stillness-02.jpg", category: "stillness", subCategory: "reflection"},
                {id: 3, title: "静默", year: "2024", src: "/static/images/stillness-03.jpg", category: "stillness", subCategory: "silence"},
                {id: 4, title: "留白", year: "2024", src: "/static/images/stillness-04.jpg", category: "stillness", subCategory: "space"},
                {id: 5, title: "光影", year: "2024", src: "/static/images/stillness-05.jpg", category: "stillness", subCategory: "morning"},
                {id: 6, title: "禅意", year: "2024", src: "/static/images/stillness-06.jpg", category: "stillness", subCategory: "silence"}
            ]
        },
        "interlude": {
            title: "Interlude",
            description: "时光间隙的温柔记录，捕捉转瞬即逝的美好",
            hasSubMenu: false,
            images: [
                {id: 7, title: "午后", year: "2024", src: "/static/images/interlude-01.jpg", category: "interlude"},
                {id: 8, title: "微风", year: "2024", src: "/static/images/interlude-02.jpg", category: "interlude"},
                {id: 9, title: "流转", year: "2024", src: "/static/images/interlude-03.jpg", category: "interlude"},
                {id: 10, title: "瞬息", year: "2024", src: "/static/images/interlude-04.jpg", category: "interlude"},
                {id: 11, title: "柔光", year: "2024", src: "/static/images/interlude-05.jpg", category: "interlude"},
                {id: 12, title: "时光", year: "2024", src: "/static/images/interlude-06.jpg", category: "interlude"}
            ]
        },
        "echoes": {
            title: "Echoes",
            description: "记忆回响的诗意表达，探索内心的声音",
            hasSubMenu: true,
            subCategories: [
                {key: "memory", title: "记忆"},
                {key: "dream", title: "梦境"},
                {key: "heart", title: "心象"}
            ],
            images: [
                {id: 13, title: "回响", year: "2024", src: "/static/images/echoes-01.jpg", category: "echoes", subCategory: "memory"},
                {id: 14, title: "记忆", year: "2024", src: "/static/images/echoes-02.jpg", category: "echoes", subCategory: "memory"},
                {id: 15, title: "梦境", year: "2024", src: "/static/images/echoes-03.jpg", category: "echoes", subCategory: "dream"},
                {id: 16, title: "心象", year: "2024", src: "/static/images/echoes-04.jpg", category: "echoes", subCategory: "heart"},
                {id: 17, title: "感悟", year: "2024", src: "/static/images/echoes-05.jpg", category: "echoes", subCategory: "heart"},
                {id: 18, title: "诗意", year: "2024", src: "/static/images/echoes-06.jpg", category: "echoes", subCategory: "dream"}
            ]
        },
        "fragments": {
            title: "Fragments",
            description: "片段化生活的瞬间美学，发现不完整的美",
            hasSubMenu: false,
            images: [
                {id: 19, title: "碎片", year: "2024", src: "/static/images/fragments-01.jpg", category: "fragments"},
                {id: 20, title: "瞬间", year: "2024", src: "/static/images/fragments-02.jpg", category: "fragments"},
                {id: 21, title: "不完整", year: "2024", src: "/static/images/fragments-03.jpg", category: "fragments"},
                {id: 22, title: "片段", year: "2024", src: "/static/images/fragments-04.jpg", category: "fragments"},
                {id: 23, title: "零散", year: "2024", src: "/static/images/fragments-05.jpg", category: "fragments"},
                {id: 24, title: "残缺", year: "2024", src: "/static/images/fragments-06.jpg", category: "fragments"}
            ]
        },
        "transparency": {
            title: "Transparency",
            description: "透明质感的视觉探索，展现光影的层次",
            hasSubMenu: true,
            subCategories: [
                {key: "layer", title: "层次"},
                {key: "light", title: "光影"},
                {key: "texture", title: "质感"}
            ],
            images: [
                {id: 25, title: "透明", year: "2024", src: "/static/images/transparency-01.jpg", category: "transparency", subCategory: "layer"},
                {id: 26, title: "层次", year: "2024", src: "/static/images/transparency-02.jpg", category: "transparency", subCategory: "layer"},
                {id: 27, title: "光影", year: "2024", src: "/static/images/transparency-03.jpg", category: "transparency", subCategory: "light"},
                {id: 28, title: "质感", year: "2024", src: "/static/images/transparency-04.jpg", category: "transparency", subCategory: "texture"},
                {id: 29, title: "纯净", year: "2024", src: "/static/images/transparency-05.jpg", category: "transparency", subCategory: "texture"},
                {id: 30, title: "澄澈", year: "2024", src: "/static/images/transparency-06.jpg", category: "transparency", subCategory: "light"}
            ]
        },
        "threshold": {
            title: "Threshold",
            description: "临界状态的哲学思考，探索转变的瞬间",
            hasSubMenu: false,
            images: [
                {id: 31, title: "临界", year: "2024", src: "/static/images/threshold-01.jpg", category: "threshold"},
                {id: 32, title: "转变", year: "2024", src: "/static/images/threshold-02.jpg", category: "threshold"},
                {id: 33, title: "边界", year: "2024", src: "/static/images/threshold-03.jpg", category: "threshold"},
                {id: 34, title: "过渡", year: "2024", src: "/static/images/threshold-04.jpg", category: "threshold"},
                {id: 35, title: "瞬间", year: "2024", src: "/static/images/threshold-05.jpg", category: "threshold"},
                {id: 36, title: "临界点", year: "2024", src: "/static/images/threshold-06.jpg", category: "threshold"}
            ]
        }
    };

    // 测试用的布局数据备份
    testLayoutData = new Map();

    // 启用测试环境
    enableTestEnvironment() {
        this.isTestEnvironment = true;
        console.log('测试环境已启用 - Test environment enabled');
    }

    // 禁用测试环境
    disableTestEnvironment() {
        this.isTestEnvironment = false;
        console.log('测试环境已禁用 - Test environment disabled');
    }

    // 保存当前布局数据到测试备份
    saveLayoutData(categoryId, layoutData) {
        this.testLayoutData.set(categoryId, {
            timestamp: Date.now(),
            data: new Map(layoutData)
        });
        console.log(`布局数据已保存到测试备份 - Layout data saved to test backup: ${categoryId}`);
    }

    // 从测试备份恢复布局数据
    restoreLayoutData(categoryId) {
        const backup = this.testLayoutData.get(categoryId);
        if (backup) {
            console.log(`从测试备份恢复布局数据 - Restoring layout data from test backup: ${categoryId}`);
            return backup.data;
        }
        return null;
    }

    // 获取测试用的图集数据
    getTestGalleryData() {
        if (!this.isTestEnvironment) {
            console.warn('测试环境未启用，无法获取测试数据 - Test environment not enabled');
            return null;
        }
        return this.testGalleryData;
    }

    // 获取指定分类的测试数据
    getTestCategoryData(categoryId) {
        if (!this.isTestEnvironment) {
            console.warn('测试环境未启用，无法获取测试数据 - Test environment not enabled');
            return null;
        }
        return this.testGalleryData[categoryId];
    }

    // 获取所有测试图片
    getAllTestImages() {
        if (!this.isTestEnvironment) {
            console.warn('测试环境未启用，无法获取测试数据 - Test environment not enabled');
            return [];
        }
        const allImages = [];
        Object.values(this.testGalleryData).forEach(category => {
            allImages.push(...category.images);
        });
        return allImages;
    }

    // 清除测试布局备份
    clearTestLayoutBackups() {
        this.testLayoutData.clear();
        console.log('测试布局备份已清除 - Test layout backups cleared');
    }

    // 获取测试布局备份信息
    getTestLayoutBackupInfo() {
        const info = {};
        this.testLayoutData.forEach((backup, categoryId) => {
            info[categoryId] = {
                timestamp: backup.timestamp,
                date: new Date(backup.timestamp).toLocaleString(),
                itemCount: backup.data.size
            };
        });
        return info;
    }
}

export default new TestDataStore();