import { Box, InlineStack, Select, TextField } from "@shopify/polaris";
import { AppliedTo } from "../../utils/config";
import { useContext } from "react";
import { GlobalDataContext } from "./GlobalRulesComponent";
import GroupOptionComponent from "../Group/GroupOptionComponent";

export const RuleComponent = ({ item }) => {
    const groupDataArray = ['group', 'group-sku', 'group-product'];
    const { handleKeyUpdate, handleSettingDataUpdate, settingData } = useContext(GlobalDataContext);

    const handleAppliedToChange = (val) => {
        var groupdata = null;
        if (groupDataArray.includes(item?.applyTo) && !groupDataArray.includes(val)) {
            handleSettingDataUpdate(item?.uid, {
                group: item?.group
            });
        } else if (groupDataArray.includes(val) && !groupDataArray.includes(item?.applyTo)) {
            groupdata = {
                "field": "coll",
                "op": "e",
                "filter": []
            };
            if (settingData.hasOwnProperty(item?.uid) && settingData[item?.uid].hasOwnProperty('group')) {
                groupdata = settingData[item?.uid].group;
            }
        } else if (groupDataArray.includes(val) && groupDataArray.includes(item?.applyTo)) {
            handleKeyUpdate(item?.uid, {
                applyTo: val
            });
            return true;
        }
        handleKeyUpdate(item?.uid, {
            applyTo: val,
            group: groupdata
        });
    }

    const handleValueChange = (val, key) => {

        handleKeyUpdate(item?.uid, {
            [key]: val
        });
    }

    return (
        <Box padding={"150"} width="100%" minWidth="585px">
            <Box paddingBlockEnd={"100"}>
                <div className="inline-input">
                    <Select name="appliedto" options={AppliedTo} value={item?.applyTo || 'cart'} label="Applied to" onChange={handleAppliedToChange} />
                </div>
            </Box>
            <Box paddingBlockEnd={"100"}>
                <GroupOptionComponent item={item} />
            </Box>
            <Box paddingBlockEnd={"100"} width="calc(100% - 18px)">
                <InlineStack align="space-between" wrap={false}>
                    <div className="rule-input">
                        <TextField name="minimum" label="Minimum" type="number" id="min" inputMode="numeric" min={0} onChange={handleValueChange} value={item?.min} />
                    </div>
                    <div className="rule-input">
                        <TextField name="maximum" label="Maximum" type="number" id="max" inputMode="numeric" min={0} onChange={handleValueChange} value={item?.max} />
                    </div>
                    <div className="rule-input">
                        <TextField name="multiple" label="Multiple" type="number" id="multiple" inputMode="numeric" min={0} onChange={handleValueChange} value={item?.multiple} />
                    </div>
                </InlineStack>
            </Box>
            <Box paddingBlockEnd={"100"}>
                <div className="rule-input-full">
                    <TextField name="message" label="Message" type="text" id="message" onChange={handleValueChange} value={item?.message} placeholder="Error message displayed to the customer" />
                </div>
            </Box>
        </Box>
    );
}