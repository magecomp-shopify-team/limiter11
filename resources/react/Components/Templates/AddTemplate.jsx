import { ActionList, Box, Button, ButtonGroup, Icon, InlineStack, Popover, Select } from "@shopify/polaris";
import { useCallback, useContext, useState } from "react";
import { GlobalDataContext } from "../RuleComponents/GlobalRulesComponent";
import { CartIcon, ChevronDownIcon, CollectionIcon, PriceListIcon, ProductIcon, ProductListIcon, VariantIcon } from "@shopify/polaris-icons";

const ruteLimitItem = {
    uid: null,
    type: "limit",
    applyTo: "cart",
    message: "",
    group: {
        field: "price",
        op: "e",
        filter: "200",
    },
    minOn: true,
    min: 1,
    maxOn: true,
    max: 1,
    multipleOn: true,
    multiple: 1,
};

const AddTemplate = () => {
    const [active, setActive] = useState(false);

    const { addNewRuleItem, addNewConditionItem } = useContext(GlobalDataContext);

    const handleAddButton = (template = null) => {
        let dataItem = { ...ruteLimitItem };
        if (!template) {
            addNewRuleItem("root");
            return true;
        }
        if (template == 'cart-limit') {
            let item = { ...dataItem, applyTo: "cart" };
            addNewRuleItem('root', item);
        }
        if (template == "variant-limit") {
            let item = { ...dataItem, applyTo: "sku" };
            addNewRuleItem('root', item);
        }
        if (template == "each-product-limit") {
            let item = { ...dataItem, applyTo: "product" };
            addNewRuleItem('root', item);
        }
        if (template == "spec-product-limit") {
            let item = { ...dataItem, applyTo: "group", group: { field: "product", op: "e", filter: [] } };
            addNewRuleItem('root', item);
        }
        if (template == "spec-collection-limit") {
            let item = { ...dataItem, applyTo: "group", group: { field: "coll", op: "e", filter: [] } };
            addNewRuleItem('root', item);
        }
        if (template == "price-qty-limit") {
            let item = { ...dataItem, applyTo: "group", group: { field: "price", op: "e", filter: "200" } };
            addNewRuleItem('root', item);
        }
        setActive(false);
    }



    const toggleActive = useCallback(() => setActive((active) => !active), []);

    const activator = (
        <Button onClick={toggleActive} variant="primary" size="micro">
            <Icon source={ChevronDownIcon} />
        </Button>
    );
    return (
        <InlineStack gap={"150"}>
            <ButtonGroup variant="segmented">
                <Button variant="primary" onClick={() => handleAddButton()}>
                    Add rule
                </Button>
                <Popover
                    active={active}
                    activator={activator}
                    autofocusTarget="first-node"
                    onClose={toggleActive}
                >
                    <ActionList
                        actionRole="menuitem"
                        items={[
                            {
                                content: 'Cart limit',
                                icon: CartIcon,
                                onAction: () => handleAddButton('cart-limit')
                            },
                            {
                                content: 'Variant limit',
                                icon: VariantIcon,
                                onAction: () => handleAddButton('variant-limit')
                            },
                            {
                                content: 'Each product limit',
                                icon: ProductListIcon,
                                onAction: () => handleAddButton('each-product-limit')
                            },
                            {
                                content: 'Specific product limit',
                                icon: ProductIcon,
                                onAction: () => handleAddButton('spec-product-limit')
                            },
                            {
                                content: 'Specific collection limit',
                                icon: CollectionIcon,
                                onAction: () => handleAddButton('spec-collection-limit')
                            },
                            {
                                content: 'Price based qty limit',
                                icon: PriceListIcon,
                                onAction: () => handleAddButton('price-qty-limit')
                            }

                        ]}
                    />
                </Popover>
            </ButtonGroup>
            <Button
                variant="secondary"
                onClick={() => addNewConditionItem("root")}
            >
                Add condition
            </Button>
        </InlineStack>
    )
}

export default AddTemplate;
