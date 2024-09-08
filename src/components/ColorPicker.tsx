import React, { useState, useCallback, useRef, useEffect } from "react";

interface ColorPickerProps {
    color: string;
    onChange: (color: string) => void;
    onClose: () => void;
}

function hsvaToHex(h: number, s: number, v: number, a: number): string {
    const f = (n: number, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    const rgb = [f(5), f(3), f(1)].map((x) =>
        Math.round(x * 255)
            .toString(16)
            .padStart(2, "0")
    );
    const alpha = Math.round(a * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${rgb.join("")}${alpha}`;
}

function hexToHsva(hex: string): [number, number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const a = parseInt(hex.slice(7, 9), 16) / 255 || 1;
    const v = Math.max(r, g, b);
    const c = v - Math.min(r, g, b);
    const h = c && (v === r ? (g - b) / c : v === g ? 2 + (b - r) / c : 4 + (r - g) / c);
    return [60 * (h < 0 ? h + 6 : h), v && c / v, v, a];
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, onClose }) => {
    const [hsva, setHsva] = useState<[number, number, number, number]>(hexToHsva(color));
    const [hexInput, setHexInput] = useState(color.slice(0, 7));
    const [opacityInput, setOpacityInput] = useState(Math.round(hexToHsva(color)[3] * 100).toString());
    const svRef = useRef<HTMLDivElement>(null);
    const hueRef = useRef<HTMLDivElement>(null);
    const opacityRef = useRef<HTMLDivElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

    const handleSvChange = useCallback(
        (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
            if (svRef.current) {
                const rect = svRef.current.getBoundingClientRect();
                const s = clamp((event.clientX - rect.left) / rect.width, 0, 1);
                const v = clamp(1 - (event.clientY - rect.top) / rect.height, 0, 1);
                const newHsva: [number, number, number, number] = [hsva[0], s, v, hsva[3]];
                setHsva(newHsva);
                const newColor = hsvaToHex(...newHsva);
                onChange(newColor);
                setHexInput(newColor.slice(0, 7));
            }
        },
        [hsva, onChange]
    );

    const handleHueChange = useCallback(
        (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
            if (hueRef.current) {
                const rect = hueRef.current.getBoundingClientRect();
                const h = clamp(((event.clientX - rect.left) / rect.width) * 360, 0, 360);
                const newHsva: [number, number, number, number] = [h, hsva[1], hsva[2], hsva[3]];
                setHsva(newHsva);
                const newColor = hsvaToHex(...newHsva);
                onChange(newColor);
                setHexInput(newColor.slice(0, 7));
            }
        },
        [hsva, onChange]
    );

    const handleOpacityChange = useCallback(
        (event: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
            if (opacityRef.current) {
                const rect = opacityRef.current.getBoundingClientRect();
                const a = clamp((event.clientX - rect.left) / rect.width, 0, 1);
                const newHsva: [number, number, number, number] = [hsva[0], hsva[1], hsva[2], a];
                setHsva(newHsva);
                const newColor = hsvaToHex(...newHsva);
                onChange(newColor);
                setOpacityInput(Math.round(a * 100).toString());
            }
        },
        [hsva, onChange]
    );

    const handleMouseDown = (handler: (event: MouseEvent) => void) => {
        const handleMouseMove = (event: MouseEvent) => {
            handler(event);
        };
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHex = e.target.value;
        setHexInput(newHex);
        if (/^#[0-9A-F]{6}$/i.test(newHex)) {
            const newHsva = hexToHsva(newHex + "FF");
            setHsva(newHsva);
            onChange(hsvaToHex(...newHsva));
        }
    };

    const handleOpacityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newOpacity = clamp(parseInt(e.target.value) || 0, 0, 100);
        setOpacityInput(newOpacity.toString());
        const newHsva: [number, number, number, number] = [hsva[0], hsva[1], hsva[2], newOpacity / 100];
        setHsva(newHsva);
        onChange(hsvaToHex(...newHsva));
    };

    return (
        <div ref={pickerRef} className="w-64 mx-auto p-4 bg-white rounded-lg shadow-lg">
            <div
                className="mb-4 relative w-full h-48 rounded-lg overflow-hidden"
                ref={svRef}
                onClick={handleSvChange}
                onMouseDown={() => handleMouseDown(handleSvChange)}
                style={{ border: "1px solid #e2e8f0" }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundColor: `hsl(${hsva[0]}, 100%, 50%)`,
                        backgroundImage:
                            "linear-gradient(to right, #fff, transparent), linear-gradient(to top, #000, transparent)",
                    }}
                />
                <div
                    className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md cursor-pointer"
                    style={{
                        left: `${hsva[1] * 100}%`,
                        top: `${(1 - hsva[2]) * 100}%`,
                        transform: "translate(-50%, -50%)",
                        backgroundColor: hsvaToHex(...hsva),
                    }}
                />
            </div>
            <div
                className="mb-4 relative w-full h-4 rounded-lg overflow-hidden"
                ref={hueRef}
                onClick={handleHueChange}
                onMouseDown={() => handleMouseDown(handleHueChange)}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                    }}
                />
                <div
                    className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md cursor-pointer"
                    style={{
                        left: `${(hsva[0] / 360) * 100}%`,
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                />
            </div>
            <div
                className="mb-4 relative w-full h-4 rounded-lg overflow-hidden"
                ref={opacityRef}
                onClick={handleOpacityChange}
                onMouseDown={() => handleMouseDown(handleOpacityChange)}
            >
                <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent to-black"
                    style={{
                        backgroundImage: `linear-gradient(to right, transparent, ${hsvaToHex(
                            hsva[0],
                            hsva[1],
                            hsva[2],
                            1
                        ).slice(0, 7)})`,
                    }}
                />
                <div
                    className="absolute w-4 h-4 border-2 border-white rounded-full shadow-md cursor-pointer"
                    style={{
                        left: `${hsva[3] * 100}%`,
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                />
            </div>
            <div className="flex items-center space-x-2">
                <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">HEX</label>
                    <input
                        type="text"
                        value={hexInput}
                        onChange={handleHexChange}
                        className="w-full bg-gray-100 border border-gray-300 rounded-md py-1 px-2 text-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500 uppercase"
                    />
                </div>
                <div className="w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opacity</label>
                    <div className="flex items-center">
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={opacityInput}
                            onChange={handleOpacityInputChange}
                            className="w-full bg-gray-100 border border-gray-300 rounded-l-md py-1 px-2 text-sm leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        />
                        <span className="bg-gray-200 border border-gray-300 border-l-0 rounded-r-md py-1 px-2 text-sm">
                            %
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ColorPicker;
