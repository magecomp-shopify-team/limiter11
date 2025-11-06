import { Box, Button, Icon, InlineStack, Select, Text, Tooltip } from "@shopify/polaris";
import { Conditions, getListOfOption } from "../../utils/config";
import ConditionalOptionComponent from "./ConditionalOptionComponent";
import { useContext } from "react";
import { ConditionContext } from "./ConditionComponent";
import { DeleteIcon, PlusCircleIcon } from "@shopify/polaris-icons";
import ConditionFilterComponent from "./ConditionFilterComponent";

const EmptyConditionComponent = ({ addNewItem }) => {
    return (
        <Box width="100%" minWidth="500px" background="nav-bg" padding={"200"}>
            <Text>Please add condition <Button variant="plain" onClick={addNewItem}>add new condition</Button></Text>
        </Box>
    )
}

const CommonConditionComponent = ({ index = "base", items, condition, handleRootSubPartChange }) => {
    const { handleRootConditionChange } = useContext(ConditionContext);

    const addNewItemObj = {
        type: "ctags",
        op: "e",
        filter: ""
    }

    const handleSubPartChange = (obj) => {
        if (index == "root") {
            handleRootConditionChange(obj);
        } else {
            const newItem = items.map((it, ind) => {
                if (ind == index) {
                    return {
                        ...it,
                        ...obj
                    };
                }
                return it;
            });
            handleRootSubPartChange({ cond: newItem });
        }
    }

    const handleTypeChange = (val) => {
        const updateCond = {
            type: val
        }
        if ((val == "{}" || val == "[]") && !condition?.cond) {
            updateCond.cond = [addNewItemObj];
        }
        if ((val == "{}" || val == "[]") && !["and", "or"].includes(condition?.op)) {
            updateCond.op = "and";
        }
        const opt = getListOfOption(val);
        const hasOpt = opt.some((it) => it.value === condition?.op);
        if (!hasOpt) {
            updateCond.op = opt[0].value;
        }
        if (typeof condition?.filter != "object" && (val == "cart-item-e" || val == "cart-item-ne")) {
            updateCond.filter = {
                field: "product",
                op: "e",
                filter: []
            };
        } else if (!(val == "cart-item-e" || val == "cart-item-ne")) {
            updateCond.filter = "";
        }
        handleSubPartChange({
            ...condition,
            ...updateCond
        });
    }

    const handleOpChange = (val) => {
        handleSubPartChange({
            ...condition,
            op: val
        })
    }

    const handleFilterChange = (val) => {
        handleSubPartChange({
            ...condition,
            filter: val
        })
    }

    const handleFilterOptionChange = (val) => {
        handleSubPartChange({
            ...condition,
            filter: {
                ...val
            }
        })
    }

    const addNewItem = () => {
        handleSubPartChange({
            ...items,
            cond: [
                ...condition?.cond,
                addNewItemObj
            ]
        });
    }

    const removeItem = () => {
        if (items) {
            const newCondition = [...items];
            if (index > -1 && index < newCondition.length) {
                newCondition.splice(index, 1);
            }
            handleRootSubPartChange({ cond: newCondition });
        }
    }

    return (
        <Box padding={"100"} >
            <Box>
                <InlineStack gap={"100"}>
                    <div className="rule-input-half">
                        <Select name="type" options={Conditions} value={condition.type || 'cart-item-e'} label={index == "root" ? "When" : "if"} onChange={handleTypeChange} />
                    </div>
                    <ConditionalOptionComponent type={condition?.type} handleOpChange={handleOpChange} condition={condition} handleFilterChange={handleFilterChange} />
                    <Box>
                        {!(index == "root") && <Button variant="plain" onClick={removeItem}><Icon source={DeleteIcon} tone="subdued" /></Button>}
                    </Box>
                </InlineStack>
                {(condition.type == "cart-item-e" || condition.type == "cart-item-ne")
                    &&
                    <Box paddingBlockStart={"100"}>
                        <ConditionFilterComponent index={index} group={condition?.filter} handleParentFilterChange={handleFilterOptionChange} />
                    </Box>
                }
                {(condition?.type == "{}" || condition?.type == "[]") &&
                    <div style={{ border: "1px dashed #ddd", minWidth: "580px" }}>
                        <InlineStack align="start">
                            <Box width="25px" paddingBlockStart={"150"}>
                                <Tooltip content="Add new condition">
                                    <Button variant="plain" onClick={addNewItem}><Icon source={PlusCircleIcon} tone="subdued" /></Button>
                                </Tooltip>
                            </Box>
                            <Box width="calc(100% - 25px)">
                                {condition?.cond?.length == 0 && <EmptyConditionComponent addNewItem={addNewItem} />}
                                {condition?.cond?.map((it, ind) => (
                                    <CommonConditionComponent
                                        items={condition?.cond}
                                        index={ind}
                                        handleRootSubPartChange={handleSubPartChange}
                                        condition={it}
                                        key={ind}
                                    />
                                ))}
                            </Box>
                        </InlineStack>
                    </div>
                }

            </Box>
        </Box>
    )
}

export default CommonConditionComponent;