"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Sidebar from "./components/Sidebar";
import { parseCSV } from "./utils/csvParser";
import { Chart } from "chart.js/auto";

const GraphRenderer = dynamic(() => import("./components/GraphRenderer"), { ssr: false });

function App() {
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [chartType, setChartType] = useState("line");
    const [theme, setTheme] = useState("light");
    const [textSize, setTextSize] = useState("default");

    const handleFileUpload = async (file: File) => {
        try {
            const parsedData = await parseCSV(file);
            setData(parsedData);
            setError(null);
        } catch (err) {
            setError("Error parsing CSV file. Please check the file format.");
            setData(null);
        }
    };

    const handleExport = (size: string) => {
        if (chartRef.current) {
            const canvas = chartRef.current;
            const aspectRatio = {
                landscape: 16 / 9,
                portrait: 9 / 16,
                square: 1,
                "ultra-wide": 21 / 9,
            };

            const baseWidth = 1600;
            const width = baseWidth;
            const height = Math.round(baseWidth / aspectRatio[size as keyof typeof aspectRatio]);

            const newCanvas = document.createElement("canvas");
            newCanvas.width = width;
            newCanvas.height = height;
            const newCtx = newCanvas.getContext("2d");

            if (newCtx) {
                newCtx.fillStyle = theme === "dark" ? "#333" : "white";
                newCtx.fillRect(0, 0, width, height);

                // Get the current chart instance
                const chartInstance = Chart.getChart(canvas);
                if (chartInstance) {
                    // Save the original dimensions and options
                    const originalWidth = canvas.width;
                    const originalHeight = canvas.height;
                    const originalOptions = JSON.parse(JSON.stringify(chartInstance.options));

                    // Calculate the scale factor
                    const scaleFactor = Math.min(width / originalWidth, height / originalHeight);

                    // Update the chart's options for the new size
                    chartInstance.options.responsive = false;
                    chartInstance.options.maintainAspectRatio = false;
                    chartInstance.options.plugins!.title!.font!.size = Math.round(
                        originalOptions.plugins.title.font.size * scaleFactor
                    );
                    chartInstance.options.plugins!.legend!.labels!.font!.size = Math.round(
                        originalOptions.plugins.legend.labels.font.size * scaleFactor
                    );
                    chartInstance.options.scales!.x!.ticks!.font!.size = Math.round(
                        originalOptions.scales.x.ticks.font.size * scaleFactor
                    );
                    chartInstance.options.scales!.y!.ticks!.font!.size = Math.round(
                        originalOptions.scales.y.ticks.font.size * scaleFactor
                    );

                    // Resize the original canvas to match the new aspect ratio
                    canvas.width = width;
                    canvas.height = height;

                    // Update the chart's size and redraw
                    chartInstance.resize();

                    // Draw the resized chart onto the new canvas
                    newCtx.drawImage(canvas, 0, 0, width, height);

                    // Restore the original canvas dimensions and options
                    canvas.width = originalWidth;
                    canvas.height = originalHeight;
                    chartInstance.options = originalOptions;
                    chartInstance.resize();
                }

                // Apply corner radius to the exported image
                newCtx.globalCompositeOperation = "destination-in";
                newCtx.beginPath();
                newCtx.moveTo(8, 0);
                newCtx.lineTo(width - 8, 0);
                newCtx.quadraticCurveTo(width, 0, width, 8);
                newCtx.lineTo(width, height - 8);
                newCtx.quadraticCurveTo(width, height, width - 8, height);
                newCtx.lineTo(8, height);
                newCtx.quadraticCurveTo(0, height, 0, height - 8);
                newCtx.lineTo(0, 8);
                newCtx.quadraticCurveTo(0, 0, 8, 0);
                newCtx.closePath();
                newCtx.fill();

                const dataUrl = newCanvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.download = `chart-${size}.png`;
                link.href = dataUrl;
                link.click();
            }
        }
    };

    const handleCopy = () => {
        if (chartRef.current) {
            chartRef.current.toBlob((blob) => {
                if (blob) {
                    const item = new ClipboardItem({ "image/png": blob });
                    navigator.clipboard.write([item]);
                }
            });
        }
    };

    const handleChartTypeChange = (type: string) => {
        setChartType(type);
    };

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
    };

    const handleTextSizeChange = (size: string) => {
        setTextSize(size);
    };

    return (
        <div className="flex h-screen">
            <Sidebar
                onExport={handleExport}
                onCopy={handleCopy}
                onChartTypeChange={handleChartTypeChange}
                onThemeChange={handleThemeChange}
                onTextSizeChange={handleTextSizeChange}
                onFileUpload={handleFileUpload}
            />
            <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
                {error && <p className="text-red-500">{error}</p>}
                {data && (
                    <div className="w-full h-full max-w-[1600px] max-h-[1200px] overflow-hidden">
                        <GraphRenderer
                            data={data}
                            chartRef={chartRef}
                            chartType={chartType}
                            theme={theme}
                            textSize={textSize}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
