import { Box, InlineStack, Select, Text } from "@shopify/polaris";
import { AppliedTo, Conditions } from "../../utils/config";
import { createContext, useContext } from "react";
import { GlobalDataContext } from "../RuleComponents/GlobalRulesComponent";
import ConditionalOptionComponent from "./ConditionalOptionComponent";
import CommonConditionComponent from "./CommonConditionComponent";

export const ConditionContext = createContext({
    handleRootConditionChange: function (object) {}
});

const ConditionComponent = ({ item }) => {
    const { handleKeyUpdate } = useContext(GlobalDataContext);
    const handleRootConditionChange = (options) => {
        handleKeyUpdate(item?.uid, {
            condition: {
                ...item?.condition,
                ...options
            }
        });
    }

    const ConditionContextValue = {
        handleRootConditionChange
    }

    return (
        <Box paddingBlock={"100"} minWidth="550px">
            <ConditionContext.Provider value={ConditionContextValue}>
                <CommonConditionComponent
                    condition={item?.condition}
                    index="root"
                />
            </ConditionContext.Provider>
        </Box>
    )
}

export default ConditionComponent;