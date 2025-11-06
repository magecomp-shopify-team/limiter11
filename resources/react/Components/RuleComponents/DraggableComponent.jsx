import {
    Box,
    Button,
    Icon,
    InlineStack,
    SkeletonBodyText,
    Text,
    Tooltip,
} from "@shopify/polaris";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { CodeIcon, DragHandleIcon, PlusCircleIcon, XIcon } from "@shopify/polaris-icons";
import { RuleComponent } from "./RuleComponent";
import ConditionComponent from "../Condition/ConditionComponent";
import { useContext } from "react";
import { GlobalDataContext } from "./GlobalRulesComponent";

export const EmptyConditionComponent = ({ uid, loading }) => {
    const { addNewRuleItem } = useContext(GlobalDataContext);
    return (
        <Box padding={"150"}>
            {loading ? (
                <>
                    <SkeletonBodyText lines={2} />
                    <br></br>
                    <SkeletonBodyText lines={2} />
                </>
            ) : (
                <Text>
                    <Button variant="plain" onClick={() => addNewRuleItem(uid)}>
                        Click here
                    </Button>{" "}
                    to start adding such rules or drag & drop existing rules
                    from outside this subsection instead.
                </Text>
            )}
        </Box>
    );
};

const DraggableComponent = ({ item, index, isDragging = false }) => {
    const { removeItemOption, addNewRuleItem } = useContext(GlobalDataContext);
    const hadnleRemove = () => {
        if (item.uid) {
            removeItemOption(item.uid);
        }
    };

    return (
        <Draggable draggableId={item.uid} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                        border: "1px solid #ddd",
                        marginBottom: "10px",
                        position: "relative",
                        backgroundColor:
                            item?.type == "condition" ? "#f5f5f5" : "#f0f2ff",
                        ...provided.draggableProps.style,
                    }}
                >
                    <div className="limit-rule">
                        <InlineStack blockAlign="start">
                            <Box width="20px" paddingBlockStart={item?.type !== 'condition' ? "200" : "300"}>
                                <Tooltip
                                    content={
                                        item?.type !== "condition"
                                            ? "Drag rule"
                                            : "Drag condition"
                                    }
                                >
                                    <div
                                        {...provided.dragHandleProps}
                                        style={{ display: "inline-block" }}
                                    >
                                        <Icon
                                            source={
                                                item?.type !== "condition"
                                                    ? DragHandleIcon
                                                    : CodeIcon
                                            }
                                        />
                                    </div>
                                </Tooltip>
                            </Box>
                            <Box width="calc(100% - 20px)">
                                {item?.type !== "condition" ? (
                                    <RuleComponent item={item} />
                                ) : (
                                    <ConditionComponent item={item} />
                                )}
                            </Box>
                        </InlineStack>
                    </div>
                    {item.type === "condition" && (
                        <div className="condition-part">
                            <InlineStack blockAlign="end">
                                <Box paddingBlockEnd={"200"} width="20px">
                                    <Tooltip content="Add new rule">
                                        <Button
                                            variant="monochromePlain"
                                            onClick={() =>
                                                addNewRuleItem(item.uid)
                                            }
                                        >
                                            <Icon
                                                source={PlusCircleIcon}
                                                tone="subdued"
                                            />
                                        </Button>
                                    </Tooltip>
                                </Box>
                                <div className="condition-rules">
                                    <Droppable
                                        droppableId={item.uid}
                                        type="ROOT"
                                        isDropDisabled={
                                            snapshot?.isDragging || isDragging
                                        }
                                    >
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={{ padding: "10px" }}
                                            >
                                                {item?.items?.length ? (
                                                    <>
                                                        {item.items.map(
                                                            (
                                                                subItem,
                                                                subIndex,
                                                            ) => (
                                                                <DraggableComponent
                                                                    key={
                                                                        subItem.uid
                                                                    }
                                                                    item={
                                                                        subItem
                                                                    }
                                                                    index={
                                                                        subIndex
                                                                    }
                                                                    isDragging={
                                                                        snapshot?.isDragging
                                                                    }
                                                                />
                                                            ),
                                                        )}
                                                    </>
                                                ) : (
                                                    <EmptyConditionComponent
                                                        uid={item.uid}
                                                    />
                                                )}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </div>
                            </InlineStack>
                        </div>
                    )}
                    <div className="close-icon">
                        <Button
                            variant="monochromePlain"
                            onClick={hadnleRemove}
                        >
                            <Icon source={XIcon} tone="base" />
                        </Button>
                    </div>
                </div>
            )}
        </Draggable>
    );
};

export default DraggableComponent;
