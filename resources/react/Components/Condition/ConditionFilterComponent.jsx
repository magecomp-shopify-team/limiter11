import { Box, InlineStack, Select } from "@shopify/polaris";
import { ConditionsOn, getListOfOption } from "../../utils/config";
import { ConditionFilterOptionComponent } from "./ConditionFilterOptionComponent";

const ConditionFilterComponent = ({ group, handleParentFilterChange }) => {
    const handleFieldChange = (val) => {
        const newGroup = {
            ...group,
            field: val
        };

        const opt = getListOfOption(val);
        const hasOpt = opt.some((it) => it.value === group.op);
        if (!hasOpt) {
            newGroup.op = opt[0].value;
        }

        if (group?.field == "product" && val == "coll") {
            newGroup.filter = [];
        }
        if (group?.field == "coll" && val == "product") {
            newGroup.filter = [];
        }

        if (typeof group?.filter == "object" && !(val == "coll" || val == "product")) {
            newGroup.filter = "";
        } else if (typeof group?.filter != "object" && (val == "coll" || val == "product")) {
            newGroup.filter = [];
        }

        handleParentFilterChange(newGroup);
    }

    const handleOpChange = (val) => {
        const newGroup = {
            ...group,
            op: val
        };
        handleParentFilterChange(newGroup);
    }

    const handleFilterChange = (val) => {
        const newGroup = {
            ...group,
            filter: val
        };
        handleParentFilterChange(newGroup);
    }

    return (
        <InlineStack>
            <Box>
                <div className="rule-input rule-group">
                    <Select options={ConditionsOn} label="Filter by" name="field" value={group?.field} onChange={handleFieldChange} />
                </div>
            </Box>
            <Box paddingInlineStart={"200"}>
                <div className="rule-input rule-group">
                    <Select options={getListOfOption(group?.field)} name="op" value={group?.op} onChange={handleOpChange} />
                </div>
            </Box>
            <Box paddingInlineStart={"100"} width="calc(100% - 360px)">
                <ConditionFilterOptionComponent options={group} handleFilterChange={handleFilterChange} />
            </Box>
        </InlineStack>
    )
}

export default ConditionFilterComponent;