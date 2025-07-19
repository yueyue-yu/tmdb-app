import Link from 'next/link';
import { PlayIcon } from '@heroicons/react/24/outline';
import type { PlayButtonProps } from '@/app/type/movieCard';
import { MediaTypeEnum } from '@/app/type/movie';

/**
 * 播放按钮组件（服务端组件）
 */
export default function PlayButton({ movieId, mediaType = MediaTypeEnum.Movie }: PlayButtonProps) {
  // 根据媒体类型生成正确的详情页面链接
  const detailPath = mediaType === MediaTypeEnum.TV
    ? `/detail/tv/${movieId}`
    : `/detail/movie/${movieId}`;
  return (
    <Link
      href={detailPath}
      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
    >
      <button className="btn btn-circle btn-lg btn-primary bg-primary/20 backdrop-blur-md border-primary/30 hover:bg-primary/30">
        <PlayIcon className="w-8 h-8 text-white ml-1" />
      </button>
    </Link>
  );
}
