export const getBearToken = (token) => (token ? `Bearer ${token}` : null);

export const getStoredAuthToken = () => {
    return localStorage.getItem('authToken');
};
