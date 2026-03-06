const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: prefersReducedMotion ? 0 : 0.04 },
    },
};

export const staggerItem = prefersReducedMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.01 } } }
    : { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as const } } };
