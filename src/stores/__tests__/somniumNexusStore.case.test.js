import somniumNexusStore from '../somniumNexusStore';

describe('SomniumNexusStore category resolution', () => {
    beforeEach(() => {
        somniumNexusStore.clearUserProjects();
        somniumNexusStore.clearProductionData();
        somniumNexusStore.disableTestEnvironment();
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
});
