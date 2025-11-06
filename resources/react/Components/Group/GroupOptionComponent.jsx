import { Box, InlineStack, Select, } from "@shopify/polaris";
import { ConditionsOn, getListOfOption } from "../../utils/config";
import { useCallback, useContext, useMemo } from "react";
import { GlobalDataContext } from "../RuleComponents/GlobalRulesComponent";
import { OptionFilterComponent } from "./OptionFilterComponent";

const GroupOptionComponent = ({ item }) => {
    const { handleKeyUpdate, settingData } = useContext(GlobalDataContext);

    const oldData = useMemo(() => {
        if (!item?.uid) {
            return {};
        }
        if (settingData.hasOwnProperty(item.uid)) {
            return settingData[item.uid];
        }
        return {};
    }, [settingData, item?.uid]);


    const handleGroupChange = (key, val) => {
        const newGroup = {
            ...item?.group,
            [key]: val
        };
        if (key == "field") {
            let filterData = null;
            if (oldData.hasOwnProperty(val)) {
                filterData = oldData[val];
            }
            const opt = getListOfOption(val);
            const hasOpt = opt.some((it) => it.value === group.op);
            if (!hasOpt) {
                newGroup.op = opt[0].value;
            }
            if (val == "coll" || val == "product") {
                newGroup.filter = filterData ? [...filterData] : [];
            } else {
                newGroup.filter = filterData ? filterData : "";
            }
        }
        handleKeyUpdate(item?.uid, {
            group: newGroup
        });
    }

    const handleConditionOnChange = (val) => {
        handleGroupChange("field", val);
    }

    const handleOprationChange = (val) => {
        handleGroupChange("op", val);
    }

    const group = useMemo(() => {
        return { ...item?.group } || {};
    }, [item]);

    const handleFilterChange = useCallback((val) => {
        if (group?.field == "coll" || group?.field == "product") {
            handleGroupChange("filter", [...val]);
        } else {
            handleGroupChange("filter", val);
        }
    }, [group]);

    if (!['group', 'group-sku', 'group-product'].includes(item?.applyTo)) {
        return null;
    }

    return (
        <InlineStack>
            <Box>
                <div className="rule-input rule-group">
                    <Select options={ConditionsOn} label="Group by" name="field" onChange={handleConditionOnChange} value={group?.field} />
                </div>
            </Box>
            <Box paddingInlineStart={"200"}>
                <div className="rule-input rule-group">
                    <Select options={getListOfOption(group?.field)} name="op" onChange={handleOprationChange} value={group?.op} />
                </div>
            </Box>
            <Box paddingInlineStart={"100"} width="calc(100% - 360px)">
                <OptionFilterComponent options={group} oldData={oldData} uid={item?.uid} handleFilterChange={handleFilterChange} />
            </Box>
        </InlineStack>
    )
}

export default GroupOptionComponent;