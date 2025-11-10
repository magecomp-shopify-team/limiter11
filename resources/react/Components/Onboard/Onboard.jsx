import {
    Box,
    Button,
    Card,
    Collapsible,
    Grid,
    Icon,
    InlineStack,
    Text,
    Badge,
    useBreakpoints,
} from "@shopify/polaris";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    StatusActiveIcon,
    XIcon,
} from "@shopify/polaris-icons";
import { useEffect, useState } from "react";
import { fetchApi } from "../../utils/api";
import { themeAppUrl } from "../../app";
import AccessWarning from "../AccessWarning/AccessWarning";

export const Onboard = () => {
    const { mdDown } = useBreakpoints();
    const [open, setOpen] = useState(true);
    const [appStatus, setAppStatus] = useState();

    const handleOnboardOpen = () => {
        setOpen((op) => !op);
    };

    const getAppStatus = async () => {
        try {
            const res = await fetchApi("POST", `/api/get-app-status`, {})

            if (res?.status == 1) {
                setAppStatus(res.appStatus);
            }
            else {
                setAppStatus(0);
            }
        }
        catch (error) {
            console.error("Request failed:", error);
        }

    };

    useEffect(() => {
        getAppStatus();
    }, []);

    return (
        <Box paddingBlockEnd={"200"}>
            <Card>
                <InlineStack align="space-between" blockAlign="center">
                    <Box>
                        <Text variant="headingMd" as="h4">
                            Quick start
                        </Text>
                    </Box>
                    <Box>
                        {/* <Button variant="tertiary" size="micro">
                            <Icon source={XIcon} />
                        </Button> */}
                        <Button
                            variant="tertiary"
                            size="micro"
                            ariaExpanded={open}
                            onClick={handleOnboardOpen}
                        >
                            <Icon
                                source={open ? ChevronUpIcon : ChevronDownIcon}
                            />
                        </Button>
                    </Box>
                </InlineStack>
                <Collapsible
                    open={open}
                    id="basic-collapsible"
                    transition={{
                        duration: "500ms",
                        timingFunction: "ease-in-out",
                    }}
                    expandOnPrint
                >
                    <Grid>
                        <Grid.Cell
                            columnSpan={{
                                xs: 6,
                                sm: 6,
                                md: 4,
                                lg: 8,
                                xl: 8,
                            }}
                        >
                            <Box paddingBlock={"200"}>
                                <InlineStack align="start">
                                    <Button variant="tertiary">
                                        <Icon source={StatusActiveIcon} />
                                    </Button>
                                    <Box>
                                        <InlineStack>
                                            <Text variant="headingMd" as="h4">
                                                Activate App
                                            </Text>
                                            <Box paddingInlineStart={100}>
                                                <Badge
                                                    tone={
                                                        appStatus
                                                            ? "success"
                                                            : "attention"
                                                    }>
                                                    {appStatus ? "On" : "Off"}
                                                </Badge>
                                            </Box>
                                        </InlineStack>
                                        <Text variant="bodySm">
                                            Turn on the app to make it visible in your store
                                        </Text>
                                        <InlineStack paddingBlockStart={"200"}>
                                            <Button
                                                variant={
                                                    appStatus
                                                        ? "secondary"
                                                        : "primary"
                                                }
                                                url={themeAppUrl}
                                                size="slim"
                                                tone={appStatus ? "critical" : null}
                                                target="_blank"
                                            >
                                                {appStatus ? "Disable" : "Enable"}
                                            </Button>

                                        </InlineStack>
                                    </Box>
                                </InlineStack>
                            </Box>
                            <AccessWarning>
                                <Box paddingBlock={"200"}>
                                    <InlineStack align="start">
                                        <Button variant="tertiary">
                                            <Icon source={StatusActiveIcon} />
                                        </Button>
                                        <Box>
                                            <Text variant="headingMd" as="h4">
                                                Create your first limit
                                            </Text>
                                            <Text variant="bodySm">
                                                Create the first rule to set limits on products, collections, and other items.
                                            </Text>
                                            <Button
                                                variant="primary"
                                                size="slim"
                                                url={"/rules?q=initialRule"}
                                            >
                                                Add rule
                                            </Button>
                                        </Box>
                                    </InlineStack>
                                </Box>
                            </AccessWarning>

                        </Grid.Cell>
                        {!mdDown ?
                            <Grid.Cell
                                columnSpan={{
                                    xs: 6,
                                    sm: 6,
                                    md: 2,
                                    lg: 4,
                                    xl: 4,
                                }}
                            >
                                <img
                                    src={"/assets/images/app-getting-Image.png"}
                                    alt="getting started"
                                    width="100%"
                                    height="auto"
                                />
                            </Grid.Cell> : <></>}
                    </Grid>
                </Collapsible>
            </Card>
        </Box>
    );
};
