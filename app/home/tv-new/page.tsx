/**
 * 重定向到默认分类
 * /home/movies -> /home/movies/popular
 */

import { redirect } from 'next/navigation';
import { DEFAULT_CATEGORY } from '@/app/constant/movieCategories';

export default function MoviesPage() {
    redirect(`/home/movies/${DEFAULT_CATEGORY}`);
}
