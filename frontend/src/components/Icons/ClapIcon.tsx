import React from 'react'

export const ClapIcon = () => {
    return (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-label="clap">
                <path className='fill-current text-gray-600' fillRule="evenodd" d="M11.37.828 12 3.282l.63-2.454zM15.421 1.84l-1.185-.388-.338 2.5zM9.757 1.452l-1.184.389 1.523 2.112zM20.253 11.84 17.75 7.438c-.238-.353-.57-.584-.93-.643a.96.96 0 0 0-.753.183 1.13 1.13 0 0 0-.443.695c.014.019.03.033.044.053l2.352 4.138c1.614 2.95 1.1 5.771-1.525 8.395a7 7 0 0 1-.454.415c.997-.13 1.927-.61 2.773-1.457 2.705-2.704 2.517-5.585 1.438-7.377M12.066 9.01c-.129-.687.08-1.299.573-1.773l-2.062-2.063a1.123 1.123 0 0 0-1.555 0 1.1 1.1 0 0 0-.273.521z" clipRule="evenodd"></path>
                <path className='fill-current text-gray-600' fill-rule="evenodd" d="M14.741 8.309c-.18-.267-.446-.455-.728-.502a.67.67 0 0 0-.533.127c-.146.113-.59.458-.199 1.296l1.184 2.503a.448.448 0 0 1-.236.755.445.445 0 0 1-.483-.248L7.614 6.106A.816.816 0 1 0 6.459 7.26l3.643 3.644a.446.446 0 1 1-.631.63L5.83 7.896l-1.03-1.03a.82.82 0 0 0-1.395.577.81.81 0 0 0 .24.576l1.027 1.028 3.643 3.643a.444.444 0 0 1-.144.728.44.44 0 0 1-.486-.098l-3.64-3.64a.82.82 0 0 0-1.335.263.81.81 0 0 0 .178.89l1.535 1.534 2.287 2.288a.445.445 0 0 1-.63.63l-2.287-2.288a.813.813 0 0 0-1.393.578c0 .216.086.424.238.577l4.403 4.403c2.79 2.79 5.495 4.119 8.681.931 2.269-2.271 2.708-4.588 1.342-7.086z" clip-rule="evenodd"></path>
            </svg>
        </>
    )
};

