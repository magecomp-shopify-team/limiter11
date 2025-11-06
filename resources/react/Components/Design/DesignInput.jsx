import { React, useState, useContext, } from "react";
import { TextField, Box, Card, InlineGrid, Text, Button, } from "@shopify/polaris";
import { DesignContext } from "../../Pages/customization";

const DesignInput = () => {

    const { designModal, setDesignModal } = useContext(DesignContext);

    if (!designModal) return <></>;

    const { fontSize, borderRadius, fontColor, bgColor, borderColor, zindex } = designModal;

    const handleChange = (key, value) => {
        setDesignModal((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <Card>
            <Text variant="headingMd">
                Customize the design and it will be displayed in the store.
            </Text>
            <Box padding={200} />
            <InlineGrid columns={2} gap="400">
                <TextField
                    label="Model color"
                    value={bgColor || '#ffffff'}
                    onChange={(value) => handleChange("bgColor", value)}
                    type="color"
                />
                <TextField
                    label="Border color"
                    value={borderColor || '#ffffff'}
                    onChange={(value) => handleChange("borderColor", value)}
                    type="color"
                />
                <TextField
                    label="Font color"
                    value={fontColor || '#808080'}
                    onChange={(value) => handleChange("fontColor", value)}
                    type="color"
                />
                <TextField
                    label="Font size"
                    value={fontSize}
                    onChange={(value) => handleChange("fontSize", value)}
                    type="number"
                    suffix="px"
                />
                <TextField
                    label="Border radius"
                    value={borderRadius}
                    onChange={(value) => handleChange("borderRadius", value)}
                    type="number"
                    suffix="px"
                />
                <TextField
                    label="Z-index"
                    value={zindex}
                    onChange={(value) => handleChange("zindex", value)}
                    type="number"
                    suffix="px"
                />
               
            </InlineGrid>
        </Card>
    );
}

export default DesignInput;