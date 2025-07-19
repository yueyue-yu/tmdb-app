/**
 * 图片相关工具函数
 */

import type { ProcessedImage, GroupedImages, ImageTab } from '@/app/type/image';
import { ImageType, IMAGE_SIZES } from '@/app/type/image';

/**
 * 获取图片URL
 * @param filePath 图片文件路径
 * @param size 图片尺寸
 * @returns 完整的图片URL
 */
export function getImageUrl(filePath: string, size: string = 'w500'): string {
  if (!filePath) return '';
  return `https://image.tmdb.org/t/p/${size}${filePath}`;
}

/**
 * 根据图片类型获取最佳尺寸
 * @param type 图片类型
 * @param usage 使用场景 ('thumbnail' | 'display' | 'fullscreen')
 * @returns 图片尺寸标识
 */
export function getBestImageSize(
  type: ImageType,
  usage: 'thumbnail' | 'display' | 'fullscreen' = 'display'
): string {
  const sizeConfig = IMAGE_SIZES[type];

  switch (usage) {
    case 'thumbnail':
      return sizeConfig.thumbnail;
    case 'fullscreen':
      return sizeConfig.large;
    default:
      return sizeConfig.medium;
  }
}

/**
 * 检查图片是否有效
 * @param image 图片数据
 * @returns 是否有效
 */
export function isValidImage(image: ProcessedImage): boolean {
  return !!(
    image &&
    image.urls &&
    image.urls.original &&
    image.width > 0 &&
    image.height > 0
  );
}

/**
 * 获取图片的显示标题
 * @param image 图片数据
 * @returns 显示标题
 */
export function getImageDisplayTitle(image: ProcessedImage): string {
  const typeLabels: Record<ImageType, string> = {
    [ImageType.BACKDROP]: '背景图',
    [ImageType.POSTER]: '海报',
    [ImageType.STILL]: '剧照',
    [ImageType.LOGO]: '标志'
  };

  const typeLabel = typeLabels[image.type] || '图片';
  const dimensions = `${image.width}×${image.height}`;
  
  return `${typeLabel} (${dimensions})`;
}

/**
 * 获取图片类型的中文标签
 * @param type 图片类型
 * @returns 中文标签
 */
export function getImageTypeLabel(type: ImageType): string {
  const labels: Record<ImageType, string> = {
    [ImageType.BACKDROP]: '背景图',
    [ImageType.POSTER]: '海报',
    [ImageType.STILL]: '剧照',
    [ImageType.LOGO]: '标志'
  };

  return labels[type] || '图片';
}

/**
 * 获取图片的纵横比类别
 * @param aspectRatio 纵横比
 * @returns 类别描述
 */
export function getAspectRatioCategory(aspectRatio: number): string {
  if (aspectRatio < 0.7) return '竖版';
  if (aspectRatio > 1.5) return '横版';
  return '方形';
}

/**
 * 计算图片的质量分数
 * @param image 图片数据
 * @returns 质量分数 (0-100)
 */
export function calculateImageQuality(image: ProcessedImage): number {
  const resolutionScore = Math.min((image.width * image.height) / (1920 * 1080), 1) * 40;
  const voteScore = Math.min(image.voteAverage / 10, 1) * 30;
  const popularityScore = Math.min(image.voteCount / 100, 1) * 30;
  
  return Math.round(resolutionScore + voteScore + popularityScore);
}

/**
 * 根据屏幕尺寸选择最佳图片尺寸
 * @param image 图片数据
 * @param containerWidth 容器宽度
 * @param devicePixelRatio 设备像素比
 * @returns 最佳图片URL
 */
export function getBestImageForContainer(
  image: ProcessedImage,
  containerWidth: number,
  devicePixelRatio: number = 1
): string {
  const targetWidth = containerWidth * devicePixelRatio;
  
  // 选择最接近目标宽度的尺寸
  if (targetWidth <= 200) return image.urls.thumbnail;
  if (targetWidth <= 500) return image.urls.medium;
  if (targetWidth <= 1000) return image.urls.large;
  return image.urls.original;
}

/**
 * 创建图片标签页数据
 * @param images 分组图片数据
 * @param translations 翻译文本
 * @returns 标签页数据数组
 */
