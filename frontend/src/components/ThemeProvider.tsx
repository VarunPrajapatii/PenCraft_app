import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/types';
import { updateSystemPreference } from '../redux/slice/darkModeSlice';

interface ThemeProviderProps {
    children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const { isDarkMode, mode } = useSelector((state: RootState) => state.darkMode);
    const dispatch = useDispatch();

    useEffect(() => {
        // Apply theme to document
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);

    useEffect(() => {
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemThemeChange = () => {
            if (mode === 'system') {
                dispatch(updateSystemPreference());
            }
        };

        // Add listener for system theme changes
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        
        // Cleanup
        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, [mode, dispatch]);

    return <>{children}</>;
};

export default ThemeProvider;
