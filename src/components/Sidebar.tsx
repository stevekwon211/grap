import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileUpload from "./FileUpload";
import ColorPicker from "./ColorPicker";

interface SidebarProps {
    onCopy: () => void;
    onChartTypeChange: (type: string) => void;
    onThemeChange: (theme: string) => void;
    onTextSizeChange: (size: string) => void;
    onFileUpload: (file: File) => void;
    onAspectRatioChange: (ratio: string) => void;
    onChartTitleChange: (title: string) => void;
    onXAxisLabelChange: (label: string) => void;
    onYAxisLabelChange: (label: string) => void;
    chartTitle: string;
    xAxisLabel: string;
    yAxisLabel: string;
    onColorChange: (color: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    onCopy,
    onChartTypeChange,
    onThemeChange,
    onTextSizeChange,
    onFileUpload,
    onAspectRatioChange,
    onChartTitleChange,
    onXAxisLabelChange,
    onYAxisLabelChange,
    chartTitle,
    xAxisLabel,
    yAxisLabel,
    onColorChange,
}) => {
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [currentColor, setCurrentColor] = useState("#FF6384");

    const handleColorChange = (color: string) => {
        setCurrentColor(color);
        onColorChange(color);
    };

    return (
        <div className="w-64 sidebar text-black p-6 flex flex-col gap-6 h-full">
            <h1 className="text-3xl font-bold">Grap</h1>
            <div className="space-y-2">
                <FileUpload onFileUpload={onFileUpload} />
                <Button onClick={onCopy} className="w-full btn-primary">
                    Copy to Clipboard
                </Button>
            </div>

            <div className="space-y-4">
                <Input
                    placeholder="Enter Chart Title"
                    value={chartTitle}
                    onChange={(e) => onChartTitleChange(e.target.value)}
                    className="btn-primary"
                />
                <Input
                    placeholder="Enter X-Axis Label"
                    value={xAxisLabel}
                    onChange={(e) => onXAxisLabelChange(e.target.value)}
                    className="btn-primary"
                />
                <Input
                    placeholder="Enter Y-Axis Label"
                    value={yAxisLabel}
                    onChange={(e) => onYAxisLabelChange(e.target.value)}
                    className="btn-primary"
                />
                <Select onValueChange={onChartTypeChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={onThemeChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="light">Light Theme</SelectItem>
                        <SelectItem value="dark">Dark Theme</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={onTextSizeChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select text size" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                        <SelectItem value="xlarge">Extra Large</SelectItem>
                    </SelectContent>
                </Select>

                <Select onValueChange={onAspectRatioChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select aspect ratio" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="landscape">Landscape (16:9)</SelectItem>
                        <SelectItem value="portrait">Portrait (9:16)</SelectItem>
                        <SelectItem value="square">Square (1:1)</SelectItem>
                        <SelectItem value="ultra-wide">Ultra-wide (21:9)</SelectItem>
                    </SelectContent>
                </Select>

                <div className="relative">
                    <Button
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="w-full btn-primary flex items-center justify-between"
                    >
                        <span>Color</span>
                        <div
                            className="w-2 h-2 rounded-full border border-gray-300"
                            style={{ backgroundColor: currentColor }}
                        />
                    </Button>
                    {showColorPicker && (
                        <div className="absolute left-0 mt-1 w-full color-picker-wrapper">
                            <ColorPicker
                                color={currentColor}
                                onChange={handleColorChange}
                                onClose={() => setShowColorPicker(false)}
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-grow"></div>
            <div className="text-xs text-gray-600 text-center">ALJJA</div>
        </div>
    );
};

export default Sidebar;
