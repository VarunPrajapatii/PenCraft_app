// Utility for managing gradient backgrounds used as fallbacks for blog banners

export const gradientBackgrounds = [
  'bg-gradient-to-r from-blue-800 to-indigo-900',
  'bg-gradient-to-r from-slate-300 to-slate-500',
  'bg-gradient-to-r from-stone-500 to-stone-700',
  'bg-gradient-to-r from-slate-900 to-slate-700',
  'bg-gradient-to-r from-neutral-300 to-stone-400',
  'bg-gradient-to-r from-slate-500 to-slate-800',
  'bg-gradient-to-r from-neutral-300 to-stone-400',
  'bg-gradient-to-r from-red-500 to-orange-500',
  'bg-gradient-to-r from-rose-400 to-red-500',
  'bg-gradient-to-r from-fuchsia-600 to-pink-600'
];

/**
 * Get a random gradient background class from the available options
 * @returns A random Tailwind gradient class
 */
export const getRandomGradient = (): string => {
  return gradientBackgrounds[Math.floor(Math.random() * gradientBackgrounds.length)];
};

/**
 * Get a consistent gradient background based on a seed (like blogId)
 * This ensures the same blog always gets the same gradient
 * @param seed - A string to use as seed for consistent gradient selection
 * @returns A consistent Tailwind gradient class for the given seed
 */
export const getConsistentGradient = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  const index = Math.abs(hash) % gradientBackgrounds.length;
  return gradientBackgrounds[index];
};
