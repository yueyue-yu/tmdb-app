/**
 * 评论相关的工具函数
 */

/**
 * 格式化评论内容（截断长文本）
 * @param content 评论内容
 * @param maxLength 最大长度，默认为300
 * @returns string 格式化后的内容
 */
export function formatReviewContent(content: string, maxLength: number = 300): string {
  if (!content) return '';
  
  // 移除HTML标签
  const cleanContent = content.replace(/<[^>]*>/g, '');
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  return cleanContent.substring(0, maxLength).trim() + '...';
}

/**
 * 格式化评论日期
 * @param dateString 日期字符串
 * @param locale 语言环境，默认为'en-US'
 * @returns string 格式化后的日期
 */
export function formatReviewDate(dateString: string, locale: string = 'en-US'): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('日期格式化失败:', error);
    return dateString;
  }
}

/**
 * 获取评论作者头像URL
 * @param avatarPath 头像路径
 * @returns string 完整的头像URL
 */
export function getReviewAuthorAvatar(avatarPath: string | null): string {
  if (!avatarPath) {
    return '/images/default-avatar.svg';
  }

  // 如果是完整URL（Gravatar等），直接返回
  if (avatarPath.startsWith('http')) {
    return avatarPath;
  }

  // 如果是TMDB路径，添加基础URL（使用标准尺寸w185）
  if (avatarPath.startsWith('/')) {
    return `https://image.tmdb.org/t/p/w185${avatarPath}`;
  }

  return '/images/default-avatar.svg';
}
