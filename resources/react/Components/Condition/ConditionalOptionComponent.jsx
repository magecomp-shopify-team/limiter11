import { Box, Button, ButtonGroup, Select, Text, TextField } from "@shopify/polaris";
import { getListOfOption, NumbarbasedOption, TimebasedOption } from "../../utils/config";

const ConditionalOptionComponent = ({ type, handleOpChange, condition, handleFilterChange }) => {

    if (type == "{}" || type == "[]") {
        return (
            <Box paddingInlineStart={"200"}>
                <ButtonGroup variant="segmented">
                    <Button variant={condition?.op == "and" ? "primary" : "secondary"} onClick={() => handleOpChange('and')}>met</Button>
                    <Button variant={condition?.op == "or" ? "primary" : "secondary"} onClick={() => handleOpChange('or')}>unmet</Button>
                </ButtonGroup>
            </Box>
        )
    }
    if (type == "cart-item-e" || type == "cart-item-ne") {
        return (
            <Text>an item falling under filter below</Text>
        )
    }

    if (type == "ctags") {
        return (
            <>
                <div className="rule-input">
                    <Select options={getListOfOption('ctags')} name="op" onChange={handleOpChange} value={condition?.op} />
                </div>
                <div className="rule-input-full">
                    <TextField type="text" name="filter" value={condition?.filter} placeholder="Case-sensitive text or number to filter by" onChange={handleFilterChange} />
                </div>
            </>
        )
    }

    if (type == "time") {
        return (
            <>
                <div className="rule-input">
                    <Select options={getListOfOption("time")} name="op" onChange={handleOpChange} value={condition?.op} />
                </div>
                <div>
                    <TextField type="datetime-local" value={condition?.filter} name="filter" onChange={handleFilterChange} />
                </div>
            </>
        )
    }

    if (type == "subtotal") {
        return (
            <>
                <div className="rule-input">
                    <Select options={getListOfOption("subtotal")} name="op" onChange={handleOpChange} value={condition?.op} />
                </div>
                <div>
                    <TextField type="text" name="filter" value={condition?.filter} placeholder="Case-sensitive text or number to filter by" onChange={handleFilterChange} />
                </div>
            </>
        )
    }

    return (
        <></>
    );
}

export default ConditionalOptionComponent;