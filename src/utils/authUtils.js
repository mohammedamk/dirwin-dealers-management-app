export const authUtils = {
    setToken: (token) => {
        localStorage.setItem('dirwin-dealer-token', token);
        localStorage.setItem('dirwin-dealer-token-tokenTimestamp', Date.now().toString());
    },

    getToken: () => {
        return localStorage.getItem('dirwin-dealer-token');
    },

    removeToken: () => {
        localStorage.removeItem('dirwin-dealer-token');
        localStorage.removeItem('dirwin-dealer-token-tokenTimestamp');
        window.location.reload()
    },

    isValid: () => {
        const token = authUtils.getToken();
        if (!token) return false;

        const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/;
        return jwtPattern.test(token);
    },
};

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password);

    return {
        isValid: hasMinLength && hasLowercase && hasUppercase && hasNumber && hasSpecialChar,
        errors: {
            minLength: !hasMinLength ? 'Password must be at least 8 characters' : null,
            lowercase: !hasLowercase ? 'Password must contain at least one lowercase letter' : null,
            uppercase: !hasUppercase ? 'Password must contain at least one uppercase letter' : null,
            number: !hasNumber ? 'Password must contain at least one number' : null,
            specialChar: !hasSpecialChar ? 'Password must contain at least one special character' : null
        }
    };
};

export const validateField = (name, value, formData) => {
    let error = '';

    switch (name) {
        case 'shopName':
            if (!value.trim()) error = 'Shop name is required';
            break;
        case 'email':
            if (!value.trim()) error = 'Email is required';
            else if (!validateEmail(value)) error = 'Invalid email address';
            break;
        case 'phone':
            if (!value.trim()) error = 'Phone number is required';
            else if (value.length < 10) error = 'Phone number must be at least 10 digits';
            break;
        case 'firstName':
            if (!value.trim()) error = 'First name is required';
            break;
        case 'lastName':
            if (!value.trim()) error = 'Last name is required';
            break;
        case 'primaryContactEmail':
            if (value && !validateEmail(value)) error = 'Invalid email address';
            break;
        case 'password':
            const passwordValidation = validatePassword(value);
            if (!value.trim()) error = 'Password is required';
            else if (!passwordValidation.isValid) {
                const firstError = Object.values(passwordValidation.errors).find(err => err !== null);
                error = firstError || '';
            }
            break;
        case 'confirmPassword':
            if (!value.trim()) error = 'Please confirm your password';
            else if (value !== formData.password) error = "Passwords don't match";
            break;
        case 'billingAddress.street':
            if (!value.trim()) error = 'Street address is required';
            break;
        case 'billingAddress.city':
            if (!value.trim()) error = 'City is required';
            break;
        case 'billingAddress.state':
            if (!value.trim()) error = 'State is required';
            break;
        case 'billingAddress.zipCode':
            if (!value.trim()) error = 'Zip code is required';
            else if (value.length < 5) error = 'Zip code must be at least 5 digits';
            break;
        case 'preferredPaymentMethod':
            if (!value.trim()) error = 'Preferred payment method is required';
            break;
        case 'paymentMethodId':
            if (!value.trim()) error = `${formData.preferredPaymentMethod === "paypal" ? "PayPal" : "Zelle"} ID is required`;
            break;
        case 'billingAddress.country':
            if (!value.trim()) error = 'Country is required';
            break;
        case 'shippingAddress.street':
            if (!formData.useSameAddress && !value.trim()) error = 'Street address is required';
            break;
        case 'shippingAddress.city':
            if (!formData.useSameAddress && !value.trim()) error = 'City is required';
            break;
        case 'shippingAddress.state':
            if (!formData.useSameAddress && !value.trim()) error = 'State is required';
            break;
        case 'shippingAddress.zipCode':
            if (!formData.useSameAddress && !value.trim()) error = 'Zip code is required';
            else if (!formData.useSameAddress && value.length < 5) error = 'Zip code must be at least 5 digits';
            break;
        case 'shippingAddress.country':
            if (!formData.useSameAddress && !value.trim()) error = 'Country is required';
            break;
        case 'termsAccepted':
            if (!value) error = 'You must accept the terms and conditions';
            break;
        default:
            break;
    }

    return error;
};

