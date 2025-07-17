export interface Theme {
    name: string;
    label: string;
    emoji: string;
}

export const THEMES: Theme[] = [
    { name: 'light', label: '浅色', emoji: '☀️' },
    { name: 'dark', label: '深色', emoji: '🌙' },
    { name: 'cupcake', label: '纸杯蛋糕', emoji: '🧁' },
    { name: 'bumblebee', label: '大黄蜂', emoji: '🐝' },
    { name: 'emerald', label: '翡翠', emoji: '💚' },
    { name: 'corporate', label: '商务', emoji: '🏢' },
    { name: 'synthwave', label: '合成波', emoji: '🌆' },
    { name: 'retro', label: '复古', emoji: '📻' },
    { name: 'cyberpunk', label: '赛博朋克', emoji: '🤖' },
    { name: 'valentine', label: '情人节', emoji: '💖' },
    { name: 'halloween', label: '万圣节', emoji: '🎃' },
    { name: 'garden', label: '花园', emoji: '🌻' },
    { name: 'forest', label: '森林', emoji: '🌲' },
    { name: 'aqua', label: '海洋', emoji: '🌊' },
    { name: 'lofi', label: 'Lo-fi', emoji: '🎵' },
    { name: 'pastel', label: '粉彩', emoji: '🎨' },
    { name: 'fantasy', label: '幻想', emoji: '🦄' },
    { name: 'wireframe', label: '线框', emoji: '📐' },
    { name: 'black', label: '纯黑', emoji: '⚫' },
    { name: 'luxury', label: '奢华', emoji: '💎' },
    { name: 'dracula', label: '德古拉', emoji: '🧛' },
    { name: 'cmyk', label: 'CMYK', emoji: '🖨️' },
    { name: 'autumn', label: '秋季', emoji: '🍂' },
    { name: 'business', label: '商业', emoji: '💼' },
    { name: 'acid', label: '酸性', emoji: '🧪' },
    { name: 'lemonade', label: '柠檬水', emoji: '🍋' },
    { name: 'night', label: '夜晚', emoji: '🌃' },
    { name: 'coffee', label: '咖啡', emoji: '☕' },
    { name: 'winter', label: '冬季', emoji: '❄️' },
    { name: 'dim', label: '昏暗', emoji: '🔅' },
    { name: 'nord', label: 'Nord', emoji: '🏔️' },
    { name: 'sunset', label: '日落', emoji: '🌅' },
];

export const DEFAULT_THEME = 'dark';
