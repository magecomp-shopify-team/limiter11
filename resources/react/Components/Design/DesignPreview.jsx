import { React, useContext, } from "react";
import { Box, Card, InlineStack, Text, Icon } from "@shopify/polaris";
import { DesignContext } from "../../Pages/customization";
import { ViewIcon, } from '@shopify/polaris-icons';

const DesignPreview = () => {
    const { designModal, setDesignModal } = useContext(DesignContext);

    if (!designModal) return null;

    console.log("data from Preview", designModal);
    const { fontSize, borderRadius, fontColor, bgColor, borderColor, zindex } = designModal;

    return (
        <Card sectioned>
            <InlineStack gap={100}>
                <Box>
                    <Icon source={ViewIcon} tone="base" />
                </Box>
                <Box>
                    <Text variant="headingMd">Preview</Text>
                </Box>
            </InlineStack>
            <div
                style={{
                    position: 'relative',
                    height: "250px",
                    width: "90%",
                    backgroundImage: `url(/assets/images/CartImage.png)`,
                    backgroundSize: '100% 100%',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    margin: '5px auto',
                }}
            >

                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10,
                        borderRadius: '8px',

                    }}
                >
                    <div
                        style={{

                            position: 'relative',
                            background: `${bgColor}` || '#ffffff',
                            padding: '20px',
                            borderRadius: `${borderRadius}px` || '10px',
                            width: '90%',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            textAlign: 'center',
                            border: `2px solid ${borderColor}`,
                            color: fontColor,
                            fontSize: `${fontSize}px` || 12,
                            zIndex: `${zindex}px` || 10,
                        }}
                    >

                        <button
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                fontSize: '18px',
                                cursor: 'pointer',
                            }}
                        >
                            ✕
                        </button>
                        <p>This error message will display.</p>
                    </div>
                </div>

            </div>
        </Card>
    );
}

export default DesignPreview;