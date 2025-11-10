import { useEffect, useState } from 'react';
import {
    TextField,
    Box,
    ColorPicker,
    Popover,
    Button,
} from '@shopify/polaris';

function hexToHsba(hex) {
    if(!hex) {
        return {
            hue: 0,
            saturation: 0,
            brightness: 0,
            alpha: 0
        }
    }
    hex = hex.replace(/^#/, '');

    let r, g, b, a = 255;
    if (hex.length === 8) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
        a = parseInt(hex.slice(6, 8), 16);
    } else if (hex.length === 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
    } else {
        return {
            hue: 0,
            saturation: 0,
            brightness: 0,
            alpha: 0
        }
    }

    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let hue = 0;
    if (delta !== 0) {
        if (max === r) hue = 60 * (((g - b) / delta) % 6);
        else if (max === g) hue = 60 * (((b - r) / delta) + 2);
        else if (max === b) hue = 60 * (((r - g) / delta) + 4);
    }

    if (hue < 0) hue += 360;

    const brightness = max;
    const saturation = max === 0 ? 0 : delta / max;
    const alphaValue = a / 255;

    return {
        hue: parseFloat(hue.toFixed(2)),
        saturation: parseFloat(saturation.toFixed(2)),
        brightness: parseFloat(brightness.toFixed(2)),
        alpha: parseFloat(alphaValue.toFixed(2))
    };
}

function hsbaToHex({ hue, saturation, brightness, alpha }) {
    const c = brightness * saturation;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = brightness - c;

    let r = 0, g = 0, b = 0;

    if (hue >= 0 && hue < 60) {
        r = c; g = x; b = 0;
    } else if (hue >= 60 && hue < 120) {
        r = x; g = c; b = 0;
    } else if (hue >= 120 && hue < 180) {
        r = 0; g = c; b = x;
    } else if (hue >= 180 && hue < 240) {
        r = 0; g = x; b = c;
    } else if (hue >= 240 && hue < 300) {
        r = x; g = 0; b = c;
    } else if (hue >= 300 && hue < 360) {
        r = c; g = 0; b = x;
    }

    const r255 = Math.round((r + m) * 255);
    const g255 = Math.round((g + m) * 255);
    const b255 = Math.round((b + m) * 255);
    const a255 = Math.round(alpha * 255);

    const toHex = (val) => val.toString(16).padStart(2, '0');
    return `#${toHex(r255)}${toHex(g255)}${toHex(b255)}${toHex(a255)}`;
}

function CustColorPicker({ setPrColor, colorHax }) {
    const [color, setColor] = useState({ hue: 300, brightness: 1, saturation: 0.7, alpha: 0.7, });

    useEffect(() => {
        if (colorHax) {
            setColor({ ...colorHax })
        }
    }, [colorHax]);

    const onChangeColor = (val) => {
        setPrColor(hsbaToHex(val));
        setColor(val);
    }

    return (
        <div style={{ width: "100%" }}>
            <ColorPicker onChange={onChangeColor} color={color} allowAlpha />
        </div>
    );
}

const McColorPicker = ({ label, color, setColor, width = "130px" }) => {
    const [open, setOpen] = useState(false);

    const activator = (
        <Box width={width}>
            <TextField
                label={label}
                prefix={
                    <Button variant='monochromePlain' onClick={() => setOpen(true)}>
                        <div style={{ backgroundColor: color, width: "31px", borderRadius: "5px", height: "22px", border: "1px solid gray" }}>
                            &nbsp;
                        </div>
                    </Button>
                }
                value={color}
                onChange={(v) => setColor(v)}
                onFocus={() => setOpen(true)}
                autoComplete="off"
            />
        </Box>
    );

    return (
        <Box paddingBlockEnd="4">
            <div>
                <Popover
                    active={open}
                    activator={activator}
                    onClose={() => setOpen(false)}
                    ariaHaspopup={false}
                    sectioned
                >
                    <CustColorPicker setPrColor={setColor} colorHax={hexToHsba(color)} />
                </Popover>
            </div>

        </Box>
    )
};

export default McColorPicker;
