const authUtils = {
    setToken: (token) => {
        localStorage.setItem('dirwin-dealer-token', token);
        localStorage.setItem('dirwin-dealer-token-tokenTimestamp', Date.now().toString());
        // updateTokenDisplay();
    },

    getToken: () => {
        return localStorage.getItem('dirwin-dealer-token');
    },

    removeToken: () => {
        localStorage.removeItem('dirwin-dealer-token');
        localStorage.removeItem('dirwin-dealer-token-tokenTimestamp');
        // updateTokenDisplay();
    },

    isValid: () => {
        const token = authUtils.getToken();
        if (!token) return false;

        const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/;
        return jwtPattern.test(token);
    },
    
};

export default authUtils;
