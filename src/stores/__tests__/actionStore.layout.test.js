const mockState = {selected: 'A/B'};
const mockGetRemoteId = jest.fn();
const mockSetCategoryLayoutMode = jest.fn();
const mockResolveCategoryKey = jest.fn((key) => key);
const mockUpdateCategoryLayoutMode = jest.fn().mockResolvedValue({});

jest.mock('@/utils/environment', () => ({
    environmentManager: {
        isTestEnvironment: jest.fn(() => false),
        getCurrentLayoutType: jest.fn(() => 'freeform')
    },
    LAYOUT_TYPES: {
        FLEX: 'flex',
        FREEFORM: 'freeform'
    }
}));

jest.mock('../flexGalleryStore', () => ({
    toggleEditMode: jest.fn(),
    editMode: false
}));

jest.mock('../galleryStore', () => ({
    toggleEditMode: jest.fn(),
    editMode: false
}));

jest.mock('../testDataStore', () => ({
    enableTestEnvironment: jest.fn(),
    disableTestEnvironment: jest.fn()
}));

jest.mock('@/utils/dataMigration', () => ({
    dataMigrationManager: {}
}));

jest.mock('@/stores/somniumNexusStore', () => ({
    __esModule: true,
    default: {
        get selectedCategory() {
            return mockState.selected;
        },
        getRemoteId: (...args) => mockGetRemoteId(...args),
        setCategoryLayoutMode: (...args) => mockSetCategoryLayoutMode(...args),
        resolveCategoryKey: (...args) => mockResolveCategoryKey(...args),
        isUsingTestData: false
    }
}));

jest.mock('@/request/categoryApi', () => ({
    createCategory: jest.fn(),
    updateCategoryLayoutMode: (...args) => mockUpdateCategoryLayoutMode(...args)
}));

jest.mock('@/request/imageApi', () => ({
    updateImagePosition: jest.fn(),
    uploadImage: jest.fn()
}));

import actionStore from '../actionStore';

describe('ActionStore 布局接口参数', () => {
    beforeEach(() => {
        mockState.selected = 'A/B';
        mockGetRemoteId.mockReset().mockReturnValue('remote-ab');
        mockSetCategoryLayoutMode.mockReset();
        mockResolveCategoryKey.mockReset().mockImplementation((key) => key);
        mockUpdateCategoryLayoutMode.mockReset().mockResolvedValue({});
        global.alert = jest.fn();
    });

    test('调用布局接口时使用远端ID并更新折叠父级', async () => {
        mockResolveCategoryKey.mockReturnValue('A');

        await actionStore.updateCurrentCategoryLayoutMode('flex');

        expect(mockUpdateCategoryLayoutMode).toHaveBeenCalledWith('remote-ab', 'flex');
        expect(mockSetCategoryLayoutMode).toHaveBeenCalledWith('A', 'flex');
    });
});
