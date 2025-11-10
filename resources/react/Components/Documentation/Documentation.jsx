import React, { useState, useEffect } from "react";
import { BlockStack, Box, Card, InlineStack, Link, Text, } from "@shopify/polaris";
import { SupportIcon } from "../Icons/SupportIcon";
import MobileAppPromo from "../MobileAppSuggestionComponent/MobileAppPromo";
import { fetchApi } from "../../utils/api";
import SupportCard from "../SupportCard/SupportCard";

export const Documentation = () => {
    const [promoStatus, setPromoStatus] = useState(1);

    const handleClose = async () => {
        setPromoStatus(1);
        try {
            const res = await fetchApi(
                "POST",
                "/api/close-mobile-promo",
                { body: { mobile_promo: true } });
            if (res?.status == 1) {
                setPromoStatus(1);
            }
            else {
                setPromoStatus(0);
            }
        }
        catch (error) {
            console.error("Request failed:", error);
        }
    };

    const getMobilePromo = async () => {
        try {
            const res = await fetchApi("POST", "/api/get-mobile-promo", {});
            if (res?.status === 1) {
                setPromoStatus(res.data);
            } else {
                setPromoStatus(0);
            }
        } catch (error) {
            console.error("Request failed:", error);
            setPromoStatus(0);
        }
    };


    useEffect(() => {
        getMobilePromo();
    }, [])
    return (
        <Box paddingBlockEnd={"200"}>
            {promoStatus !== 1 ?
                <Box paddingBlockEnd={200}>
                    <MobileAppPromo handleClose={handleClose} />
                </Box> : ''}
                <Box paddingBlockEnd={"200"}>
            <SupportCard />
                </Box>
        </Box>
    );
};
