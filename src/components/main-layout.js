import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import {
    Divider,
    List,
    ListItem,
    Text, Spinner
} from '@ui-kitten/components';
import { xt } from '../api/service';
import { useTheme } from './themeProvider';

const useLayoutLang = () => {
    const [lang, setLang] = useState({});

    useEffect(() => {
        const fetchLang = async () => {
            try {
                const loadedLang = await xt.getLang();
                setLang(loadedLang || {});
            } catch (error) {
                console.error("Error loading language in main-layout:", error);
                // อาจจะ fallback ไปภาษา default ที่ import มา ถ้าโหลดไม่ได้
                // setLang(langData["EN"] || {}); 
            }
        };
        fetchLang();
    }, []);
    return lang;
};

export const NoRows = () => {
    const lang = useLayoutLang();
    const { themeObject } = useTheme();

    return (
        <>
            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <Text category='s1' style={{ color: themeObject.colors.text, width: 300, textAlign: 'center', marginBottom: 5 }}>
                    {lang.overlayNoRows}
                </Text>
                <Text category='p2' style={{ color: themeObject.colors.text, width: 300, textAlign: 'center' }}>
                    {lang.overlayNoRows_sub}
                </Text>
            </View>
        </>
    );
};

export const LoadingRows = () => {
    const lang = useLayoutLang();
    const { themeObject } = useTheme();

    return (
        <>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Spinner size='giant' status='success' />
                <Text category='s1' style={{ color: themeObject.colors.text, width: 300, textAlign: 'center', marginTop: 15, marginBottom: 5 }}>
                    {lang.overlayLoading}
                </Text>
                <Text category='p2' style={{ color: themeObject.colors.text, width: 300, textAlign: 'center' }}>
                    {lang.overlayLoading_sub}
                </Text>
            </View>
        </>
    );
};

export const UploadedRows = () => {
    const lang = useLayoutLang();
    const { themeObject } = useTheme();

    return (
        <>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Spinner size='giant' status='success' />
                <Text category='s1' style={{ color: themeObject.colors.text, width: 300, textAlign: 'center', marginTop: 15, marginBottom: 5 }}>
                    {lang.overlayUploaded}
                </Text>
                <Text category='p2' style={{ color: themeObject.colors.text, width: 300, textAlign: 'center' }}>
                    {lang.overlayUploaded_sub}
                </Text>
            </View>
        </>
    );
};

export const NoRowsImg = () => {
    const lang = useLayoutLang();
    const { themeObject } = useTheme();

    return (
        <>
            <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <Text category='s1' style={{ color: themeObject.colors.text, width: 300, textAlign: 'center', marginBottom: 5 }}>
                    {`${lang.overlayNoRows} ${lang.overlayNoRowsimg}`}
                </Text>
                <Text category='p2' style={{ color: themeObject.colors.text, width: 300, textAlign: 'center' }}>
                    {lang.overlayNoRows_sub}
                </Text>
            </View>
        </>
    );
};