export const validateStep = ({
    step,
    formData,
    setErrors
}) => {
    const newErrors = {};

    switch (step) {
        case 0:
            const shopNameError = validateField('shopName', formData.shopName);
            if (shopNameError) newErrors.shopName = shopNameError;
            break;
        case 1:
            const emailError = validateField('email', formData.email);
            if (emailError) newErrors.email = emailError;

            const passwordError = validateField('password', formData.password);
            if (passwordError) newErrors.password = passwordError;

            const confirmPasswordError = validateField('confirmPassword', formData.confirmPassword, formData);
            if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
            break;
        case 2:
            const phoneError = validateField('phone', formData.phone);
            if (phoneError) newErrors.phone = phoneError;

            const firstNameError = validateField('firstName', formData.firstName);
            if (firstNameError) newErrors.firstName = firstNameError;

            const lastNameError = validateField('lastName', formData.lastName);
            if (lastNameError) newErrors.lastName = lastNameError;

            const primaryContactEmailError = validateField('primaryContactEmail', formData.primaryContactEmail);
            if (primaryContactEmailError) newErrors.primaryContactEmail = primaryContactEmailError;
            break;
        case 3:
            const billingStreetError = validateField('billingAddress.street', formData.billingAddress.street);
            if (billingStreetError) newErrors['billingAddress.street'] = billingStreetError;

            const billingCityError = validateField('billingAddress.city', formData.billingAddress.city);
            if (billingCityError) newErrors['billingAddress.city'] = billingCityError;

            const billingStateError = validateField('billingAddress.state', formData.billingAddress.state);
            if (billingStateError) newErrors['billingAddress.state'] = billingStateError;

            const billingZipError = validateField('billingAddress.zipCode', formData.billingAddress.zipCode);
            if (billingZipError) newErrors['billingAddress.zipCode'] = billingZipError;

            const preferredPaymentMethodError = validateField('preferredPaymentMethod', formData.preferredPaymentMethod);
            if (preferredPaymentMethodError) newErrors.preferredPaymentMethod = preferredPaymentMethodError;

            const billingCountryError = validateField('billingAddress.country', formData.billingAddress.country);
            if (billingCountryError) newErrors['billingAddress.country'] = billingCountryError;

            if (formData.preferredPaymentMethod === "paypal" || formData.preferredPaymentMethod === "zelle") {
                const paymentMethodIdError = validateField('paymentMethodId', formData.paymentMethodId, formData);
                if (paymentMethodIdError) newErrors['paymentMethodId'] = paymentMethodIdError;
            }

            if (!formData.useSameAddress) {
                const shippingStreetError = validateField('shippingAddress.street', formData.shippingAddress.street, formData);
                if (shippingStreetError) newErrors['shippingAddress.street'] = shippingStreetError;

                const shippingCityError = validateField('shippingAddress.city', formData.shippingAddress.city, formData);
                if (shippingCityError) newErrors['shippingAddress.city'] = shippingCityError;

                const shippingStateError = validateField('shippingAddress.state', formData.shippingAddress.state, formData);
                if (shippingStateError) newErrors['shippingAddress.state'] = shippingStateError;

                const shippingZipError = validateField('shippingAddress.zipCode', formData.shippingAddress.zipCode, formData);
                if (shippingZipError) newErrors['shippingAddress.zipCode'] = shippingZipError;

                const shippingCountryError = validateField('shippingAddress.country', formData.shippingAddress.country, formData);
                if (shippingCountryError) newErrors['shippingAddress.country'] = shippingCountryError;
            }
            break;
        case 4:
            const termsError = validateField('termsAccepted', formData.termsAccepted);
            if (termsError) newErrors.termsAccepted = termsError;
            break;
        default:
            break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};
