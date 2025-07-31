/**
 * 图片相关类型定义
 */

/**
 * TMDB图片数据结构
 */
export interface TmdbImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

/**
 * 图片响应数据结构
 */
export interface ImageResponse {
  id: number;
  backdrops: TmdbImage[];
  logos: TmdbImage[];
  posters: TmdbImage[];
  stills?: TmdbImage[]; // 仅电视剧有剧照
}

/**
 * 图片类型枚举
 */
export enum ImageType {
  BACKDROP = 'backdrop',
  POSTER = 'poster',
  STILL = 'still',
  LOGO = 'logo'
}

/**
 * 图片尺寸配置
 */
export interface ImageSizeConfig {
  thumbnail: string;
  medium: string;
  large: string;
  original: string;
}

/**
 * 不同图片类型的尺寸配置
 */
export const IMAGE_SIZES: Record<ImageType, ImageSizeConfig> = {
  [ImageType.BACKDROP]: {
    thumbnail: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original'
  },
  [ImageType.POSTER]: {
    thumbnail: 'w154',
    medium: 'w342',
    large: 'w500',
    original: 'original'
  },
  [ImageType.STILL]: {
    thumbnail: 'w185',
    medium: 'w300',
    large: 'w500',
    original: 'original'
  },
  [ImageType.LOGO]: {
    thumbnail: 'w45',
    medium: 'w92',
    large: 'w185',
    original: 'original'
  }
};

/**
 * 处理后的图片数据
 */
export interface ProcessedImage {
  id: string;
  type: ImageType;
  aspectRatio: number;
  width: number;
  height: number;
  language: string | null;
  voteAverage: number;
  voteCount: number;
  urls: {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };
}

/**
 * 分组后的图片数据
 */
export interface GroupedImages {
  backdrops: ProcessedImage[];
  posters: ProcessedImage[];
  stills: ProcessedImage[];
  logos: ProcessedImage[];
}

/**
 * 图片画廊组件Props
 */
export interface ImageGalleryProps {
  images: GroupedImages;
  mediaTitle: string;
  initialType?: ImageType;
  className?: string;
}

/**
 * 图片模态框组件Props
 */
export interface ImageModalProps {
  images: ProcessedImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  title?: string;
}

/**
 * 图片区域组件Props
 */
export interface ImageSectionProps {
  mediaId: number;
  mediaType: 'movie' | 'tv';
  mediaTitle: string;
}

/**
 * 图片卡片组件Props
 */
export interface ImageCardProps {
  image: ProcessedImage;
  onClick?: (image: ProcessedImage) => void;
  className?: string;
  showInfo?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (imageId: string, selected: boolean) => void;
}

/**
 * 图片标签页数据
 */
export interface ImageTab {
  key: ImageType;
  label: string;
  count: number;
  images: ProcessedImage[];
}
