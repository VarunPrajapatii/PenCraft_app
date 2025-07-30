import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/types';
import { toggleDarkMode, setThemeMode } from '../redux/slice/darkModeSlice';
import type { ThemeMode } from '../redux/slice/darkModeSlice';

export const useDarkMode = () => {
    const { isDarkMode, mode } = useSelector((state: RootState) => state.darkMode);
    const dispatch = useDispatch();

    const toggle = () => {
        dispatch(toggleDarkMode());
    };

    const setMode = (newMode: ThemeMode) => {
        dispatch(setThemeMode(newMode));
    };

    return {
        isDarkMode,
        mode,
        toggle,
        setMode,
    };
};
