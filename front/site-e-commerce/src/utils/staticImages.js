export const getStaticImage = (src, width = 640) => {
    if (!src) return '';

    const normalized = src.startsWith('/') ? src : `/${src}`;

    return normalized.replace(/\.(jpg|jpeg|png)$/i, `-${width}.webp`);
};

export const getStaticImageSrcset = (src) => {
    return [`${getStaticImage(src, 320)} 320w`, `${getStaticImage(src, 640)} 640w`].join(', ');
};
