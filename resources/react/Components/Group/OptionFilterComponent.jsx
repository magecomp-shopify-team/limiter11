import { BlockStack, Box, Button, Card, InlineStack, Link, Text, TextField, } from "@shopify/polaris";
import { MenuHorizontalIcon } from "@shopify/polaris-icons";
import { useCallback, useContext, useMemo } from "react";
import { GlobalDataContext } from "../RuleComponents/GlobalRulesComponent";

export const OptionFilterComponent = ({ options, uid, handleFilterChange }) => {
    const { handleSettingDataUpdate } = useContext(GlobalDataContext);

    const setSettingDataForKey = (key, val) => {
        handleSettingDataUpdate(uid, { [key]: val });
    };

    const initialData = useMemo(() => {
        if (!options?.filter || typeof options?.filter !== "object") return [];
        if (options?.field !== "coll" && options?.field !== "product") return [];

        return options.filter
            .map((it) =>
                options.field === "product"
                    ? { id: `gid://shopify/Product/${it.id}` }
                    : { id: `gid://shopify/Collection/${it.id}` }
            )
            .filter(Boolean);
    }, [options]);

    const renderEmptyStateMessage = useMemo(() => {
        if (options?.filter?.length > 0) return null;

        const title = options?.field === "coll" ? "collection" : "product";
        return (
            <Box paddingInline="100">
                <Text>Please select any one {title}</Text>
            </Box>
        );
    }, [options?.field, options?.filter]);

    const handleFilterTextChange = (val) => {
        if (options?.field === "coll" || options?.field === "product") return;
        handleFilterChange(val);
        setSettingDataForKey(options?.field, val);
    };

    const openResourcePicker = useCallback(
        async (type) => {
            try {
                const selected = await shopify.resourcePicker({
                    type,
                    filter: { variants: false },
                    multiple: !['e', 'ne'].includes(options?.op),
                });

                if (selected?.selection?.length > 0) {
                    const simplified = selected.selection.map((item) => ({
                        id: item.id.replace(
                            `gid://shopify/${type === "product" ? "Product" : "Collection"}/`,
                            ""
                        ),
                        title: item.title,
                        handle: item.handle,
                    }));

                    handleFilterChange(simplified);
                    setSettingDataForKey(type === "product" ? "product" : "coll", simplified);
                }
            } catch (error) {
                console.error("Resource Picker closed or failed:", error);
            }
        },
        [options, initialData, handleFilterChange]
    );

    const optionFilters = useMemo(() => {
        if (options?.field !== "coll" && options?.field !== "product") return [];
        if (!options?.filter?.length) return [];
        return ["e", "ne"].includes(options?.op)
            ? [options.filter[0]]
            : [...options.filter];
    }, [options]);

    return (
        <Card padding={0}>
            {options?.field === "coll" || options?.field === "product" ? (
                <InlineStack align="space-between">
                    <Box width="90%" paddingBlockStart="100">
                        <BlockStack gap="025">
                            {renderEmptyStateMessage}
                            {optionFilters.map((item, index) => (
                                <Box paddingInline="200" paddingBlock="100" key={index}>
                                    <Link url="" target="_blank">
                                        {item?.title}
                                    </Link>
                                </Box>
                            ))}
                        </BlockStack>
                    </Box>
                    <Box width="10%">
                        <InlineStack align="end" blockAlign="end">
                            <Button
                                icon={MenuHorizontalIcon}
                                onClick={() => openResourcePicker(options?.field === "coll" ? "collection" : "product")}
                            />
                        </InlineStack>
                    </Box>
                </InlineStack>
            ) : (
                <TextField
                    value={options?.filter}
                    onChange={handleFilterTextChange}
                    autoComplete="off"
                    placeholder="Case-sensitive text or number to filter by"
                />
            )}
        </Card>
    );
};
