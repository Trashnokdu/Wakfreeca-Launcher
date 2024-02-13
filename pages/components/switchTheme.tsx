import { useThemeContext } from "@/context/ThemeContext";

export default function ThemeSwitch(){
    const [theme, setTheme] = useThemeContext();
    
    if(theme === "light"){
        return (
            <>
                <button className='material-symbols-rounded' onClick={() => {setTheme('dark')}}>light_mode</button>
            </>
        )
    } else if(theme === "dark"){
        return (
            <>
                <button className='material-symbols-rounded' onClick={() => {setTheme('light')}}>dark_mode</button>
            </>
        )
    } else {
        return (
            <button className='material-symbols-rounded' onClick={() => {setTheme('auto')}}>brightness_auto</button>
        )
    }
}
{/* <button className='material-symbols-rounded'>delete_forever</button> */}