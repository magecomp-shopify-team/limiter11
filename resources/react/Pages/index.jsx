import { Page, Layout, Card, Box } from "@shopify/polaris";
import { Onboard } from "../Components/Onboard/Onboard";
import { Documentation } from "../Components/Documentation/Documentation";
import { HelpBox } from "../Components/HelpBox/HelpBox";

export default function HomePage() {
    return (
        <Page>
            <Layout>
                <Layout.Section>
                    <Onboard />
                    <HelpBox title={"How It Works"}>
                        <p>
                            The app works by checking and enforcing predefined
                            purchase limits on products, variants, and
                            collections within the customer’s cart. First,
                            create a rule in the app that defines these limits
                            and ensures the app extension is enabled in your
                            Shopify store to apply them. When a customer adds
                            items to their cart, the app checks each product,
                            variant, or collection against these rules. Limits
                            can be customized based on customer tags, allowing
                            different limits for various customer groups, or by
                            setting active periods using date and time
                            conditions. For instance, the app can limit VIP
                            customers to a maximum quantity of premium products
                            or restrict the purchase of certain items during
                            promotional periods only. The app dynamically
                            enforces these limits at checkout, ensuring each
                            customer's cart complies with your defined rules.
                        </p>
                    </HelpBox>
                    <Documentation />
                </Layout.Section>
            </Layout>
        </Page>
    );
}
