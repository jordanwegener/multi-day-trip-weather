export const LoadingSpinner = () => {
    return (
        <svg viewBox="0 0 500 500" style={{ maxHeight: "100px" }}>
            <circle
                fill="none"
                strokeWidth="15"
                stroke="black"
                r="100"
                cx="250"
                cy="250"
            />
            {Array.from(new Array(8).keys()).map((n) => (
                <path
                    className="spinner__line"
                    d="M250,150 V50"
                    style={{
                        transformOrigin: "250px 250px",
                        transform: `rotate(${(360 / 8) * n}deg)`,
                        animationDelay: `${200 * n}ms`,
                    }}
                    strokeWidth="15"
                    strokeLinecap="round"
                    stroke="black"
                    fill="none"
                />
            ))}
        </svg>
    );
};
