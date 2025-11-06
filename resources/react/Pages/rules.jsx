import { Page, Layout, Card, Box } from "@shopify/polaris";
import GlobalRulesComponent from "../Components/RuleComponents/GlobalRulesComponent";
import { useState } from "react";
import AccessWarning from "../Components/AccessWarning/AccessWarning";

export default function Rules() {

    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(false);

    const completeSubmitProcess = () => {
        setIsSubmit(false);
        setLoading(false);
    };

    return (
        <Page
            title="Rule Limit Qty"
        >
            <Layout>
                <Layout.Section>
                    <Card>
                        <AccessWarning notInFree>
                            <GlobalRulesComponent
                                onDone={completeSubmitProcess}
                                setLoading={setLoading}
                                loading={loading}
                            />
                        </AccessWarning>
                    </Card>
                </Layout.Section>
            </Layout>
        </Page>
    );
}
