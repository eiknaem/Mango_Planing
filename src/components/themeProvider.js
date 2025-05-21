import React, { createContext, useContext, useState, useEffect } from "react";
import { StatusBar,Platform } from "react-native";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { getDataStorage, setDataStorage } from "../api/service"; // ฟังก์ชันเก็บค่า theme ใน storage
import { colors } from "../stylesheet/styles";
const ThemeContext = createContext();
const MyDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: '#BB86FC', // สีหลัก เช่น ปุ่มหรือไฮไลท์
        background: colors.back_bg, // สีพื้นหลังหลัก
        card: '#1F1B24', // สีพื้นหลังของ header/tab bar
        text: colors.white, // สีข้อความ
        border: colors.image_light, // สีเส้นขอบ
        notification: '#CF6679', // สี badge แจ้งเตือน,
        font_dark: colors.font_dark,
        back_dark: colors.back_dark
    },
};
const MyLightTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: 'tomato', // สีหลัก
        background: colors.white, // สีพื้นหลัง
        card: 'black', // สีพื้นหลังของ header/tab bar
        text: colors.black, // สีของตัวหนังสือ
        border: 'gray', // สีเส้นขอบ
        notification: 'red', // สีของ badge notification
        font_dark: colors.white,
        back_dark: colors.image_light
    },
};
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light"); // ค่าเริ่มต้น
    const [themeObject, setThemeObject] = useState(MyLightTheme);

    useEffect(() => {
        (async () => {
            let savedTheme = (await getDataStorage("themes_ppn")) || "light";
            console.log("savedTheme", savedTheme);
            setTheme(savedTheme);
            setThemeObject(savedTheme === "light" ? MyLightTheme : MyDarkTheme);
        })();
    }, []);

    const toggleTheme = async (newTheme) => {
        setTheme(newTheme);
        setThemeObject(newTheme === "light" ? MyLightTheme : MyDarkTheme);
        await setDataStorage("themes_ppn", newTheme); // บันทึกค่า
    };

    return (
        <ThemeContext.Provider value={{ theme, themeObject, toggleTheme }}>
            <StatusBar
                barStyle={theme === "light" ? "dark-content" : "light-content"}
                backgroundColor={
                    Platform.OS === "android" ? themeObject.colors.background : undefined
                  }
            />
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
