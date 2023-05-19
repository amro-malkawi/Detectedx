import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {FormControl, MenuItem, Select} from "@mui/material";
import {SupportedLanguages} from "../../i18n";

export const LanguageSelect = () => {
    const { i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);

    useEffect(() => localStorage.setItem('language', i18n.language), [i18n.language]);

    const handleChange = (event) => {
        setLanguage(event.target.value);
        i18n.changeLanguage(event.target.value);
    };

    return (
        <FormControl className='language-select' variant="filled" sx={{ s: 1 }}>
            <Select
                labelId="language-select-label"
                id="demo-select-small"
                value={language}
                variant="standard"
                onChange={handleChange}>{
                Object
                    .keys(SupportedLanguages)
                    .map(langId => <MenuItem key={langId} value={langId}>{SupportedLanguages[langId]}</MenuItem>)
            }</Select>
        </FormControl>
    );
}