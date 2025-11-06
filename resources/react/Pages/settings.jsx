import { BlockStack, Box, Button, Card, Divider, InlineGrid, Page, Text, TextField, useBreakpoints } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { useAppBridge } from '@shopify/app-bridge-react';
import { fetchApi } from "../utils/api";

const Settings = () => {
    const [limitStatus, setLimitStatus] = useState(true);

    const shopify = useAppBridge();

    const getSettings = async () => {
        try {
            const res = await fetchApi("GET", '/api/settings', {})
            if (res?.status) {
                const shopStatus = res?.data?.shop?.limit_publish_status ? true : false;
                setLimitStatus(shopStatus)
            }
        }
        catch (error) {
            console.error("Request failed:", error);
        }
    }

    useEffect(() => {
        getSettings();
    }, []);

    const handleLimit = async () => {
        const res = await fetchApi("POST", '/api/settings', {
            body: { status: !limitStatus }
        });
        if (res?.status) {
            setLimitStatus(!limitStatus)
            shopify.toast.show("Saved");
        } else {
            shopify.toast.show("Something wrong", { isError: true });
        }
    }
    return (
        <Page
            divider
            title="Settings"
        >
            <BlockStack gap={{ xs: "800", sm: "400" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box
                        as="section"
                        paddingInlineStart={{ xs: 400, sm: 0 }}
                        paddingInlineEnd={{ xs: 400, sm: 0 }}
                    >
                        <BlockStack gap="400">
                            <Text as="h3" variant="headingMd">
                                Toggle Limit Publish Status
                            </Text>
                            <Text as="p" variant="bodyMd">
                                Easily manage the publishing limit for your online store
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card roundedAbove="sm">
                        <Text as="p" variant="bodyMd" >
                            Current status: Your limit is currently <Text fontWeight="bold" as="span" tone={limitStatus ? "success" : "critical"}>{limitStatus ? 'published' : 'unpublished'}</Text> on the store.
                        </Text>
                        <Button variant={limitStatus ? "secondary" : "primary"} tone={limitStatus ? "critical" : ""} onClick={handleLimit}>{limitStatus ? 'Unpublish' : 'Publish'}</Button>
                    </Card>
                </InlineGrid>
            </BlockStack>
        </Page>
    )
}

export default Settings;