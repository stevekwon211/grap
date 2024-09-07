import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import FileUpload from "./FileUpload";

interface SidebarProps {
    onExport: (size: string) => void;
    onCopy: () => void;
    onChartTypeChange: (type: string) => void;
    onThemeChange: (theme: string) => void;
    onTextSizeChange: (size: string) => void;
    onFileUpload: (file: File) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    onExport,
    onCopy,
    onChartTypeChange,
    onThemeChange,
    onTextSizeChange,
    onFileUpload,
}) => {
    return (
        <div className="w-64 bg-black text-white p-6 flex flex-col gap-6">
            <h1 className="text-3xl font-bold">Grap</h1>
            <FileUpload onFileUpload={onFileUpload} />
            <h2 className="text-2xl font-bold">Customization</h2>

            <div className="space-y-4">
                <Select onValueChange={onChartTypeChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bar">Bar Chart</SelectItem>
                        <SelectItem value="line">Line Chart</SelectItem>
                        <SelectItem value="pie">Pie Chart</SelectItem>
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
            </div>

            <h2 className="text-2xl font-bold mt-6">Export Options</h2>
            <div className="space-y-2">
                <Button onClick={() => onExport("landscape")} variant="secondary" className="w-full btn-animation">
                    Export Landscape
                </Button>
                <Button onClick={() => onExport("portrait")} variant="secondary" className="w-full btn-animation">
                    Export Portrait
                </Button>
                <Button onClick={() => onExport("square")} variant="secondary" className="w-full btn-animation">
                    Export Square
                </Button>
                <Button onClick={() => onExport("ultra-wide")} variant="secondary" className="w-full btn-animation">
                    Export Ultra-wide
                </Button>
                <Button onClick={onCopy} variant="secondary" className="w-full btn-animation">
                    Copy to Clipboard
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
