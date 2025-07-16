#!/usr/bin/env node

/**
 * 电影卡片组件迁移脚本
 * 自动将现有项目中的 MovieCardServer 导入更新为新的重构组件
 */

const fs = require('fs');
const path = require('path');

// 需要更新的文件列表
const filesToUpdate = [
  'app/components/movies.tsx',
  // 添加其他需要更新的文件
];

// 更新导入语句
function updateImports(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  文件不存在: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  
  // 更新 MovieCardServer 导入
  const oldImport = "import MovieCardServer from './MovieCardServer';";
  const newImport = "import { MovieCardServer } from './movie';";
  
  if (content.includes(oldImport)) {
    content = content.replace(oldImport, newImport);
    fs.writeFileSync(fullPath, content);
    console.log(`✅ 已更新: ${filePath}`);
  } else {
    console.log(`ℹ️  无需更新: ${filePath}`);
  }
}

// 主函数
function main() {
  console.log('🚀 开始迁移电影卡片组件...\n');
  
  filesToUpdate.forEach(updateImports);
  
  console.log('\n✨ 迁移完成！');
  console.log('\n📝 迁移说明:');
  console.log('1. 原有组件已保留，标记为 deprecated');
  console.log('2. 新组件位于 app/components/movie/ 目录');
  console.log('3. 建议逐步迁移到新的导入方式');
}

if (require.main === module) {
  main();
}

module.exports = { updateImports };
