"use client";

import React, { useState, useRef } from "react";
import dynamic from "next/dynamic";
import Sidebar from "./components/Sidebar";
import { parseCSV } from "./utils/csvParser";
import { Chart } from "chart.js/auto";

const GraphRenderer = dynamic(() => import("./components/GraphRenderer"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

function App() {
    const [data, setData] = useState<Record<string, string | number>[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const [chartType, setChartType] = useState("line");
    const [theme, setTheme] = useState("light");
    const [textSize, setTextSize] = useState("default");
    const [aspectRatio, setAspectRatio] = useState<string>("landscape");
    const [chartTitle, setChartTitle] = useState("");
    const [xAxisLabel, setXAxisLabel] = useState("");
    const [yAxisLabel, setYAxisLabel] = useState("");
    const [graphColor, setGraphColor] = useState("#FF6384"); // 기본 색상 설정

    const handleFileUpload = (file: File) => {
        parseCSV(file)
            .then((parsedData) => {
                setData(parsedData);
                setError(null);
            })
            .catch(() => {
                setError("Error parsing CSV file. Please check the file format.");
                setData(null);
            });
    };

    const handleCopy = () => {
        if (chartRef.current) {
            const canvas = chartRef.current;
            const chartInstance = Chart.getChart(canvas);

            if (chartInstance) {
                const aspectRatioValues = {
                    landscape: 16 / 9,
                    portrait: 9 / 16,
                    square: 1,
                    "ultra-wide": 21 / 9,
                };

                const ratio = aspectRatioValues[aspectRatio as keyof typeof aspectRatioValues];
                const baseWidth = 1600;
                const width = baseWidth;
                const height = Math.round(width / ratio);

                // Create a new canvas with the correct aspect ratio
                const newCanvas = document.createElement("canvas");
                newCanvas.width = width;
                newCanvas.height = height;
                const ctx = newCanvas.getContext("2d");

                if (ctx) {
                    // Set background color based on theme
                    ctx.fillStyle = theme === "dark" ? "#333" : "white";
                    ctx.fillRect(0, 0, width, height);

                    // Calculate scaling factor
                    const scale = Math.min(width / canvas.width, height / canvas.height);
                    const scaledWidth = canvas.width * scale;
                    const scaledHeight = canvas.height * scale;
                    const x = (width - scaledWidth) / 2;
                    const y = (height - scaledHeight) / 2;

                    // Draw the original chart onto the new canvas, maintaining its aspect ratio
                    ctx.drawImage(canvas, x, y, scaledWidth, scaledHeight);

                    newCanvas.toBlob((blob) => {
                        if (blob) {
                            const item = new ClipboardItem({ "image/png": blob });
                            navigator.clipboard.write([item]);
                        }
                    });
                }
            }
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

    const handleAspectRatioChange = (ratio: string) => {
        setAspectRatio(ratio);
    };

    const handleChartTitleChange = (title: string) => {
        setChartTitle(title);
    };

    const handleXAxisLabelChange = (label: string) => {
        setXAxisLabel(label);
    };

    const handleYAxisLabelChange = (label: string) => {
        setYAxisLabel(label);
    };

    const handleColorChange = (color: string) => {
        setGraphColor(color);
    };

    return (
        <div className="flex h-screen">
            <Sidebar
                onCopy={handleCopy}
                onChartTypeChange={handleChartTypeChange}
                onThemeChange={handleThemeChange}
                onTextSizeChange={handleTextSizeChange}
                onFileUpload={handleFileUpload}
                onAspectRatioChange={handleAspectRatioChange}
                // currentAspectRatio={aspectRatio} // 이 줄을 제거합니다
                onChartTitleChange={handleChartTitleChange}
                onXAxisLabelChange={handleXAxisLabelChange}
                onYAxisLabelChange={handleYAxisLabelChange}
                chartTitle={chartTitle}
                xAxisLabel={xAxisLabel}
                yAxisLabel={yAxisLabel}
                onColorChange={handleColorChange}
            />
            <div className="flex-1 flex items-center justify-center p-6 bg-white graph-container">
                {error && <p className="text-red-500">{error}</p>}
                {data && (
                    <div style={{ width: "100%", height: "100%", maxWidth: "1600px", maxHeight: "1200px" }}>
                        <GraphRenderer
                            data={{
                                labels: data.map((item) => item.label as string),
                                datasets: [
                                    {
                                        label: "Data",
                                        data: data.map((item) => Number(item.value)),
                                    },
                                ],
                            }}
                            chartRef={chartRef}
                            chartType={chartType}
                            theme={theme}
                            textSize={textSize}
                            aspectRatio={aspectRatio}
                            chartTitle={chartTitle}
                            xAxisLabel={xAxisLabel}
                            yAxisLabel={yAxisLabel}
                            graphColor={graphColor}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
