import { createContext, useState } from 'react';
import api from '../Utils/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (!userInfo) return null;

        try {
            const savedUser = JSON.parse(userInfo);
            if (
                !savedUser ||
                typeof savedUser.name !== 'string' ||
                typeof savedUser.role !== 'string' ||
                typeof savedUser.token !== 'string'
            ) {
                throw new Error('Saved user session is invalid');
            }
            return savedUser;
        } catch (error) {
            console.error('Unable to restore saved session:', error);
            localStorage.removeItem('userInfo');
            localStorage.removeItem('token');
            return null;
        }
    });

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            if (error.response?.data?.needsVerification) throw error.response.data;
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            return data; // Returns { message, email }
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const verifyOTP = async (email, otp) => {
        try {
            const { data } = await api.post('/auth/verify-otp', { email, otp });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            localStorage.setItem('token', data.token);
            return data;
        } catch (error) {
            throw error.response?.data?.message || 'OTP verification failed';
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, verifyOTP, logout }}>
            {children}
        </AuthContext.Provider>
    );
};