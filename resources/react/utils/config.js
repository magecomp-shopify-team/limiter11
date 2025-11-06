export const Conditions = [
    {
        title: "Sub selection",
        options: [
            { label: "All Conditions", value: "[]" },
            { label: "Any Condition", value: "{}" },
        ]
    },
    { label: "Cart Contains", value: "cart-item-e" },
    { label: "Cart Doesn't Contain", value: "cart-item-ne" },
    { label: "Customer's Tag", value: "ctags" },
    { label: "Purchase Date", value: "time" },
    { label: "Cart Subtotal", value: "subtotal" }
];

export const TimebasedOption = [
    {
        label: "greater than",
        value: "g"
    },
    {
        label: "less than",
        value: "l"
    }
];

export const NumbarbasedOption = [
    {
        label: "equal to",
        value: "e"
    },
    {
        label: "not equal to",
        value: "ne"
    },
    {
        label: "greater than",
        value: "g"
    },
    {
        label: "less than",
        value: "l"
    },
    // {
    //     label: "between",
    //     value: "be"
    // }
];

export const AppliedTo = [
    {
        label: "cart as a whole",
        value: "cart"
    },
    {
        label: "any SKU in cart",
        value: "sku"
    },
    {
        label: "any product in cart",
        value: "product"
    },
    {
        label: "all belonging to the following group",
        value: "group"
    }
];

export const ConditionsOn = [
    { label: "Collection", value: "coll" },
    { label: "Price", value: "price" },
    { label: "Product", value: "product" },
    { label: "Product Tag", value: "ptag" },
    { label: "Product Title", value: "product_title" },
    { label: "Product Type", value: "product_type" },
    { label: "Product Handle", value: "handle" },
    { label: "Vendor", value: "vendor" },
    { label: "Variant Title", value: "variant_title" },
    { label: "SKU", value: "sku" },
    { label: "Weight in grams", value: "grams" }
];

const TextConditionsOption = [
    {
        label: "equal to",
        value: "e"
    },
    {
        label: "not equal to",
        value: "ne"
    },
    {
        label: "is one of",
        value: "oo"
    },
    {
        label: "not one of",
        value: "no"
    }
];

const ChooseConditionsOption = [
    {
        label: "is",
        value: "e"
    },
    {
        label: "is not",
        value: "ne"
    },
    {
        label: "is one of",
        value: "oo"
    },
    {
        label: "not one of",
        value: "no"
    }
];

export const getListOfOption = (op = 'coll') => {
    if (op == "coll" || op == "product" || op == "ctags") {
        return ChooseConditionsOption;
    }
    if (op == "price" || op == "grams" || op == "subtotal") {
        return NumbarbasedOption;
    }
    if (op == "time") {
        return TimebasedOption;
    }
    if (op == "{}" || op == "[]") {
        return [
            {
                label: "and",
                value: "and"
            },
            {
                label: "or",
                value: "or"
            }
        ]
    }
    return TextConditionsOption;
}


export const generateUID = () => {
    const timestamp = Date.now();
    return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, (c) => {
        const random = (Math.random() * 16) | 0;
        const value = c === 'x' ? random : (random & 0x3) | 0x8;
        return value.toString(16);
    }) + '-' + timestamp;
};

export const getNonEmbedBlockLink = (host, appUuid) => {
    return (`https://${atob(host)}/themes/current/editor?context=apps&template=index&activateAppId=${appUuid}/rule_base_limit`)
};