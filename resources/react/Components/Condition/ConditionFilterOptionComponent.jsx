import { BlockStack, Box, Button, Card, InlineStack, Link, Text, TextField } from "@shopify/polaris"
import { MenuHorizontalIcon } from "@shopify/polaris-icons"
import { useCallback, useMemo, useState } from "react"

export const ConditionFilterOptionComponent = ({ options, handleFilterChange }) => {
    const [openProductPicker, setOpenProductPicker] = useState(false);
    const [openCollectionPicker, setOpenCollectionPicker] = useState(false);

    const handleButtonClick = () => {
        if (options?.field == "coll") {
            setOpenCollectionPicker(true);
        } else if (options?.field == "product") {
            setOpenProductPicker(true);
        }
    }

    const initialData = useMemo(() => {
        if (options?.filter && typeof options?.filter == "object") {
            if (options?.field == "coll" || options?.field == "product") {
                const data = options?.filter?.map((it) => {
                    if (options?.field == "product") {
                        return {
                            id: `gid://shopify/Product/${it.id}`
                        }
                    } else {
                        return { id: `gid://shopify/Collection/${it?.id}` };
                    }
                }).filter(it => it.id !== null);
                return data;
            }
        }
        return [];
    }, [options]);

    const renderEmptyStateMessage = useMemo(() => {
        if (options?.filter?.length > 0) {
            return null;
        }
        var title = "product";
        if (options?.field == "coll") {
            title = "collection"
        }
        return (
            <Box paddingInline={"100"}>
                <Text>Please select any one {title}</Text>
            </Box>
        )
    }, [options?.field, options?.filter]);

    const optionFilters = useMemo(() => {
        if (options?.field == "coll" || options?.field == "product") {
            if (!options?.filter?.length) {
                return [];
            }
            if (['e', 'ne'].includes(options?.op)) {
                return [options?.filter[0]];
            }
            return [...options?.filter];
        }
        return [];
    }, [options]);

    const handleFilterTextChange = (val) => {
        if (!(options?.field == "coll" || options?.field == "product")) {
            handleFilterChange(val);
        }
    }

    const handleProductSelection = useCallback(async (initialIds = [], selectMultiple = false) => {
        try {
            const selected = await shopify.resourcePicker({
                type: 'product',
                filter: { variants: false },
                initialSelectionIds: initialIds,
                selectMultiple: selectMultiple,
            });

            if (selected?.selection && selected.selection.length > 0) {
                const simplifiedProducts = selected.selection.map((pr) => ({
                    id: pr.id.replace('gid://shopify/Product/', ''),
                    title: pr.title,
                    handle: pr.handle,
                }));

                handleFilterChange(simplifiedProducts);
                setSettingDataForKey('product', simplifiedProducts);
                setOpenProductPicker(false);
            }
        } catch (error) {
            console.error('Resource Picker closed or failed:', error);
        }
    }, []);

    const handleCollectionSelection = useCallback(async (initialIds = [], selectMultiple = false) => {

        try {
            const selected = await shopify.resourcePicker({
                type: 'collection',
                filter: { variants: false },
                initialSelectionIds: initialIds,
                selectMultiple: selectMultiple,
            });

            if (selected?.selection && selected.selection.length > 0) {
                const simplifiedCollections = selected.selection.map((col) => {
                    const colobj = {
                        id: col.id.replace('gid://shopify/Collection/', ''),
                        title: col.title,
                        handle: col.handle
                    };
                    return colobj;
                });

                handleFilterChange(newCol);
                setSettingDataForKey('coll', newCol);
                setOpenCollectionPicker(false);
            }
        } catch (error) {
            console.error('Resource Picker closed or failed:', error);
        }

    }, []);

    return (
        <Card padding={0}>
            {options?.field == "coll" || options?.field == "product" ?
                <InlineStack align="space-between">
                    <Box width="90%" paddingBlockStart={"100"}>
                        <BlockStack gap={"025"}>
                            {renderEmptyStateMessage}
                            {optionFilters?.map((item, index) => (
                                <Box paddingInline={"200"} paddingBlock={"100"} key={index}>
                                    <Link url="" target="_blank" >{item?.title}</Link>
                                </Box>
                            ))}
                        </BlockStack>
                    </Box>
                    <Box width="10%">
                        <InlineStack align="end" blockAlign="end">
                            <Button icon={MenuHorizontalIcon} onClick={handleButtonClick} />
                            {openProductPicker &&
                                handleProductSelection(
                                    !['e', 'ne'].includes(options?.op) ? initialData : [],
                                    !['e', 'ne'].includes(options?.op) ? true : false
                                )
                            }

                            {openCollectionPicker &&
                                handleCollectionSelection(
                                    !['e', 'ne'].includes(options?.op) ? initialData : [],
                                    !['e', 'ne'].includes(options?.op) ? true : false
                                )
                            }
                        </InlineStack>
                    </Box>
                </InlineStack>
                :
                <>
                    <TextField
                        value={options?.filter}
                        onChange={handleFilterTextChange}
                        autoComplete="off"
                        placeholder="Case-sensitive text or number to filter by"
                    />
                </>
            }
        </Card >
    )
}