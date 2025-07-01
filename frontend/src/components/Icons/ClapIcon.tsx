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
    const svgRef = React.useRef<SVGSVGElement>(null);

    React.useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const handleAnimationStart = () => {
            svg.querySelectorAll('.clap-burst').forEach(el => {
                (el as HTMLElement).style.opacity = '1';
            });
        };
        const handleAnimationEnd = () => {
            svg.querySelectorAll('.clap-burst').forEach(el => {
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
        const svg = svgRef.current;
        if (svg) {
            svg.classList.remove('animate-clap');
            // Trigger reflow to restart animation
            void (svg as unknown as HTMLElement).offsetWidth;
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
                        0% { 
                                transform: scale(1) rotate(0deg);
                                filter: brightness(1) saturate(1);
                        }
                        5% { 
                                transform: scale(0.9) rotate(-3deg);
                                filter: brightness(1.1) saturate(1.2);
                        }
                        15% { 
                                transform: scale(1.4) rotate(-15deg);
                                filter: brightness(1.3) saturate(1.5);
                        }
                        25% { 
                                transform: scale(1.5) rotate(12deg);
                                filter: brightness(1.4) saturate(1.6);
                        }
                        35% { 
                                transform: scale(1.2) rotate(-8deg);
                                filter: brightness(1.2) saturate(1.3);
                        }
                        45% { 
                                transform: scale(1.15) rotate(6deg);
                                filter: brightness(1.1) saturate(1.2);
                        }
                        55% { 
                                transform: scale(1.08) rotate(-3deg);
                                filter: brightness(1.05) saturate(1.1);
                        }
                        70% { 
                                transform: scale(1.03) rotate(2deg);
                                filter: brightness(1.02) saturate(1.05);
                        }
                        85% { 
                                transform: scale(1.01) rotate(-1deg);
                                filter: brightness(1.01) saturate(1.02);
                        }
                        100% { 
                                transform: scale(1) rotate(0deg);
                                filter: brightness(1) saturate(1);
                        }
                }
                .animate-clap {
                        animation: clap-pop 0.8s cubic-bezier(.175,.885,.32,1.275) both;
                }
                @keyframes burst {
                        0% {
                                opacity: 0;
                                transform: scale(0.3) rotate(0deg);
                        }
                        15% {
                                opacity: 0.8;
                                transform: scale(0.8) rotate(45deg);
                        }
                        30% {
                                opacity: 1;
                                transform: scale(1.8) rotate(90deg);
                        }
                        60% {
                                opacity: 0.7;
                                transform: scale(2.5) rotate(180deg);
                        }
                        100% {
                                opacity: 0;
                                transform: scale(3.2) rotate(360deg);
                        }
                }
                .animate-clap .clap-burst {
                        animation: burst 0.8s cubic-bezier(.175,.885,.32,1.275) both;
                }
                @keyframes sparkle {
                        0%, 100% {
                                opacity: 0;
                                transform: scale(0) rotate(0deg);
                        }
                        20% {
                                opacity: 1;
                                transform: scale(1.5) rotate(72deg);
                        }
                        40% {
                                opacity: 0.8;
                                transform: scale(1.2) rotate(144deg);
                        }
                        60% {
                                opacity: 1;
                                transform: scale(1.8) rotate(216deg);
                        }
                        80% {
                                opacity: 0.6;
                                transform: scale(1.1) rotate(288deg);
                        }
                }
                .animate-clap .sparkle {
                        animation: sparkle 0.8s ease-in-out both;
                }
                @keyframes glow-pulse {
                        0% {
                                opacity: 0.25;
                                transform: scale(1);
                        }
                        50% {
                                opacity: 0.6;
                                transform: scale(1.2);
                        }
                        100% {
                                opacity: 0.25;
                                transform: scale(1);
                        }
                }
                .animate-clap .glow-effect {
                        animation: glow-pulse 0.8s ease-in-out both;
                }
                `}
            </style>
            <svg
                ref={svgRef}  // ← Use ref instead of id
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
                        <circle className="sparkle" cx="12" cy="2" r="0.7" fill="#fbbf24" opacity="0.9">
                            <animate attributeName="r" values="0.7;2.5;0.7" dur="0.8s" begin="0s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.9;0;0.9" dur="0.8s" begin="0s" repeatCount="indefinite" />
                        </circle>
                        <circle className="sparkle" cx="19.5" cy="7.5" r="0.5" fill="#f472b6" opacity="0.8">
                            <animate attributeName="r" values="0.5;2;0.5" dur="0.8s" begin="0.1s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.8;0;0.8" dur="0.8s" begin="0.1s" repeatCount="indefinite" />
                        </circle>
                        <circle className="sparkle" cx="5" cy="8" r="0.6" fill="#34d399" opacity="0.7">
                            <animate attributeName="r" values="0.6;2.2;0.6" dur="0.8s" begin="0.2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.7;0;0.7" dur="0.8s" begin="0.2s" repeatCount="indefinite" />
                        </circle>
                        <circle className="sparkle" cx="17.5" cy="17.5" r="0.7" fill="#60a5fa" opacity="0.8">
                            <animate attributeName="r" values="0.7;2.3;0.7" dur="0.8s" begin="0.15s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.8;0;0.8" dur="0.8s" begin="0.15s" repeatCount="indefinite" />
                        </circle>
                        <circle className="sparkle" cx="7" cy="17" r="0.9" fill="#fbbf24" opacity="0.7">
                            <animate attributeName="r" values="0.9;2.8;0.9" dur="0.8s" begin="0.25s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.7;0;0.7" dur="0.8s" begin="0.25s" repeatCount="indefinite" />
                        </circle>
                        {/* Additional sparkles for more magic */}
                        <circle className="sparkle" cx="3" cy="4" r="0.4" fill="#a78bfa" opacity="0.6">
                            <animate attributeName="r" values="0.4;1.8;0.4" dur="0.8s" begin="0.3s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.6;0;0.6" dur="0.8s" begin="0.3s" repeatCount="indefinite" />
                        </circle>
                        <circle className="sparkle" cx="21" cy="20" r="0.5" fill="#fb7185" opacity="0.7">
                            <animate attributeName="r" values="0.5;2.1;0.5" dur="0.8s" begin="0.35s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.7;0;0.7" dur="0.8s" begin="0.35s" repeatCount="indefinite" />
                        </circle>
                    </g>
                    {/* Glow effect */}
                    <ellipse
                        className="glow-effect"
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
                    <path className='fill-current text-white/80' fillRule="evenodd" d="M11.37.828 12 3.282l.63-2.454zM15.421 1.84l-1.185-.388-.338 2.5zM9.757 1.452l-1.184.389 1.523 2.112zM20.253 11.84 17.75 7.438c-.238-.353-.57-.584-.93-.643a.96.96 0 0 0-.753.183 1.13 1.13 0 0 0-.443.695c.014.019.03.033.044.053l2.352 4.138c1.614 2.95 1.1 5.771-1.525 8.395a7 7 0 0 1-.454.415c.997-.13 1.927-.61 2.773-1.457 2.705-2.704 2.517-5.585 1.438-7.377M12.066 9.01c-.129-.687.08-1.299.573-1.773l-2.062-2.063a1.123 1.123 0 0 0-1.555 0 1.1 1.1 0 0 0-.273.521z" clipRule="evenodd"></path>
                    <path className='fill-current text-white/80' fillRule="evenodd" d="M14.741 8.309c-.18-.267-.446-.455-.728-.502a.67.67 0 0 0-.533.127c-.146.113-.59.458-.199 1.296l1.184 2.503a.448.448 0 0 1-.236.755.445.445 0 0 1-.483-.248L7.614 6.106A.816.816 0 1 0 6.459 7.26l3.643 3.644a.446.446 0 1 1-.631.63L5.83 7.896l-1.03-1.03a.82.82 0 0 0-1.395.577.81.81 0 0 0 .24.576l1.027 1.028 3.643 3.643a.444.444 0 0 1-.144.728.44.44 0 0 1-.486-.098l-3.64-3.64a.82.82 0 0 0-1.335.263.81.81 0 0 0 .178.89l1.535 1.534 2.287 2.288a.445.445 0 0 1-.63.63l-2.287-2.288a.813.813 0 0 0-1.393.578c0 .216.086.424.238.577l4.403 4.403c2.79 2.79 5.495 4.119 8.681.931 2.269-2.271 2.708-4.588 1.342-7.086z" clipRule="evenodd"></path>
                    {/* Burst circles for advanced animation */}
                    <circle className="clap-burst" cx="12" cy="3" r="1.5" fill="#fbbf24" opacity="0" />
                    <circle className="clap-burst" cx="19" cy="7" r="1.2" fill="#f87171" opacity="0" />
                    <circle className="clap-burst" cx="5" cy="8" r="1" fill="#34d399" opacity="0" />
                    <circle className="clap-burst" cx="17" cy="17" r="1.1" fill="#60a5fa" opacity="0" />
                    <circle className="clap-burst" cx="7" cy="17" r="1.3" fill="#f472b6" opacity="0" />
                    {/* Additional burst effects */}
                    <circle className="clap-burst" cx="15" cy="4" r="0.8" fill="#a78bfa" opacity="0" />
                    <circle className="clap-burst" cx="9" cy="20" r="1.0" fill="#fb7185" opacity="0" />
                    <circle className="clap-burst" cx="20" cy="12" r="0.9" fill="#34d399" opacity="0" />
                    <circle className="clap-burst" cx="4" cy="12" r="1.1" fill="#fbbf24" opacity="0" />
                </g>
            </svg>
        </button>
    );
};

