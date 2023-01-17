import { useMemo } from "react";

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

    const [minTemp, maxTemp] = useMemo(
        () => [
            Math.min(...tempsMax, ...tempsMin),
            Math.max(...tempsMax, ...tempsMin),
        ],
        [tempsMax, tempsMin]
    );

    const chartPath = (temps: number[]) => {
        const scale = maxTemp - minTemp;
        const coords = temps.map((temp, i) => [
            Math.round((chartWidth / (temps.length - 1)) * i),
            chartHeight * 0.05 +
                chartHeight * 0.9 -
                Math.round(((temp - minTemp) / scale) * chartHeight * 0.9),
        ]);
        const pathArray = [
            `M0,${chartHeight}`,
            ...coords.map((coord) => `L${coord}`),
            `L${coords[coords.length - 1][0]},${chartHeight}`,
        ];
        return pathArray.join(" ");
    };

    const tempsMaxPath = useMemo(
        () => chartPath(tempsMax),
        [chartPath, tempsMax]
    );
    const tempsMinPath = useMemo(
        () => chartPath(tempsMin),
        [chartPath, tempsMin]
    );

    return (
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} {...props}>
            <defs>
                <clipPath id="container">
                    <path
                        d={`M2,0 H${chartWidth - 2} V${chartHeight} H${2} Z`}
                    />
                </clipPath>
            </defs>
            <g clipPath="url(#container)">
                {/* {Array.from(new Array(6).keys()).map((n) => (
                    <line
                        strokeWidth="1"
                        stroke="#EEE"
                        x1={0}
                        y1={chartHeight * 0.05 + ((chartHeight * 0.9) / 5) * n}
                        x2={chartWidth}
                        y2={chartHeight * 0.05 + ((chartHeight * 0.9) / 5) * n}
                    />
                ))} */}
                <path
                    stroke="#FD7"
                    strokeWidth="2"
                    d={tempsMaxPath}
                    fill="#FD73"
                />
                <path
                    stroke="#77F"
                    strokeWidth="2"
                    d={tempsMinPath}
                    fill="#77F3"
                />
            </g>
        </svg>
    );
};