export function createImageTabs(
  images: GroupedImages,
  translations: {
    all: string;
    backdrops: string;
    posters: string;
    stills: string;
    logos: string;
  }
): ImageTab[] {
  const allImages = [
    ...images.backdrops,
    ...images.posters,
    ...images.stills,
    ...images.logos
  ];

  const tabs: ImageTab[] = [];

  // 全部标签页
  if (allImages.length > 0) {
    tabs.push({
      key: 'all' as ImageType,
      label: translations.all,
      count: allImages.length,
      images: allImages
    });
  }

  // 背景图标签页
  if (images.backdrops.length > 0) {
    tabs.push({
      key: ImageType.BACKDROP,
      label: translations.backdrops,
      count: images.backdrops.length,
      images: images.backdrops
    });
  }

  // 海报标签页
  if (images.posters.length > 0) {
    tabs.push({
      key: ImageType.POSTER,
      label: translations.posters,
      count: images.posters.length,
      images: images.posters
    });
  }

  // 剧照标签页
  if (images.stills.length > 0) {
    tabs.push({
      key: ImageType.STILL,
      label: translations.stills,
      count: images.stills.length,
      images: images.stills
    });
  }

  // 标志标签页
  if (images.logos.length > 0) {
    tabs.push({
      key: ImageType.LOGO,
      label: translations.logos,
      count: images.logos.length,
      images: images.logos
    });
  }

  return tabs;
}

/**
 * 获取图片的下载文件名
 * @param image 图片数据
 * @param mediaTitle 媒体标题
 * @returns 文件名
 */
export function getImageDownloadFilename(
  image: ProcessedImage,
  mediaTitle: string
): string {
  const typeLabel = getImageTypeLabel(image.type);
  const sanitizedTitle = mediaTitle.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_');
  const timestamp = Date.now();
  
  return `${sanitizedTitle}_${typeLabel}_${timestamp}.jpg`;
}

/**
 * 预加载图片
 * @param urls 图片URL数组
 * @returns Promise数组
 */
export function preloadImages(urls: string[]): Promise<void>[] {
  return urls.map(url => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  });
}

/**
 * 检查图片是否支持懒加载
 * @returns 是否支持
 */
export function supportsLazyLoading(): boolean {
  return 'loading' in HTMLImageElement.prototype;
}

/**
 * 过滤和排序图片
 * @param images 图片数组
 * @param options 过滤选项
 * @returns 过滤后的图片数组
 */
export function filterAndSortImages(
  images: ProcessedImage[],
  options: {
    language?: string | null;
    minVoteCount?: number;
    sortBy?: 'vote_average' | 'vote_count' | 'width' | 'height';
    sortOrder?: 'asc' | 'desc';
  } = {}
): ProcessedImage[] {
  const {
    language,
    minVoteCount = 0,
    sortBy = 'vote_average',
    sortOrder = 'desc'
  } = options;

  let filtered = images.filter(image => image.voteCount >= minVoteCount);

  // 语言过滤
  if (language !== undefined) {
    filtered = filtered.filter(image => image.language === language);
  }

  // 排序
  filtered.sort((a, b) => {
    let aValue: number;
    let bValue: number;

    switch (sortBy) {
      case 'vote_average':
        aValue = a.voteAverage;
        bValue = b.voteAverage;
        break;
      case 'vote_count':
        aValue = a.voteCount;
        bValue = b.voteCount;
        break;
      case 'width':
        aValue = a.width;
        bValue = b.width;
        break;
      case 'height':
        aValue = a.height;
        bValue = b.height;
        break;
      default:
        return 0;
    }

    return sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
  });

  return filtered;
}

/**
 * 获取图片的EXIF方向
 * @param file 图片文件
 * @returns Promise<number> 方向值
 */
export function getImageOrientation(file: File): Promise<number> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const view = new DataView(e.target?.result as ArrayBuffer);
      if (view.getUint16(0, false) !== 0xFFD8) {
        resolve(1); // 不是JPEG文件
        return;
      }

      const length = view.byteLength;
      let offset = 2;

      while (offset < length) {
        const marker = view.getUint16(offset, false);
        offset += 2;

        if (marker === 0xFFE1) {
          const exifLength = view.getUint16(offset, false);
          offset += 2;

          if (view.getUint32(offset, false) === 0x45786966) {
            // 找到EXIF数据，解析方向信息
            // 这里简化处理，实际应用中可能需要更复杂的解析
            resolve(1);
            return;
          }
        }

        offset += view.getUint16(offset, false);
      }

      resolve(1); // 默认方向
    };
    reader.readAsArrayBuffer(file);
  });
}
