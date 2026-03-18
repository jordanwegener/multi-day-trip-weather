import { useCallback } from "react";
import useStore from "../store";

export const useTempScaler = () => {
    const { tempScale } = useStore();
    
    return useCallback((amount: string | number) => {
        switch (tempScale) {
            case "F": {
                return (Number(amount) * 1.8 + 32).toFixed(1) + "°F";
            }
            case "K": {
                return (Number(amount) + 273).toFixed(1) + "°K";
            }
            default: {
                return Number(amount).toFixed(1) + "°C";
            }
        }
    }, [tempScale]);
};
