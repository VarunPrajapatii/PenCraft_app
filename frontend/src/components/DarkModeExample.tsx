import { useDarkMode } from '../hooks/useDarkMode';

// Example component showing different ways to use dark mode
const DarkModeExample = () => {
    const { isDarkMode, mode, toggle, setMode } = useDarkMode();

    return (
        <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Dark Mode Demo
            </h2>
            
            <div className="space-y-4">
                {/* Current state display */}
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Current mode: <span className="font-semibold">{mode}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Is dark: <span className="font-semibold">{isDarkMode ? 'Yes' : 'No'}</span>
                    </p>
                </div>

                {/* Toggle button */}
                <button
                    onClick={toggle}
                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    Toggle to {isDarkMode ? 'Light' : 'Dark'} Mode
                </button>

                {/* Mode selection buttons */}
                <div className="flex gap-2">
                    {(['light', 'dark', 'system'] as const).map((themeMode) => (
                        <button
                            key={themeMode}
                            onClick={() => setMode(themeMode)}
                            className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                mode === themeMode
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                            }`}
                        >
                            {themeMode.charAt(0).toUpperCase() + themeMode.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Example styled elements */}
                <div className="space-y-2">
                    <div className="p-2 border border-gray-300 dark:border-gray-600 rounded">
                        <p className="text-gray-800 dark:text-gray-200">This text adapts to theme</p>
                    </div>
                    
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white rounded">
                        <p>Gradient that changes in dark mode</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DarkModeExample;
