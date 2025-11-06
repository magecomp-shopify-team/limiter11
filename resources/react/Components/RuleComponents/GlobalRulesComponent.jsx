import React, { createContext, useEffect, useState } from "react";
import { DragDropContext, Droppable, } from "react-beautiful-dnd";
import DraggableComponent, {
    EmptyConditionComponent,
} from "./DraggableComponent";
import { Box, Button, InlineStack, } from "@shopify/polaris";
import { generateUID } from "../../utils/config";
import { useSearchParams } from "react-router-dom";
import AddTemplate from "../Templates/AddTemplate";
import { deepEqual, fetchApi } from "../../utils/api";
import { SaveBar, useAppBridge } from '@shopify/app-bridge-react';

export const GlobalDataContext = createContext({
    handleKeyUpdate: (uid, options) => { },
    settingData: {},
    addNewRuleItem: (uid) => { },
    addNewConditionItem: (uid) => { },
    removeItemOption: (uid) => { },
    removeConditionItem: (uid) => { },
});


const getItems = (dataItems, uid) => {
    var items = null;
    console.log(uid);
    if (uid === "root") {
        return { items: dataItems, index: 0, item: null };
    }
    dataItems.some((it, index) => {
        if (it?.uid == uid) {
            items = { items: dataItems, index: index, item: it };
            return true;
        } else if (it?.type == "condition") {
            items = getItems(it?.items, uid);
            if (items) {
                return true;
            }
        }
    });
    return items;
};

const setItemOption = (dataItems, item, uid) => {
    console.log(uid);
    if (uid == "root") {
        return [...dataItems];
    }
    const newItems = dataItems.map((it) => {
        if (it?.uid == uid) {
            return item;
        } else if (it?.type == "condition") {
            it.items = setItemOption(it?.items, item, uid);
            return it;
        }
        return it;
    });
    return newItems;
};

const setItem = (dataItems, item, uid) => {
    if (uid == "root") {
        return [...item];
    }
    const newItem = dataItems.map((it, index) => {
        if (it?.uid == uid) {
            if (it?.type == "condition") {
                it.items = [...item];
            }
        } else if (it?.type == "condition") {
            it.items = [...setItem(it?.items, item, uid)];
        }
        return it;
    });

    return newItem;
};

const removeItem = (dataItems, uid) => {
    const newItem = dataItems
        .map((it, index) => {
            if (it?.uid == uid) {
                return null;
            } else if (it?.type == "condition") {
                it.items = [...removeItem(it?.items, uid)];
            }
            return it;
        })
        .filter((node) => {
            if (node) return node;
        });

    return newItem;
};

