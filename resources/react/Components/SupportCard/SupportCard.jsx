import { BlockStack, Box, Button, Card, Divider, Icon, InlineStack, Text } from "@shopify/polaris";
import { Link } from "react-router-dom";
import {
    AppExtensionIcon,
    EmailIcon,
    ChatIcon,
    QuestionCircleIcon,
    NoteIcon
} from '@shopify/polaris-icons';

const SupportCard = () => {
    return (
        <Card>
            <BlockStack gap={"150"}>
                <Text as="h3" variant="headingMd">Resources</Text>
                <Box paddingBlockStart="300">
                    <Box padding={"400"} borderWidth="025" borderColor="border-inverse-active" borderRadius="100" >
                        <BlockStack gap={"200"}>
                            <InlineStack align="space-between"  blockAlign="center">
                                <Link to={"https://magecomp.gitbook.io/shopify/apps/limiter-order-limits"}  target="_blank" title="Skype" style={{ textDecoration: "none" }}>
                                    <InlineStack gap={"100"}>
                                        <Box>
                                            <Icon tone="base" source={NoteIcon} />
                                        </Box>
                                        <Box>
                                            <Text tone="base" as="p" variant="bodyMd">App guideline</Text>
                                        </Box>
                                    </InlineStack>
                                </Link>
                                <Button url="https://magecomp.gitbook.io/shopify/apps/limiter-order-limits" target="_blank">Get doc</Button>
                            </InlineStack>

                            <Divider borderColor="border-brand" />

                            <InlineStack align="space-between" blockAlign="center">
                                <Link to={'mailto:support@magecomp.com'} target="_blank" title="Mail" style={{ textDecoration: "none" }}>
                                    <InlineStack gap={"100"}>
                                        <Box>
                                            <Icon tone="base" source={EmailIcon} />
                                        </Box>
                                        <Box>
                                            <Text tone="base" as="p" variant="bodyMd">Contact email</Text>
                                        </Box>
                                    </InlineStack>
                                </Link>
                                <Button url={'mailto:support@magecomp.com'} target="_blank">Connect</Button>
                            </InlineStack>
                            <Divider borderColor="border-brand" />

                            <InlineStack align="space-between" blockAlign="center">
                                <Link to={'https://api.whatsapp.com/send?phone=+917990250277'} target="_blank" title="Whastapp" style={{ textDecoration: "none" }}>
                                    <InlineStack gap={"100"}>
                                        <Box>
                                            <Icon tone="base" source={ChatIcon} />
                                        </Box>
                                        <Box>
                                            <Text tone="base" as="p" variant="bodyMd">WhatsApp</Text>
                                        </Box>
                                    </InlineStack>
                                </Link>
                                <Button url={'https://api.whatsapp.com/send?phone=917990250277'} target="_blank">Chat with us</Button>
                            </InlineStack>
                            <Divider borderColor="border-brand" />

                            <InlineStack align="space-between"  blockAlign="center">
                                <Link to={'https://mageshopapps.freshdesk.com/support/tickets/new'} target="_blank" title="Ticket" style={{ textDecoration: "none" }}>
                                    <InlineStack gap={"100"}>
                                        <Box>
                                            <Icon tone="base" source={QuestionCircleIcon} />
                                        </Box>
                                        <Box>
                                            <Text tone="base" as="p" variant="bodyMd">Developer support</Text>
                                        </Box>
                                    </InlineStack>
                                </Link>
                                <Button url={'https://mageshopapps.freshdesk.com/support/tickets/new'} target="_blank">Get support</Button>
                            </InlineStack>

                        </BlockStack>
                    </Box>
                </Box>
            </BlockStack>
        </Card >
    )
}

export default SupportCard;