export const ClickableClapIcon = () => {
    React.useEffect(() => {
        const svg = document.getElementById('clap-svg');
        if (!svg) return;

        const handleAnimationStart = () => {
            document.querySelectorAll('#clap-svg .clap-burst').forEach(el => {
                (el as HTMLElement).style.opacity = '1';
            });
        };
        const handleAnimationEnd = () => {
            document.querySelectorAll('#clap-svg .clap-burst').forEach(el => {
                (el as HTMLElement).style.opacity = '0';
            });
            svg.classList.remove('animate-clap');
        };

        svg.addEventListener('animationstart', handleAnimationStart);
        svg.addEventListener('animationend', handleAnimationEnd);

        return () => {
            svg.removeEventListener('animationstart', handleAnimationStart);
            svg.removeEventListener('animationend', handleAnimationEnd);
        };
    }, []);

    const handleClick = () => {
        const svg = document.getElementById('clap-svg');
        if (svg) {
            svg.classList.remove('animate-clap');
            // Trigger reflow to restart animation
            void svg.offsetWidth;
            svg.classList.add('animate-clap');
        }
    };

    return (
        <button
            type="button"
            className="focus:outline-none"
            onClick={handleClick}
            aria-label="Clap"
        >
            <style>
                {`
                @keyframes clap-pop {
                        0% { transform: scale(1) rotate(0deg);}
                        10% { transform: scale(1.2) rotate(-10deg);}
                        20% { transform: scale(1.3) rotate(10deg);}
                        30% { transform: scale(1.15) rotate(-5deg);}
                        40% { transform: scale(1.1) rotate(5deg);}
                        50% { transform: scale(1.05) rotate(-2deg);}
                        60% { transform: scale(1.02) rotate(2deg);}
                        100% { transform: scale(1) rotate(0deg);}
                }
                .animate-clap {
                        animation: clap-pop 0.6s cubic-bezier(.36,1.01,.32,1) both;
                }
                @keyframes burst {
                        0% {
                                opacity: 0;
                                transform: scale(0.5);
                        }
                        40% {
                                opacity: 1;
                                transform: scale(1.5);
                        }
                        100% {
                                opacity: 0;
                                transform: scale(2.2);
                        }
                }
                .animate-clap .clap-burst {
                        animation: burst 0.6s cubic-bezier(.36,1.01,.32,1) both;
                }
                `}
            </style>
            <svg
                id="clap-svg"
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                aria-label="clap"
                className="transition-transform duration-200"
            >
                <g>
                    {/* Main hand */}
                    <g filter="url(#clap-shadow)">
                        <path
                            className="fill-current text-yellow-400"
                            d="M11.37.828 12 3.282l.63-2.454z"
                            opacity="0.85"
                        />
                        <path
                            className="fill-current text-yellow-500"
                            d="M15.421 1.84l-1.185-.388-.338 2.5z"
                            opacity="0.85"
                        />
                        <path
                            className="fill-current text-yellow-300"
                            d="M9.757 1.452l-1.184.389 1.523 2.112z"
                            opacity="0.85"
                        />
                    </g>
                    {/* Sparkles */}
                    <g>
                        <circle cx="12" cy="2" r="0.7" fill="#fbbf24" opacity="0.9">
                            <animate attributeName="r" values="0.7;2;0.7" dur="0.6s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.9;0;0.9" dur="0.6s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="19.5" cy="7.5" r="0.5" fill="#f472b6" opacity="0.8">
                            <animate attributeName="r" values="0.5;1.5;0.5" dur="0.6s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.8;0;0.8" dur="0.6s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="5" cy="8" r="0.6" fill="#34d399" opacity="0.7">
                            <animate attributeName="r" values="0.6;1.8;0.6" dur="0.6s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.7;0;0.7" dur="0.6s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="17.5" cy="17.5" r="0.7" fill="#60a5fa" opacity="0.8">
                            <animate attributeName="r" values="0.7;2;0.7" dur="0.6s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.8;0;0.8" dur="0.6s" repeatCount="indefinite" />
                        </circle>
                        <circle cx="7" cy="17" r="0.9" fill="#fbbf24" opacity="0.7">
                            <animate attributeName="r" values="0.9;2.2;0.9" dur="0.6s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.7;0;0.7" dur="0.6s" repeatCount="indefinite" />
                        </circle>
                    </g>
                    {/* Glow effect */}
                    <ellipse
                        cx="12"
                        cy="12"
                        rx="7"
                        ry="7"
                        fill="url(#clap-glow)"
                        opacity="0.25"
                    />
                    {/* SVG filters and gradients */}
                    <defs>
                        <filter id="clap-shadow" x="-20%" y="-20%" width="140%" height="140%">
                            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#fbbf24" floodOpacity="0.4" />
                        </filter>
                        <radialGradient id="clap-glow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#fde68a" stopOpacity="1" />
                            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <path className='fill-current text-gray-500' fillRule="evenodd" d="M11.37.828 12 3.282l.63-2.454zM15.421 1.84l-1.185-.388-.338 2.5zM9.757 1.452l-1.184.389 1.523 2.112zM20.253 11.84 17.75 7.438c-.238-.353-.57-.584-.93-.643a.96.96 0 0 0-.753.183 1.13 1.13 0 0 0-.443.695c.014.019.03.033.044.053l2.352 4.138c1.614 2.95 1.1 5.771-1.525 8.395a7 7 0 0 1-.454.415c.997-.13 1.927-.61 2.773-1.457 2.705-2.704 2.517-5.585 1.438-7.377M12.066 9.01c-.129-.687.08-1.299.573-1.773l-2.062-2.063a1.123 1.123 0 0 0-1.555 0 1.1 1.1 0 0 0-.273.521z" clipRule="evenodd"></path>
                    <path className='fill-current text-gray-500' fillRule="evenodd" d="M14.741 8.309c-.18-.267-.446-.455-.728-.502a.67.67 0 0 0-.533.127c-.146.113-.59.458-.199 1.296l1.184 2.503a.448.448 0 0 1-.236.755.445.445 0 0 1-.483-.248L7.614 6.106A.816.816 0 1 0 6.459 7.26l3.643 3.644a.446.446 0 1 1-.631.63L5.83 7.896l-1.03-1.03a.82.82 0 0 0-1.395.577.81.81 0 0 0 .24.576l1.027 1.028 3.643 3.643a.444.444 0 0 1-.144.728.44.44 0 0 1-.486-.098l-3.64-3.64a.82.82 0 0 0-1.335.263.81.81 0 0 0 .178.89l1.535 1.534 2.287 2.288a.445.445 0 0 1-.63.63l-2.287-2.288a.813.813 0 0 0-1.393.578c0 .216.086.424.238.577l4.403 4.403c2.79 2.79 5.495 4.119 8.681.931 2.269-2.271 2.708-4.588 1.342-7.086z" clipRule="evenodd"></path>
                    {/* Burst circles for advanced animation */}
                    <circle className="clap-burst" cx="12" cy="3" r="1.5" fill="#fbbf24" opacity="0" />
                    <circle className="clap-burst" cx="19" cy="7" r="1.2" fill="#f87171" opacity="0" />
                    <circle className="clap-burst" cx="5" cy="8" r="1" fill="#34d399" opacity="0" />
                    <circle className="clap-burst" cx="17" cy="17" r="1.1" fill="#60a5fa" opacity="0" />
                    <circle className="clap-burst" cx="7" cy="17" r="1.3" fill="#f472b6" opacity="0" />
                </g>
            </svg>
        </button>
    );
};

