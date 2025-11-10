import { Page, Layout, Card, Box, Button } from "@shopify/polaris";
import GlobalRulesComponent from "../Components/RuleComponents/GlobalRulesComponent";
import { useState } from "react";
import AccessWarning from "../Components/AccessWarning/AccessWarning";
import Footer from "../Components/Footer/Footer";
import { NoteIcon } from '@shopify/polaris-icons';

export default function Rules() {

    const [isSubmit, setIsSubmit] = useState(false);
    const [loading, setLoading] = useState(false);

    const completeSubmitProcess = () => {
        setIsSubmit(false);
        setLoading(false);
    };

    return (
        <Page
            title="Rules"
            titleMetadata={
                <>
                    <Button target="_blank" url="https://magecomp.gitbook.io/shopify/apps/limiter-order-limits/rules" icon={NoteIcon} variant="monochromePlain" size="large" />
                </>
            }
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

                    <Footer />
                </Layout.Section>
            </Layout>
        </Page>
    );
}
