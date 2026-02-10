import React, { createContext, useState, useContext, useEffect } from 'react';
const AuthContext = createContext(null);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const saveUserToLocalStorage = (userData) => {
        const { avatarImageData, ...userStorage } = userData;
        localStorage.setItem('user', JSON.stringify(userStorage));
    };

    useEffect(() => {
        const checkAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');

            if (storedToken && storedUser) {
                try {
                    const response = await fetch('https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/auth/verify-token', {
                        headers: {
                            'Authorization': `Bearer ${storedToken}`
                        }
                    });

                    if (response.ok) {
                        setToken(storedToken);
                        setUser(JSON.parse(storedUser));
                    } else {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                } catch (error) {
                    console.error('Błąd weryfikacji tokenu:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch('https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem('token', data.token);
                saveUserToLocalStorage(data.user);

                return { success: true, message: data.message };
            } else {
                if (data.requiresVerification) {
                    return {
                        success: false,
                        message: data.message,
                        requiresVerification: true,
                        email: data.email
                    };
                }
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Błąd logowania:', error);
            return { success: false, message: 'Błąd połączenia z serwerem' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await fetch('https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok) {
                return {
                    success: true,
                    message: data.message,
                    requiresVerification: data.requiresVerification,
                    email: data.email
                };
            } else {
                if (data.requiresVerification) {
                    return {
                        success: false,
                        message: data.message,
                        requiresVerification: true,
                        email: data.email
                    };
                }
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Błąd rejestracji:', error);
            return { success: false, message: 'Błąd połączenia z serwerem' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const updateUser = (updatedUserData) => {
        setUser(updatedUserData);
        saveUserToLocalStorage(updatedUserData);
    };

    const refreshUserData = async () => {
        if (!token) return;

        try {
            const response = await fetch('https://clea-admin-backend-cdczc5fthtbnayc2.polandcentral-01.azurewebsites.net/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                saveUserToLocalStorage(userData);
                return { success: true, user: userData };
            } else {
                return { success: false, message: 'Nie udało się odświeżyć danych użytkownika' };
            }
        } catch (error) {
            console.error('Błąd odświeżania danych użytkownika:', error);
            return { success: false, message: 'Błąd połączenia z serwerem' };
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        refreshUserData,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};