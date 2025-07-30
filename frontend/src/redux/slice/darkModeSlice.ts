import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface DarkModeState {
    mode: ThemeMode;
    isDarkMode: boolean;
}

// Function to get system preference
const getSystemPreference = (): boolean => {
    try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (error) {
        // If matchMedia is not supported or fails, default to false (light mode)
        console.warn('System preference detection not supported, defaulting to light mode');
        return false;
    }
};

// Function to get initial theme from localStorage or system
const getInitialTheme = (): { mode: ThemeMode; isDarkMode: boolean } => {
    try {
        const storedMode = localStorage.getItem('theme-mode') as ThemeMode;
        
        if (storedMode && ['light', 'dark', 'system'].includes(storedMode)) {
            const isDarkMode = storedMode === 'dark' || (storedMode === 'system' && getSystemPreference());
            return { mode: storedMode, isDarkMode };
        }
    } catch (error) {
        console.error('Error reading theme from localStorage:', error);
    }
    
    // Default to light mode instead of system preference
    // This ensures we always start with light mode if no preference is stored
    return { mode: 'light', isDarkMode: false };
};

const initialState: DarkModeState = getInitialTheme();

const darkModeSlice = createSlice({
    name: 'darkMode',
    initialState,
    reducers: {
        setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
            state.mode = action.payload;
            
            // Calculate isDarkMode based on the new mode
            if (action.payload === 'system') {
                state.isDarkMode = getSystemPreference();
            } else {
                state.isDarkMode = action.payload === 'dark';
            }
            
            // Save to localStorage
            try {
                localStorage.setItem('theme-mode', action.payload);
            } catch (error) {
                console.error('Error saving theme to localStorage:', error);
            }
        },
        toggleDarkMode: (state) => {
            // If current mode is system, switch to the opposite of current system preference
            // If current mode is light/dark, toggle it
            if (state.mode === 'system') {
                state.mode = state.isDarkMode ? 'light' : 'dark';
            } else {
                state.mode = state.mode === 'dark' ? 'light' : 'dark';
            }
            
            state.isDarkMode = state.mode === 'dark';
            
            // Save to localStorage
            try {
                localStorage.setItem('theme-mode', state.mode);
            } catch (error) {
                console.error('Error saving theme to localStorage:', error);
            }
        },
        updateSystemPreference: (state) => {
            // This action is called when system preference changes
            if (state.mode === 'system') {
                state.isDarkMode = getSystemPreference();
            }
        }
    }
});

export const { setThemeMode, toggleDarkMode, updateSystemPreference } = darkModeSlice.actions;
export default darkModeSlice.reducer;
