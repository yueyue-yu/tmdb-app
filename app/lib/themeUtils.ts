export interface Theme {
    name: string;
    labelKey: string; // 翻译键
    emoji: string;
}

export const THEMES: Theme[] = [
    { name: 'light', labelKey: 'light', emoji: '☀️' },
    { name: 'dark', labelKey: 'dark', emoji: '🌙' },
    { name: 'cupcake', labelKey: 'cupcake', emoji: '🧁' },
    { name: 'bumblebee', labelKey: 'bumblebee', emoji: '🐝' },
    { name: 'emerald', labelKey: 'emerald', emoji: '💚' },
    { name: 'corporate', labelKey: 'corporate', emoji: '🏢' },
    { name: 'synthwave', labelKey: 'synthwave', emoji: '🌆' },
    { name: 'retro', labelKey: 'retro', emoji: '📻' },
    { name: 'cyberpunk', labelKey: 'cyberpunk', emoji: '🤖' },
    { name: 'valentine', labelKey: 'valentine', emoji: '💖' },
    { name: 'halloween', labelKey: 'halloween', emoji: '🎃' },
    { name: 'garden', labelKey: 'garden', emoji: '🌻' },
    { name: 'forest', labelKey: 'forest', emoji: '🌲' },
    { name: 'aqua', labelKey: 'aqua', emoji: '🌊' },
    { name: 'lofi', labelKey: 'lofi', emoji: '🎵' },
    { name: 'pastel', labelKey: 'pastel', emoji: '🎨' },
    { name: 'fantasy', labelKey: 'fantasy', emoji: '🦄' },
    { name: 'wireframe', labelKey: 'wireframe', emoji: '📐' },
    { name: 'black', labelKey: 'black', emoji: '⚫' },
    { name: 'luxury', labelKey: 'luxury', emoji: '💎' },
    { name: 'dracula', labelKey: 'dracula', emoji: '🧛' },
    { name: 'cmyk', labelKey: 'cmyk', emoji: '🖨️' },
    { name: 'autumn', labelKey: 'autumn', emoji: '🍂' },
    { name: 'business', labelKey: 'business', emoji: '💼' },
    { name: 'acid', labelKey: 'acid', emoji: '🧪' },
    { name: 'lemonade', labelKey: 'lemonade', emoji: '🍋' },
    { name: 'night', labelKey: 'night', emoji: '🌃' },
    { name: 'coffee', labelKey: 'coffee', emoji: '☕' },
    { name: 'winter', labelKey: 'winter', emoji: '❄️' },
    { name: 'dim', labelKey: 'dim', emoji: '🔅' },
    { name: 'nord', labelKey: 'nord', emoji: '🏔️' },
    { name: 'sunset', labelKey: 'sunset', emoji: '🌅' },
];

export const DEFAULT_THEME = 'dark';
