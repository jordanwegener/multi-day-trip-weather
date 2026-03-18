import { useMemo, useCallback } from "react";

export const TempChart = ({
    tempsMax,
    tempsMin,
    ...props
}: {
    tempsMax: number[];
    tempsMin: number[];
} & React.SVGProps<SVGSVGElement>) => {
    const chartHeight = 100;
    const chartWidth = 1000;

    const safeMax = useMemo(
        () => (tempsMax && tempsMax.length > 0 ? tempsMax : [0]),
        [tempsMax]
    );
    const safeMin = useMemo(
        () => (tempsMin && tempsMin.length > 0 ? tempsMin : [0]),
        [tempsMin]
    );

    const [minTemp, maxTemp] = useMemo(
        () => [
            Math.min(...safeMax, ...safeMin),
            Math.max(...safeMax, ...safeMin),
        ],
        [safeMax, safeMin]
    );

    const chartPath = useCallback((temps: number[]) => {
        if (!temps || temps.length < 2) return "";
        const scale = maxTemp - minTemp || 1;
        const coords = temps.map((temp, i) => [
            Math.round((chartWidth / (temps.length - 1)) * i),
            chartHeight * 0.05 +
                chartHeight * 0.9 -
                Math.round(((temp - minTemp) / scale) * chartHeight * 0.9),
        ]);
        const pathArray = [
            `M0,${chartHeight}`,
            ...coords.map((coord) => `L${coord[0]},${coord[1]}`),
            `L${coords[coords.length - 1][0]},${chartHeight}`,
        ];
        return pathArray.join(" ");
    }, [chartHeight, chartWidth, maxTemp, minTemp]);

    const tempsMaxPath = useMemo(
        () => chartPath(safeMax),
        [chartPath, safeMax]
    );
    const tempsMinPath = useMemo(
        () => chartPath(safeMin),
        [chartPath, safeMin]
    );

    const isReady = tempsMax && tempsMin && tempsMax.length >= 2 && tempsMin.length >= 2;

    return (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} {...props} style={{ visibility: isReady ? "visible" : "hidden", ...props.style }}>
            <defs>
                <clipPath id="container">
                    <path
                        d={`M2,0 H${chartWidth - 2} V${chartHeight} H${2} Z`}
                    />
                </clipPath>
            </defs>
            <g clipPath="url(#container)">
                {tempsMaxPath ? (
                    <path
                        stroke="#fca5a5"
                        strokeWidth="3"
                        d={tempsMaxPath}
                        fill="rgba(252, 165, 165, 0.2)"
                    />
                ) : null}
                {tempsMinPath ? (
                    <path
                        stroke="#93c5fd"
                        strokeWidth="3"
                        d={tempsMinPath}
                        fill="rgba(147, 197, 253, 0.2)"
                    />
                ) : null}
            </g>
        </svg>
    );
};
