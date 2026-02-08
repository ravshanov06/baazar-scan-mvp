import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

/**
 * AuthContext provides vendor authentication and shop management state.
 * For this MVP, 'user' is actually an array of shops owned by the vendor (identified by phone).
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // State to store the array of shops associated with the logged-in phone number
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load session from localStorage on initial mount
    useEffect(() => {
        const storedUser = localStorage.getItem('bazaar_vendor');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored session:", e);
                localStorage.removeItem('bazaar_vendor');
            }
        }
        setLoading(false);
    }, []);

    /**
     * Log in vendor using phone number.
     * Fetches all shops owned by this phone.
     */
    const login = async (phone) => {
        try {
            const res = await api.post('/api/shops/login', { phone });
            const shops = res.data;

            setUser(shops);
            localStorage.setItem('bazaar_vendor', JSON.stringify(shops));

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login muvaffaqiyatsiz tugadi'
            };
        }
    };

    /**
     * Register a new shop or update existing one.
     * The backend returns the full list of shops to keep the session in sync.
     */
    const register = async (shopData) => {
        try {
            const res = await api.post('/api/shops/register', shopData);
            const { shops } = res.data;

            setUser(shops);
            localStorage.setItem('bazaar_vendor', JSON.stringify(shops));

            return { success: true, shop: res.data.activeShop };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Ro\'yxatdan o\'tish muvaffaqiyatsiz tugadi'
            };
        }
    };

    /**
     * Clear session and log out.
     */
    const logout = () => {
        setUser(null);
        localStorage.removeItem('bazaar_vendor');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
