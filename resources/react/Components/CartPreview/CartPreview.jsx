import { Banner, BlockStack, Box, Button, ButtonGroup, Card, Divider, Icon, InlineStack, Text, TextField, Thumbnail } from "@shopify/polaris";
import { useContext, useEffect, useMemo, useState } from "react";
import { PlusIcon, MinusIcon, ViewIcon, XIcon } from '@shopify/polaris-icons';
import { DesignContext } from "../../Pages/customization";

const CartPreview = ({
    weightInKg,
    isAmount,
    isWeight,
    isQty,
    currencyFormate,
    minAmount,
    maxAmount,
    minAmountMsg,
    maxAmountMsg,
    minWeight,
    maxWeight,
    minWeightMsg,
    maxWeightMsg,
    minQty,
    maxQty,
    minQtyMsg,
    maxQtyMsg
}) => {
    const { t } = { t: (v) => v };
    const [show, setShow] = useState(false);
    const [isCheckout, setIsCheckout] = useState(false);

    const { designModal, setDesignModal } = useContext(DesignContext);

    if (!designModal) return null;

    const { fontSize, borderRadius, fontColor, bgColor, borderColor, zindex } = designModal;

    const [products, setProducts] = useState([
        {
            id: 1,
            title: "Headphones",
            qty: 1,
            amount: 10,
            image: "/assets/images/Wireless Headphones.webp",
            weight: 250, // weight in gram
        },
        {
            id: 2,
            title: "Smart phone",
            qty: 3,
            amount: 1000,
            image: "/assets/images/mobile.webp",
            weight: 500, // weight in gram
        }
    ]);

    const handleQty = (index, newqty) => {
        const items = [...products];
        items[index].qty = newqty < 0 ? 0 : newqty;
        setProducts(items);
    }

    const total = useMemo(() => {
        return products.reduce((acc, item) => {
            acc.qty += item.qty;
            acc.amount += (item.amount * item.qty);
            acc.weight += (item.weight * item.qty);
            return acc;
        }, { qty: 0, amount: 0, weight: 0 });
    }, [products]);

    const [alertMessage, showAlert] = useMemo(() => {
        const message = [];
        let show = false;
        if (isAmount) {
            if (minAmount && total.amount < minAmount) {
                show = true;
                let msg = minAmountMsg.replaceAll('{%-min_amount-%}', `${currencyFormate} ${minAmount}`);
                message.push(msg);
            }
            if (maxAmount && total.amount > maxAmount) {
                show = true;
                let msg = maxAmountMsg.replaceAll('{%-max_amount-%}', `${currencyFormate} ${maxAmount}`);
                message.push(msg);
            }
        }
        if (isQty) {
            if (minQty && total.qty < minQty) {
                show = true;
                let msg = minQtyMsg.replaceAll('{%-limit-%}', `${minQty}`);
                message.push(msg);
            }
            if (maxQty && total.qty > maxQty) {
                show = true;
                let msg = maxQtyMsg.replaceAll('{%-limit-%}', `${maxQty}`);
                message.push(msg);
            }
        }
        if (isWeight) {
            if (minWeight) {
                const minWeightInGram = weightInKg ? minWeight * 1000 : minWeight;
                if (total.weight < minWeightInGram) {
                    show = true;
                    let msg = minWeightMsg.replaceAll('{%-min_weight-%}', `${minWeight}${weightInKg ? 'kg' : 'g'}`);
                    message.push(msg);
                }
            }
            if (maxWeight) {
                const maxWeightInGram = weightInKg ? maxWeight * 1000 : maxWeight;
                if (total.weight > maxWeightInGram) {
                    show = true;
                    let msg = maxWeightMsg.replaceAll('{%-max_weight-%}', `${maxWeight}${weightInKg ? 'kg' : 'g'}`);
                    message.push(msg);
                }
            }
        }
        return [message, show];
    }, [total, isAmount, isWeight, isQty,
        minAmount, maxAmount, minWeight, maxWeight, minQty, maxQty,
        minWeightMsg, maxWeightMsg, minQtyMsg, maxQtyMsg, maxAmountMsg, minAmountMsg, currencyFormate
    ]);

    useEffect(() => {
        if (showAlert) {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [showAlert]);

    useEffect(() => {
        if (isCheckout) {
            setTimeout(() => {
                setIsCheckout(false);
            }, 3000);
        }
    }, [isCheckout]);

    const handleCheckout = () => {
        if (showAlert) {
            setShow(true);
        } else {
            setIsCheckout(true);
        }
    }


    return (
        <Card>
            <Box paddingBlockEnd={"400"}>
                <InlineStack>
                    <Box width="25px">
                        <Icon source={ViewIcon} />
                    </Box>
                    <Box>
                        <Text as="h5" variant="headingMd">Cart preview</Text>
                        <Text as="p" variant="bodyMd" tone="magic">Minimum limit: 2 & Maximum limit: 3</Text>
                    </Box>
                </InlineStack>
            </Box>

            <div style={{ position: "relative" }}>
                <Box>
                    {isCheckout &&
                        <Banner tone="success">
                            <Text as="p" variant="bodyMd">Order placed</Text>
                        </Banner>}
                    {products.map((item, index) => (
                        <Box key={item.id} paddingBlock={"200"}>
                            <Box paddingBlock={"200"}>
                                <InlineStack gap={"200"}>
                                    <Box width="25%" paddingInline={"100"}>
                                        <Thumbnail source={item.image} />
                                    </Box>
                                    <Box width="65%">
                                        <Text as="p" variant="bodyLg">{item.title} <Text as="span" variant="bodyMd">({weightInKg ? (item.weight / 1000) + 'kg' : item.weight + 'g'})</Text></Text>
                                        <InlineStack align="space-between">
                                            <Text as="p">${item.amount}</Text>
                                            <Box borderColor="border-tertiary" borderWidth="050" width="max-content">
                                                <ButtonGroup variant="segmented">
                                                    <Button icon={MinusIcon} size="slim" variant="" onClick={() => handleQty(index, item.qty - 1)} />
                                                    <Box width="40px">
                                                        <Text as="span" tone="base" variant="bodyMd" alignment="center">{item?.qty}</Text>
                                                    </Box>
                                                    <Button icon={PlusIcon} size="slim" variant="" onClick={() => handleQty(index, item.qty + 1)} />
                                                </ButtonGroup>
                                            </Box>
                                        </InlineStack>
                                    </Box>
                                </InlineStack>
                            </Box>
                            <Box paddingBlockStart={"200"}>
                                <Divider />
                            </Box>
                        </Box>
                    ))}
                    <Box width="100%" paddingBlock={"300"}>
                        <BlockStack align="end" gap={"200"}>
                            {isAmount &&
                                <Text alignment="end" as="p" variant="bodyLg">Cart total: <strong>${total.amount}</strong></Text>}
                            {isWeight &&
                                <Text alignment="end" as="p" variant="bodyLg">Cart total weight: <strong>{weightInKg ? (total.weight / 1000) + 'kg' : total.weight + 'g'}</strong></Text>}
                            {isQty &&
                                <Text alignment="end" as="p" variant="bodyLg">Cart total quantities: <strong>{total.qty}</strong></Text>}
                            <Box paddingBlockStart={"150"}>
                                <Button variant="primary" fullWidth disabled={isCheckout} onClick={handleCheckout}>{isCheckout ? <>Order placed</> : <>Checkout</>}</Button>
                            </Box>
                        </BlockStack>
                    </Box>
                </Box>



                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: show ? 'flex' : 'none',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 10,
                        borderRadius: '8px',
                    }}
                >
                    <div style={{ position: "absolute", width: '100%', height: "100%", background: "grey", opacity: "0.3" }}></div>
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
                                color: fontColor,
                            }}
                            onClick={() => setShow(false)}
                        >
                            ✕
                        </button>
                        {alertMessage.map((msg, i) => <p key={i}>{msg}</p>)}
                    </div>
                </div>

            </div>
        </Card>
    )
}

export default CartPreview;
