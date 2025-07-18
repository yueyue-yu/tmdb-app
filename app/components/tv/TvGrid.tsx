import type { TvShow } from '@/app/lib/api';
import MediaGrid from '@/app/components/shared/MediaGrid';

interface TvGridProps {
  tvShows: TvShow[];
}

export default function TvGrid({ tvShows }: TvGridProps) {
  return <MediaGrid items={tvShows} type="tv" />;
}
