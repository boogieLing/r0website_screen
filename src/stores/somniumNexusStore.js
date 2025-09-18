import {makeAutoObservable, computed} from "mobx";

class SomniumNexusStore {
    _selectedCategory = "stillness";
    _selectedSubCategory = null;
    _selectedImage = null;
    _hoveredImage = null;
    _isModalOpen = false;
    _hasSubMenu = false;
    _subCategories = [];

    // 摄影项目数据 | Photography project data (预设测试阶段项目)
    _galleryCategories = {
        "stillness": {
            title: "Stillness",
            description: "静谧时刻的诗意捕捉，探寻日常中的禅意美学",
            hasSubMenu: true, // 标记有子菜单
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
            hasSubMenu: false, // 无子菜单
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
            hasSubMenu: true, // 标记有子菜单
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
            hasSubMenu: false, // 无子菜单
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
            hasSubMenu: true, // 标记有子菜单
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
            hasSubMenu: false, // 无子菜单
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

    constructor() {
        makeAutoObservable(this, {
            selectedCategory: computed,
            selectedSubCategory: computed,
            selectedImage: computed,
            hoveredImage: computed,
            isModalOpen: computed,
            hasSubMenu: computed,
            subCategories: computed,
            galleryCategories: computed,
            categories: computed,
            currentCategory: computed,
            currentCategoryImages: computed
        });
    }

    // 计算属性 | Computed properties
    get selectedCategory() {
        return this._selectedCategory;
    }

    get selectedImage() {
        return this._selectedImage;
    }

    get hoveredImage() {
        return this._hoveredImage;
    }

    get isModalOpen() {
        return this._isModalOpen;
    }

    get galleryCategories() {
        return this._galleryCategories;
    }

    get selectedSubCategory() {
        return this._selectedSubCategory;
    }

    get hasSubMenu() {
        return this._hasSubMenu;
    }

    get subCategories() {
        return this._subCategories;
    }

    get categories() {
        return Object.keys(this._galleryCategories);
    }

    get currentCategory() {
        return this._galleryCategories[this._selectedCategory];
    }

    get currentCategoryImages() {
        const category = this.currentCategory;
        if (!category) return [];

        // 如果有子菜单且选择了子分类，只显示匹配的子分类图片
        if (this._selectedSubCategory && category.hasSubMenu) {
            return category.images.filter(image =>
                image.subCategory === this._selectedSubCategory ||
                image.category === this._selectedSubCategory
            );
        }

        // 否则显示该分类下的所有图片
        return category.images || [];
    }

    // 操作方法 | Action methods
    setSelectedCategory = (category) => {
        if (this._galleryCategories[category]) {
            this._selectedCategory = category;
            this._selectedSubCategory = null; // 重置子菜单选择

            // 检查是否有子菜单
            const hasSubMenu = this._galleryCategories[category].hasSubMenu || false;
            this._hasSubMenu = hasSubMenu;

            // 设置子菜单数据
            if (hasSubMenu && this._galleryCategories[category].subCategories) {
                this._subCategories = [...this._galleryCategories[category].subCategories];
            } else {
                this._subCategories = [];
            }
        }
    };

    setSelectedSubCategory = (subCategoryKey) => {
        this._selectedSubCategory = subCategoryKey;
    };

    clearSelectedSubCategory = () => {
        this._selectedSubCategory = null;
    };

    setSelectedImage = (image) => {
        this._selectedImage = image;
        this._isModalOpen = !!image;
    };

    clearSelectedImage = () => {
        this._selectedImage = null;
        this._isModalOpen = false;
    };

    setHoveredImage = (imageId) => {
        this._hoveredImage = imageId;
    };

    clearHoveredImage = () => {
        this._hoveredImage = null;
    };

    // 图片操作方法 | Image manipulation methods
    getImageById = (imageId) => {
        for (const category of Object.values(this._galleryCategories)) {
            const image = category.images.find(img => img.id === imageId);
            if (image) return image;
        }
        return null;
    };

    getAllImages = () => {
        const allImages = [];
        Object.values(this._galleryCategories).forEach(category => {
            allImages.push(...category.images);
        });
        return allImages;
    };

    getImagesByCategory = (category) => {
        return this._galleryCategories[category]?.images || [];
    };

    // 统计信息 | Statistics
    getTotalImageCount = () => {
        return this.getAllImages().length;
    };

    getCategoryImageCount = (category) => {
        return this._galleryCategories[category]?.images.length || 0;
    };

    // 模态框控制 | Modal control
    openModal = (image) => {
        this.setSelectedImage(image);
    };

    closeModal = () => {
        this.clearSelectedImage();
    };

    // 导航方法 | Navigation methods
    navigateToNextImage = () => {
        if (!this._selectedImage) return;

        const currentImages = this.currentCategoryImages;
        const currentIndex = currentImages.findIndex(img => img.id === this._selectedImage.id);

        if (currentIndex !== -1 && currentIndex < currentImages.length - 1) {
            this.setSelectedImage(currentImages[currentIndex + 1]);
        }
    };

    navigateToPreviousImage = () => {
        if (!this._selectedImage) return;

        const currentImages = this.currentCategoryImages;
        const currentIndex = currentImages.findIndex(img => img.id === this._selectedImage.id);

        if (currentIndex > 0) {
            this.setSelectedImage(currentImages[currentIndex - 1]);
        }
    };
}

const somniumNexusStore = new SomniumNexusStore();
export default somniumNexusStore;