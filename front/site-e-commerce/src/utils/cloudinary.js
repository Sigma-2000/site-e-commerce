export const getOptimizedCloudinaryUrl = (url, width = 800) => {
    if (
        typeof url !== 'string' ||
        !url.includes('res.cloudinary.com') ||
        !url.includes('/image/upload/')
    ) {
        return url;
    }

    return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,c_limit,w_${width}/`);
};
