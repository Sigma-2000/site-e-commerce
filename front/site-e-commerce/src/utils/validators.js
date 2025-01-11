export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? null : 'errors.invalid-email';
};

export const validatePassword = (password) => {
    return password.length >= 8 ? null : 'errors.password';
};

export const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone) ? null : 'errors.invalid-phone';
};
