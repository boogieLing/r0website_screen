import somniumNexusStore from '../somniumNexusStore';
import {getCategoryImages} from '@/request/categoryApi';

jest.mock('@/request/categoryApi', () => ({
    listCategories: jest.fn(),
    getCategoryImages: jest.fn()
}));

jest.mock('@/request/imageApi', () => ({
    addImageToCache: jest.fn(),
    deleteImage: jest.fn(),
    getRandomCachedImage: jest.fn()
}));

describe('SomniumNexusStore category resolution', () => {
    beforeEach(() => {
        somniumNexusStore.clearUserProjects();
        somniumNexusStore.clearProductionData();
        somniumNexusStore.disableTestEnvironment();
        jest.clearAllMocks();
    });

    test('折叠斜杠分类并且大小写不再产生重复项', () => {
        somniumNexusStore.setProductionData({
            Nexus: {
                title: 'Nexus',
                remoteId: 'nexus-id',
                aliasCategoryIds: [],
                images: [{id: 1, title: 'welcome', category: 'Nexus'}]
            },
            A: {
                title: 'A'
            },
            'A/B': {
                title: 'A/B'
            }
        });

        expect(somniumNexusStore.categories).toEqual(expect.arrayContaining(['Nexus', 'A']));
        expect(somniumNexusStore.categories.length).toBe(2);
        expect(somniumNexusStore.resolveCategoryKey('nexus')).toBe('Nexus');
        expect(somniumNexusStore.getRemoteId('nexus')).toBe('nexus-id');
        // 欢迎页使用的 nexus 也能取到图片
        expect(somniumNexusStore.getImagesByCategory('nexus').length).toBe(1);
    });

    test('斜杠分类在折叠后依然可以作为单独选项加入分类', () => {
        somniumNexusStore.setProductionData({
            A: {
                title: 'A',
                remoteId: 'remote-a',
                aliasCategoryIds: ['remote-a'],
                images: []
            },
            'A/B': {
                title: 'A/B',
                remoteId: 'remote-ab',
                aliasCategoryIds: ['remote-ab'],
                images: []
            }
        });

        const options = somniumNexusStore.getCategoryAssignOptions();
        const optionKeys = options.map((item) => item.key);
        expect(optionKeys).toEqual(expect.arrayContaining(['A', 'A/B']));

        // 斜杠分类应解析到父级键，但能返回自己的远端ID以便单独入库
        expect(somniumNexusStore.resolveCategoryKey('A/B')).toBe('A');
        expect(somniumNexusStore.getRemoteId('A/B')).toBe('remote-ab');
    });

    test('折叠斜杠分类时优先保留父级布局设置', () => {
        somniumNexusStore.setProductionData({
            A: {
                title: 'A',
                remoteId: 'remote-a',
                aliasCategoryIds: ['remote-a'],
                images: [],
                settings: {layoutMode: 'flex'}
            },
            'A/B': {
                title: 'A/B',
                remoteId: 'remote-ab',
                aliasCategoryIds: ['remote-ab'],
                images: [],
                settings: {layoutMode: 'freedom'}
            }
        });

        const parent = somniumNexusStore.galleryCategories['A'];
        expect(parent.settings.layoutMode).toBe('flex');

        somniumNexusStore.setSelectedCategory('A');
        expect(somniumNexusStore.getCategoryLayoutMode(somniumNexusStore.currentCategory)).toBe('flex');

        somniumNexusStore.setSelectedSubCategory('B');
        expect(somniumNexusStore.getActiveLayoutMode(somniumNexusStore.currentCategory)).toBe('freedom');
    });

    test('屏蔽远端ID在隐藏名单中的分类', () => {
        somniumNexusStore.setProductionData({
            Visible: {
                title: 'Visible',
                remoteId: 'visible-id',
                aliasCategoryIds: ['visible-id'],
                images: []
            },
            'Local Cache': {
                title: 'Local Cache',
                remoteId: 'alum_local_cache',
                aliasCategoryIds: ['alum_local_cache'],
                images: []
            }
        });

        const galleryKeys = Object.keys(somniumNexusStore.galleryCategories);
        expect(galleryKeys).toContain('Visible');
        expect(galleryKeys).not.toContain('Local Cache');
        expect(galleryKeys.length).toBe(1);

        const categories = somniumNexusStore.categories;
        expect(categories).toContain('Visible');
        expect(categories).not.toContain('Local Cache');

        const assignKeys = somniumNexusStore.getCategoryAssignOptions().map((item) => item.key);
        expect(assignKeys).toContain('Visible');
        expect(assignKeys).not.toContain('Local Cache');
        expect(assignKeys.length).toBe(1);
    });

    test('分页根据 total（字符串数字）正确停止', async () => {
        getCategoryImages
            .mockResolvedValueOnce({
                data: {
                    images: [
                        {ID: 'img-1', CosURL: 'url1'},
                        {ID: 'img-2', CosURL: 'url2'}
                    ],
                    total: '3'
                }
            })
            .mockResolvedValueOnce({
                data: {
                    images: [
                        {ID: 'img-3', CosURL: 'url3'}
                    ],
                    total: '3'
                }
            });

        somniumNexusStore.setProductionData({
            Mock: {
                title: 'Mock',
                remoteId: 'mock-id',
                aliasCategoryIds: ['mock-id'],
                images: [],
                settings: {layoutMode: 'flex'}
            }
        });

        const first = await somniumNexusStore.loadCategoryPage('Mock', 1, {pageSize: 2});
        expect(first).toBe(true);
        expect(getCategoryImages).toHaveBeenCalledTimes(1);
        let pageState = somniumNexusStore.getCategoryPageState('Mock');
        expect(pageState.total).toBe(3);
        expect(pageState.hasMore).toBe(true);
        expect(pageState.page).toBe(1);

        const second = await somniumNexusStore.loadNextCategoryPage('Mock');
        expect(second).toBe(true);
        expect(getCategoryImages).toHaveBeenCalledTimes(2);
        pageState = somniumNexusStore.getCategoryPageState('Mock');
        expect(pageState.total).toBe(3);
        expect(pageState.hasMore).toBe(false);
        expect(pageState.page).toBe(2);

        const third = await somniumNexusStore.loadNextCategoryPage('Mock');
        expect(third).toBe(false);
        expect(getCategoryImages).toHaveBeenCalledTimes(2);
    });

    test('分页去重导致数量低于 total 时也能停止', async () => {
        getCategoryImages
            .mockResolvedValueOnce({
                data: {
                    images: [
                        {ID: 'img-1', CosURL: 'url1'},
                        {ID: 'img-2', CosURL: 'url2'}
                    ],
                    total: 3
                }
            })
            .mockResolvedValueOnce({
                data: {
                    // 第二页返回重复图片
                    images: [
                        {ID: 'img-2', CosURL: 'url2'}
                    ],
                    total: 3
                }
            });

        somniumNexusStore.setProductionData({
            MockDup: {
                title: 'MockDup',
                remoteId: 'mock-dup',
                aliasCategoryIds: ['mock-dup'],
                images: [],
                settings: {layoutMode: 'flex'}
            }
        });

        await somniumNexusStore.loadCategoryPage('MockDup', 1, {pageSize: 2});
        await somniumNexusStore.loadNextCategoryPage('MockDup');

        const pageState = somniumNexusStore.getCategoryPageState('MockDup');
        expect(pageState.total).toBe(3);
        expect(pageState.hasMore).toBe(false);

        const blocked = await somniumNexusStore.loadNextCategoryPage('MockDup');
        expect(blocked).toBe(false);
        expect(getCategoryImages).toHaveBeenCalledTimes(2);
    });
});
