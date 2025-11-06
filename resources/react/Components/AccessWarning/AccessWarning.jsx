import { Box, Icon, Text, Tooltip } from "@shopify/polaris";
import styled from "styled-components";
import {
    AlertTriangleIcon
} from '@shopify/polaris-icons';
import { useMemo } from "react";
import { shop_data } from "../../app";

const BannerWrapper = styled.div`
   padding: 8px 12px;
   background-color: rgb(255, 241, 227, 1);
   color: rgb(92, 62, 31, 1);
   border-radius: 0.5rem;
   display: flex;
   gap: 0.5rem;
   margin-bottom: 1rem;
   border : 1px solid rgb(192, 141, 88, 1);
`

const AccessWarning = ({ type = 'page', children, notInFree }) => {
    const [planId, isFree] = useMemo(() => {
        let plan_id = (!shop_data?.plan_id || shop_data?.plan_id == null) ? null : shop_data?.plan_id;
        return [plan_id, false];
    }, [shop_data]);

    const isLocked = useMemo(() => {
        if (!planId) {
            return true;
        }
        return false;
    }, [planId, isFree, notInFree]);

    const { textContent, buttonContent } = useMemo(() => {

        return {
            buttonContent: "🔒 This feature is available on the Pro plan.",
            textContent: "This feature is not available on your current plan.",
        };
    }, [planId]);

    if (type == 'button' && (isLocked)) {
        return (
            <>
                <Tooltip content={buttonContent}>
                    <div style={{ opacity: 0.3, pointerEvents: 'none', cursor: 'not-allowed' }}>
                        {children}
                    </div>
                </Tooltip>
            </>
        )
    }

    return (
        <>
            {(isLocked) && (
                <BannerWrapper tone="warning" >
                    <Box width='20px'>
                        <Icon
                            source={AlertTriangleIcon}
                            tone="base"
                        />
                    </Box>
                    <Text>{textContent}</Text>
                    <h2>
                        Please <a href="/plan">upgrade</a> to unlock full access.
                    </h2>

                </BannerWrapper>
            )}

            <div>
                {(isLocked) ? (
                    <div style={{ opacity: 0.3, pointerEvents: 'none', cursor: 'not-allowed' }}>
                        {children}
                    </div>
                ) : (
                    children
                )}
            </div>
        </>
    );
};

export default AccessWarning;
