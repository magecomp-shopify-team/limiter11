import React, { useEffect } from "react";
import { useState, createContext } from "react";
import { Page, Grid, Badge, Layout } from "@shopify/polaris";
import DesignInput from "../Components/Design/DesignInput";
import DesignPreview from "../Components/Design/DesignPreview";
import { deepEqual, fetchApi } from "../utils/api";
import { SaveBar, useAppBridge } from '@shopify/app-bridge-react';
import AccessWarning from "../Components/AccessWarning/AccessWarning";
import CartPreview from "../Components/CartPreview/CartPreview";
import Footer from "../Components/Footer/Footer";

const designDefaultData = {
    fontSize: "15",
    borderRadius: "1",
    fontColor: "#000000",
    bgColor: "#fff",
    borderColor: "#d1d1d1",
    zindex: "1000",
};

export const DesignContext = createContext(designDefaultData);

const Customization = () => {
    const shopify = useAppBridge();
    const [loading, setLoading] = useState(false);
    const [designModal, setDesignModal] = useState([]);
    const [oldDesignData, setOldDesignData] = useState([]);

    const getDesign = async () => {
        try {
            const res = await fetchApi("POST", "/api/design/get", {});
            if (res?.status == 1) {
                const newData = {
                    fontSize: res.modelDesign.font_size || designDefaultData.fontSize,
                    borderRadius: res.modelDesign.border_radius || designDefaultData.borderRadius,
                    fontColor: res.modelDesign.model_font_color || designDefaultData.fontColor,
                    bgColor: res.modelDesign.model_color || designDefaultData.bgColor,
                    borderColor: res.modelDesign.model_border_color || designDefaultData.borderColor,
                    zindex: res.modelDesign.model_z_index || designDefaultData.zindex,
                };
                setDesignModal(newData);
                setOldDesignData(newData);
            } else {
                console.log("Design not found");
                setDesignModal(designDefaultData);
                setOldDesignData(designDefaultData);
            }
        }
        catch (error) {
            console.error("Request failed:", error);
        }
    }
    useEffect(() => {
        getDesign();
    }, []);

    useEffect(() => {
        if (!deepEqual(designModal, oldDesignData)) {
            shopify.saveBar.show("design-data");
        }
    }, [designModal, oldDesignData]);

    const saveDesign = async () => {
        setLoading(true);
        try {
            const res = await fetchApi("POST", "/api/design/save", { body: { designModal: designModal } });

            if (res?.status == 1) {
                shopify.toast.show("Customization Saved");
                setLoading(false);
                shopify.saveBar.hide("design-data");
            } else {
                console.log("Error saving data:", res);
                shopify.saveBar.hide("design-data");
                setLoading(false);
            }
        }
        catch (error) {
            console.error("Request failed:", error);
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        setOldDesignData(designModal);
        saveDesign();
    };

    const handleDiscard = () => {
        setDesignModal(oldDesignData);
        shopify.saveBar.hide("design-data");
    };

    return (
        <Page
            title="Customization"
        >
            <SaveBar id="design-data">
                <button variant="primary" onClick={handleSubmit}></button>
                <button onClick={handleDiscard}></button>
            </SaveBar>
            <Layout>
                <Layout.Section>
                    <AccessWarning>
                        <DesignContext.Provider value={{ designModal, setDesignModal }}>
                            <Layout>
                                <Layout.Section variant="oneThird">
                                    <DesignInput />
                                </Layout.Section>
                                <Layout.Section variant="oneHalf">
                                    <CartPreview isQty={true} minQty={2} maxQty={3} maxQtyMsg={"You can not purchase more then qty"} minQtyMsg={"You need to purchase more then qty"} />
                                </Layout.Section>
                            </Layout>
                            {/* <Grid>
                                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 4, xl: 6 }}>
                                </Grid.Cell>
                                <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 8, xl: 6 }}>
                                    <CartPreview isQty={true} minQty={2} maxQty={3} maxQtyMsg={"You can not purchase more then qty"} minQtyMsg={"You need to purchase more then qty"} />
                                </Grid.Cell>
                            </Grid> */}
                        </DesignContext.Provider>
                    </AccessWarning>

                    <Footer />
                </Layout.Section>
            </Layout>
        </Page >
    )
}

export default Customization;