const GlobalRulesComponent = ({ onDone, setLoading, loading }) => {
    const shopify = useAppBridge();
    const [param] = useSearchParams();
    const [data, setData] = useState([]);
    const [oldData, setOldData] = useState([]);
    const [settingData, setSettingData] = useState({});

    const getRules = async () => {
        setLoading(true);
        const res = await fetchApi("GET", "/api/get-rules", {});
        if (res?.status) {
            if (res?.data?.rules && res?.data?.rules?.length > 0) {
                setData([...res?.data?.rules]);
                setOldData([...res?.data?.rules])
            } else if (param.get("q") == "initialRule") {
                addNewRuleItem("root");
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        getRules();
    }, []);

    const saveRules = async () => {
        const res = await fetchApi(
            "POST",
            "/api/save-rules",
            { body: { data: data } });
        if (res.status == 1) {
            shopify.toast.show("Rule saved");
            shopify.saveBar.hide("rule-data");
        }
        onDone();
    }

    useEffect(() => {
        if (!deepEqual(data, oldData)) {
            shopify.saveBar.show("rule-data");
        }
    }, [data, oldData]);

    const handleSubmit = () => {
        setOldData(data);
        saveRules();
    };

    const handleDiscard = () => {
        setData(oldData);
        shopify.saveBar.hide("rule-data");
    };
    const handleSettingDataUpdate = (uid, value) => {
        var oldValue = {};
        if (settingData.hasOwnProperty(uid)) {
            oldValue = settingData[uid];
        }
        settingData[uid] = {
            ...oldValue,
            ...value,
        };
        setSettingData({ ...settingData });
    };

    const handleKeyUpdate = (uid, options) => {
        const arrItem = getItems(data, uid);
        const item = arrItem?.item;

        if (item) {
            const newItem = {
                ...item,
                ...options,
            };
            setData(setItemOption(data, newItem, uid));
        }
    };

    const handleOnDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;
        const startDroppableId = source.droppableId;
        const endDroppableId = destination.droppableId;
        const startIndex = source.index;
        const endIndex = destination.index;

        const reorder = (list, startIndex, endIndex) => {
            const result = Array.from(list);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return result;
        };

        const move = (sourceList, destinationList, startIndex, endIndex) => {
            const result = Array.from(sourceList);
            const [removed] = result.splice(startIndex, 1);
            destinationList.splice(endIndex, 0, removed);
            return [result, destinationList];
        };

        if (startDroppableId === endDroppableId) {
            var las = getItems(data, startDroppableId);
            const newData = las?.items;
            const currentDroppable = las?.item;
            if (currentDroppable?.type === "condition") {
                const updatedItems = reorder(
                    las?.item?.items,
                    startIndex,
                    endIndex,
                );
                setData(setItem(data, updatedItems, startDroppableId));
            } else {
                const updatedItems = reorder(newData, startIndex, endIndex);
                setData(setItem(data, updatedItems, startDroppableId));
            }
        } else {
            const source = getItems(data, startDroppableId);
            const destination = getItems(data, endDroppableId);
            const sourceList = source?.item;
            const destinationList = destination?.item;
            var sourceItemsOld = source?.items;
            if (sourceList?.type === "condition") {
                sourceItemsOld = sourceList.items;
            }
            var destinationItemsOld = destination?.items;
            if (destinationList?.type === "condition") {
                destinationItemsOld = destinationList.items;
            }
            const [updatedSourceItems, destinationListItem] = move(
                sourceItemsOld,
                destinationItemsOld,
                startIndex,
                endIndex,
            );
            const step1 = setItem(data, updatedSourceItems, startDroppableId);
            const updatedData = setItem(
                step1,
                destinationListItem,
                endDroppableId,
            );
            setData(updatedData);
        }
    };

    const removeItemOption = (uid) => {
        var las = removeItem(data, uid);
        setData(las);
    };

    const addNewRuleItem = (uid, item = null) => {
        var las = getItems(data, uid);
        let newItem = null;
        if (item) {
            newItem = { ...item };
        } else {
            newItem = {
                uid: null,
                type: "limit",
                applyTo: "cart",
                message: "",
                group: {
                    field: "price",
                    op: "e",
                    filter: "200",
                },
                minOn: true,
                min: 1,
                maxOn: true,
                max: 1,
                multipleOn: true,
                multiple: 1,
            };
        }
        newItem.uid = generateUID();
        if (las?.item) {
            let updatedItems = [];
            if (las.item.items.length) {
                updatedItems = [...las.item.items, { ...newItem }];
            } else {
                updatedItems = [{ ...newItem }];
            }
            setData(setItem(data, updatedItems, uid));
        } else {
            setData(setItem(data, [...data, { ...newItem }], "root"));
        }
    };

    const addNewConditionItem = (uid) => {
        var las = getItems(data, uid);
        let newItem = {
            uid: null,
            type: "condition",
            condition: {
                type: "ctags",
                op: "e",
                filter: "",
            },
            items: [],
        };
        newItem.uid = generateUID();
        if (las.item) {
            let updatedItems = [];
            if (las.item.items.length) {
                updatedItems = [...las.item.items, { ...newItem }];
            } else {
                updatedItems = [{ ...newItem }];
            }
            setData(setItem(data, updatedItems, uid));
        } else {
            setData(setItem(data, [...data, { ...newItem }], "root"));
        }
    };

    const ContextValue = {
        handleKeyUpdate,
        settingData,
        setSettingData,
        handleSettingDataUpdate,
        addNewRuleItem,
        addNewConditionItem,
        removeItemOption,
    };

    return (
        <GlobalDataContext.Provider value={ContextValue}>
            <SaveBar id="rule-data">
                <button
                    variant="primary"
                    onClick={handleSubmit}
                ></button>
                <button onClick={handleDiscard}></button>
            </SaveBar>
            <Box paddingBlock={"100"}>
                <InlineStack gap={"100"} align="space-between">
                    <Box>
                        <AddTemplate />
                    </Box>
                    <Button
                        variant="primary"
                        onClick={() => setData([...[]])}
                        tone="critical"
                    >
                        Clear all
                    </Button>
                </InlineStack>
            </Box>
            <Box>
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="root" type="ROOT">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{ padding: "20px" }}
                            >
                                {data?.length == 0 && (
                                    <EmptyConditionComponent
                                        loading={loading}
                                    />
                                )}
                                {data.map((item, index) => (
                                    <React.Fragment key={item.uid}>
                                        <DraggableComponent
                                            item={item}
                                            index={index}
                                        />
                                    </React.Fragment>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </Box>
        </GlobalDataContext.Provider>
    );
};

export default GlobalRulesComponent;
