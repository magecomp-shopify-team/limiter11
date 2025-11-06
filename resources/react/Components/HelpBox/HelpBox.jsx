import {
    Box,
    Card,
    Collapsible,
    Icon,
    InlineStack,
    Text,
} from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";
import { useState } from "react";

export const HelpBox = ({ title, children }) => {
    const [open, setOpen] = useState(false);
    return (
        <Box paddingBlockEnd={"200"}>
            <Card>
                <div
                    role="button"
                    onClick={() => setOpen((open) => !open)}
                    style={{ cursor: "pointer" }}
                >
                    <InlineStack align="space-between">
                        <Text variant="headingMd" as="h2">
                            {title}
                        </Text>
                        <Box>
                            <Icon
                                source={open ? ChevronUpIcon : ChevronDownIcon}
                            />
                        </Box>
                    </InlineStack>
                </div>
                <Collapsible open={open}>
                    <Box paddingInline={"200"} paddingBlock={"100"}>
                        {children}
                    </Box>
                </Collapsible>
            </Card>
        </Box>
    );
};
