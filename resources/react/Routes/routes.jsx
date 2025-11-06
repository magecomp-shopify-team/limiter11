import React from 'react';
import { Route, Routes } from "react-router-dom";
import HomePage from '../Pages';
import Settings from '../Pages/settings';
import Rules from '../Pages/rules';
import Customization from '../Pages/customization';
import PlanPage from '../Pages/plan';

const AppNavMenu = () => {

    return (
        <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
            <Route path="/rules" element={<Rules />}></Route>
            <Route path="/customization" element={<Customization />}></Route>
            <Route path="/plan" element={<PlanPage />}></Route>
        </Routes>
    );
};

export default AppNavMenu;