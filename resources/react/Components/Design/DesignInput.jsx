import { React, useState, useContext, } from "react";
import { TextField, Box, Card, InlineGrid, Text, Button, } from "@shopify/polaris";
import { DesignContext } from "../../Pages/customization";
import McColorPicker from "../McColorPicker/McColorPicker";

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
                Adjust how the limit message looks on your storefront.
            </Text>
            <Box padding={200} />
            <InlineGrid columns={2} gap="400">
                <McColorPicker
                    label={"Model color"}
                    color={bgColor || '#ffffff'}
                    setColor={(value) => handleChange("bgColor", value)}
                    width="100%"
                />
                <McColorPicker
                    label="Border color"
                    color={borderColor || '#ffffff'}
                    setColor={(value) => handleChange("borderColor", value)}
                    width="100%"
                />
                <McColorPicker
                    label="Font color"
                    color={fontColor || '#ffffff'}
                    setColor={(value) => handleChange("fontColor", value)}
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