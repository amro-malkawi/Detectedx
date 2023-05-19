/**
 * Main App
 */
import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {NotificationContainer} from "react-notifications";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import App from 'Container/App';
import {configureStore} from 'Store';

//css
import 'Assets/scss';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

function MainApp() {
    return (
        <Provider store={configureStore()}>
            <ThemeProvider theme={darkTheme}>
                <NotificationContainer/>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    )
}

export default MainApp;