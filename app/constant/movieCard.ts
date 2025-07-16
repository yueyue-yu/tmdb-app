/**
 * 电影卡片相关常量
 */

// 图片尺寸常量
export const IMAGE_SIZES = {
  CARD_POSTER: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  BACKDROP: "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
} as const;

// 受欢迎程度阈值
export const POPULARITY_THRESHOLDS = {
  HOT: 100,
  TRENDING: 50
} as const;

// 评分阈值
export const RATING_THRESHOLDS = {
  EXCELLENT: 8,
  GOOD: 7,
  AVERAGE: 6
} as const;

// 动画持续时间
export const ANIMATION_DURATIONS = {
  HOVER: 'duration-300',
  CARD_LIFT: 'duration-500',
  IMAGE_LOAD: 'duration-700',
  BUTTON: 'duration-200'
} as const;

// 默认文本
export const DEFAULT_TEXTS = {
  NO_OVERVIEW: '这部电影暂时还没有详细的介绍信息...',
  LOADING: '加载中...',
  ERROR: '加载失败'
} as const;

// 受欢迎程度标签
export const POPULARITY_LABELS = {
  hot: 'HOT',
  trending: 'TRENDING',
  normal: ''
} as const;
