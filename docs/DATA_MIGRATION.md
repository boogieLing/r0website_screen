# Somnium/Nexus 数据迁移指南

## 📋 概述

本项目已完成从Mock阶段到正式环境的过渡，建立了完整的测试/正式环境数据管理体系。

## 🏗️ 新架构概览

### Store结构

```
src/stores/
├── testDataStore.js          # 测试数据专用store
├── somniumNexusStore.js      # 正式环境数据store（重构）
├── galleryStore.js           # 布局管理store（保持不变）
├── StoreManager.js           # Store统一管理器
└── index.js                  # Store统一导出
```

### 工具类

```
src/utils/
├── environment.js            # 环境管理工具
└── dataMigration.js          # 数据迁移工具
```

## 🔄 环境切换

### 自动初始化
系统启动时会自动从localStorage加载环境配置，默认使用正式环境。

### 手动切换
```javascript
import { environmentManager } from '@/utils/environment';

// 切换到测试环境
environmentManager.switchToTestEnvironment();

// 切换到正式环境
environmentManager.switchToProductionEnvironment();

// 获取当前环境信息
const envInfo = environmentManager.getEnvironmentInfo();
```

### 快捷操作
- `Ctrl+Shift+T`: 切换到测试环境
- `Ctrl+Shift+P`: 切换到正式环境
- `Ctrl+Shift+I`: 显示环境信息

### 环境指示器
```javascript
import { EnvironmentToggle } from '@/utils/environment';

// 在组件中使用
<EnvironmentToggle className="custom-class" />
```

## 📊 数据管理

### 测试数据 (testDataStore)
- **作用**: 包含所有Mock阶段的测试图片数据
- **数据**: 6个分类，36张测试图片
- **功能**: 支持布局数据备份和恢复

### 正式数据 (somniumNexusStore)
- **作用**: 管理正式环境的图片数据
- **初始状态**: 空，需要从外部加载数据
- **功能**: 支持动态数据加载和分类管理

### 布局数据 (galleryStore)
- **作用**: 管理图片的位置、大小等布局信息
- **兼容性**: 同时支持测试和正式环境
- **功能**: 拖拽、调整大小、磁吸等交互功能

## 🚀 数据迁移

### 快速迁移
```javascript
import { quickMigrateToProduction } from '@/utils/dataMigration';

// 执行一键迁移
const result = await quickMigrateToProduction({
    includeLayoutData: true,    // 包含布局数据
    backupTestData: true,       // 备份测试数据
    clearAfterMigration: false  // 迁移后保留测试数据
});

if (result.success) {
    console.log('迁移成功:', result.migrationId);
} else {
    console.error('迁移失败:', result.error);
}
```

### 渐进式迁移
```javascript
import { dataMigrationManager } from '@/utils/dataMigration';

// 1. 创建正式数据结构
const productionData = dataMigrationManager.createProductionDataFromTest();

// 2. 设置正式数据
somniumNexusStore.setProductionData(productionData);

// 3. 迁移布局数据
Object.keys(productionData).forEach(categoryId => {
    const layoutData = dataMigrationManager.migrateLayoutData(categoryId);
    if (layoutData) {
        // 应用到galleryStore
        Object.entries(layoutData).forEach(([itemId, item]) => {
            galleryStore.updateItem(itemId, item);
        });
    }
});

// 4. 切换到正式环境
somniumNexusStore.disableTestEnvironment();
```

### 迁移UI工具
```javascript
import { MigrationTool } from '@/utils/dataMigration';

// 在组件中使用
<MigrationTool
    onComplete={(result) => console.log('迁移完成', result)}
    onError={(error) => console.error('迁移失败', error)}
/>
```

## 📈 Store管理

### 状态监控
```javascript
import storeManager from '@/stores/StoreManager';

// 获取系统状态报告
const report = storeManager.getSystemReport();

// 获取store状态
const status = storeManager.getStoreStatus();

// 监听状态变化
storeManager.addStatusListener((status) => {
    console.log('Store状态更新:', status);
});
```

### 数据备份/恢复
```javascript
// 导出store数据
const backup = storeManager.exportStoreData('gallery');

// 导入store数据
const success = storeManager.importStoreData(backupData);
```

### 重置操作
```javascript
// 重置指定store
storeManager.resetStore('gallery');

// 重置所有store
storeManager.resetAllStores();
```

## 🔍 调试和监控

### 环境信息
```javascript
// 获取环境信息
const envInfo = somniumNexusStore.getEnvironmentInfo();
console.log('环境信息:', envInfo);

// 输出示例:
// {
//   isTestEnvironment: false,
//   isProductionEnvironment: true,
//   testDataEnabled: false,
//   categoryCount: 0,
//   totalImageCount: 0
// }
```

### Store调试
```javascript
// 获取调试信息
const debugInfo = storeManager.getDebugInfo();
console.log('调试信息:', debugInfo);

// 获取系统报告
const systemReport = storeManager.getSystemReport();
console.log('系统报告:', systemReport);
```

## ⚠️ 重要注意事项

### 1. 环境隔离
- 测试环境和正式环境的数据完全隔离
- 切换环境不会影响已有的布局数据
- 测试数据默认不会加载到正式环境

### 2. 数据备份
- 迁移前会自动备份测试数据
- 布局数据可以在测试环境中多次备份/恢复
- 建议定期导出重要数据

### 3. 渐进式迁移
- 支持逐步迁移，不需要一次性完成
- 可以先迁移数据结构，再迁移布局
- 迁移过程可逆，有问题可以回退

### 4. 验证机制
- 迁移后自动验证数据完整性
- 提供详细的迁移报告
- 包含错误和警告信息

## 🎯 最佳实践

### 开发阶段
1. 使用测试环境进行开发
2. 定期备份布局数据
3. 测试新功能时确保环境正确

### 测试阶段
1. 验证正式环境数据结构
2. 测试数据迁移流程
3. 确认所有功能正常

### 部署阶段
1. 执行完整数据迁移
2. 验证迁移后的数据
3. 切换到正式环境
4. 监控运行状态

## 🔧 故障排除

### 常见问题

**Q: 切换环境后数据不见了？**
A: 检查是否已正确迁移数据，测试和正式环境数据是隔离的。

**Q: 迁移失败怎么办？**
A: 查看迁移报告，检查数据验证错误，可以恢复测试数据重新迁移。

**Q: 如何恢复测试数据？**
A: 使用 `dataMigrationManager.restoreTestData()` 或重新启用测试环境。

**Q: 布局数据丢失？**
A: 检查galleryStore中的数据，可以从测试环境的备份中恢复。

## 📚 相关文档

- [GalleryStore API](./GALLERY_STORE_API.md)
- [SomniumNexusStore API](./SOMNIUM_NEXUS_STORE_API.md)
- [环境管理指南](./ENVIRONMENT_GUIDE.md)

## 🤝 支持

如有问题，请查看调试信息或联系开发团队。建议在开发环境下充分测试迁移流程后再进行正式部署。

---

**版本**: 1.0.0
**最后更新**: 2024年
**维护团队**: Somnium/Nexus项目组