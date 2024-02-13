import { createContext, PropsWithChildren, useContext, useState } from "react";

type ContextType = [string, (theme: string) => void];

export const ThemeContext = createContext<ContextType | undefined>(undefined);

export function ThemeProvider({children}: PropsWithChildren<{}>){
    const themeState = useState('');
    return (
        <ThemeContext.Provider value={themeState}>
            { children }
        </ThemeContext.Provider>
    )
}

export function useThemeContext(){
    const context = useContext(ThemeContext);
    if(!context) throw new Error("useThemeContext는 항상 ThemeProvider 내에서 사용되어야 합니다.")
    return context;
}