/**
 * 电视剧 API 兼容性文件
 * 提供对象导出以避免 Server Actions 导出限制
 */

import { tvApi } from './tv';

// 重新导出电视剧API对象
export const tvApiCompat = tvApi;
