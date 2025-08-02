export interface Theme {
    name: string;
    labelKey: string; // 翻译键
    emoji: string;
}

export const THEMES: Theme[] = [
    { name: 'light', labelKey: 'light', emoji: '☀️' },
    { name: 'dark', labelKey: 'dark', emoji: '🌙' },
    { name: 'retro', labelKey: 'retro', emoji: '📻' },
    { name: 'cyberpunk', labelKey: 'cyberpunk', emoji: '🤖' },
    { name: 'valentine', labelKey: 'valentine', emoji: '💖' },
    { name: 'aqua', labelKey: 'aqua', emoji: '🌊' },
    { name: 'luxury', labelKey: 'luxury', emoji: '💎' },
    { name: 'autumn', labelKey: 'autumn', emoji: '🍂' },
    { name: 'business', labelKey: 'business', emoji: '💼' },
    { name: 'night', labelKey: 'night', emoji: '🌃' },
    { name: 'winter', labelKey: 'winter', emoji: '❄️' },
    { name: 'nord', labelKey: 'nord', emoji: '🏔️' },
];

export const DEFAULT_THEME = 'aqua';
