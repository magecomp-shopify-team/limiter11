import React, { useState, useEffect } from "react";
import { BlockStack, Box, Card, InlineStack, Link, Text, } from "@shopify/polaris";
import { SupportIcon } from "../Icons/SupportIcon";
import MobileAppPromo from "../MobileAppSuggestionComponent/MobileAppPromo";
import { fetchApi } from "../../utils/api";

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
            <Card title="Main Card" sectioned>
                <Box paddingBlockEnd={"200"}>
                    <Text variant="headingMd" as="h2">
                        Need more assistance?
                    </Text>
                </Box>

                <BlockStack vertical>
                    {/* <Box paddingBlockEnd={"100"}>
                        <Card sectioned>
                            <InlineStack gap={"200"}>
                                <Box>
                                    <DocumentationIcon />
                                </Box>
                                <Box>
                                    <Text>
                                        <Text>Documentation</Text>
                                        <p>
                                            Read our step-by-step guidelines for
                                            each and every feature
                                        </p>
                                    </Text>
                                </Box>
                            </InlineStack>
                        </Card>
                    </Box> */}
                    <Box paddingBlockEnd={"100"}>
                        <Card sectioned>
                            <Link monochrome removeUnderline target="_blank" url="https://mageshopapps.freshdesk.com/support/tickets/new">
                                <InlineStack gap={"200"}>
                                    <Box>
                                        <SupportIcon />
                                    </Box>
                                    <Box>
                                        <Text>
                                            <Text fontWeight="bold">Support</Text>
                                            <p>
                                                Feel free to reach out to us at
                                                any time to solve your issue
                                            </p>
                                        </Text>
                                    </Box>
                                </InlineStack>
                            </Link>
                        </Card>
                    </Box>
                </BlockStack>
            </Card>
            {promoStatus !== 1 ?
                <Box paddingBlockStart={200}>
                    <MobileAppPromo handleClose={handleClose} />
                </Box> : ''}
        </Box>
    );
};
