import {
    BlockStack,
    Box,
    Button,
    Card,
    Icon,
    InlineStack,
    MediaCard,
    Text,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { CircleDownIcon, XIcon } from "@shopify/polaris-icons";


const MobileAppPromo = ({ handleClose }) => {

    const steps = [
        <>
            <strong>80% of online traffic comes from mobile.</strong> If you don’t
            have a mobile app, you’re missing almost 60% of sales.
        </>,
        <>
            <strong>Unlimited push notifications.</strong> Send instant deals and
            updates to your customers.
        </>,
        <>
            <strong>Better shopping experience.</strong> Mobile apps are faster,
            easier to use, and more personal.
        </>,
        <>
            <strong>Brand loyalty & repeat orders.</strong> Apps help you stay
            top-of-mind for your customers.
        </>,
    ];

    const description = (
        <>
            <ul style={{ paddingLeft: "10px", marginTop: "5px" }}>
                {steps.map((step, index) => (
                    <li key={index}>
                        <Text variant="bodyMd">{step}</Text>
                    </li>
                ))}
            </ul>
            <Button
                variant="primary"
                icon={<Icon source={CircleDownIcon} />}
                onClick={() => {
                    window.open(
                        "https://apps.shopify.com/mobile-app-builder-by-magecomp?st_source=autocomplete&surface_detail=autocomplete_apps",
                        "_blank"
                    );
                }}
            >
                Get app
            </Button>
        </>
    );

    return (
        <Card>
            <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                    <Text variant="headingLg" as="h5">
                        🚀 Why does your Shopify store need a mobile app?
                    </Text>
                    <Button
                        variant="plain"
                        onClick={handleClose}
                        icon={<Icon source={XIcon} />}
                        accessibilityLabel="Close promotion card"
                    />
                </InlineStack>
                <Box padding={200}>
                    <MediaCard description={description}>
                        <img
                            alt=""
                            width="100%"
                            height="100%"
                            style={{
                                objectFit: "contain",
                                objectPosition: "center",
                            }}
                            src={"/assets/images/mobile_app_promoV1.png"}
                        />
                    </MediaCard>
                </Box>
            </BlockStack>
        </Card>
    );
};

export default MobileAppPromo;