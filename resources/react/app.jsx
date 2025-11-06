import React from "react";
import { createRoot } from "react-dom/client";
import "@shopify/polaris/build/esm/styles.css";
import enTranslations from "@shopify/polaris/locales/en.json";
import { AppProvider } from "@shopify/polaris";
import AppNavMenu from './Routes/routes';
import { BrowserRouter } from "react-router-dom";
import { NavMenu } from "@shopify/app-bridge-react";
import "./app.css";

const App = () => {
    return (
        <BrowserRouter>
            <AppProvider i18n={enTranslations}>
                <AppNavMenu />
                <NavMenu>
                    <a href="/rules">Rules</a>
                    <a href="/customization">Customization</a>
                    <a href="/settings">Settings</a>
                    <a href="/plan">Plan</a>
                </NavMenu>
            </AppProvider>
        </BrowserRouter>
    );
};

const root = createRoot(document.getElementById("root"));
export const themeAppUrl = document.getElementById("themeAppUrl").innerHTML.trim();
export const shop_data = JSON.parse(document.getElementById("shop_data").innerHTML.trim());
export const planConfig = JSON.parse(document.getElementById("planConfig").innerHTML.trim());
root.render(<App />);
