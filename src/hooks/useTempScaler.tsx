import useStore from "../store";

export const useTempScaler = () => {
    const { tempScale } = useStore();
    const TempScaler = ({ children }: { children: string | number }) => {
        switch (tempScale) {
            case "F": {
                return <>{(Number(children) * 1.8 + 32).toFixed(1) + "°F"}</>;
            }
            case "K": {
                return <>{(Number(children) + 273).toFixed(1) + "°K"}</>;
            }
            default: {
                return <>{Number(children).toFixed(1) + "°C"}</>;
            }
        }
    };
    return TempScaler;
};
