"use client";

import React, { useEffect, useRef } from "react";
import { Chart, ChartConfiguration, ChartTypeRegistry } from "chart.js/auto";

interface GraphRendererProps {
    data: {
        labels: string[];
        datasets: Array<{
            label: string;
            data: number[];
        }>;
    };
    chartRef: React.RefObject<HTMLCanvasElement>;
    chartType: string;
    theme: string;
    textSize: string;
}

const GraphRenderer: React.FC<GraphRendererProps> = ({ data, chartRef, chartType, theme, textSize }) => {
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext("2d");
            if (ctx) {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                // Ensure the canvas size respects the max dimensions
                const containerWidth = chartRef.current.parentElement?.clientWidth || 1600;
                const containerHeight = chartRef.current.parentElement?.clientHeight || 1200;
                chartRef.current.width = Math.min(containerWidth, 1600);
                chartRef.current.height = Math.min(containerHeight, 1200);

                const chartJsType = (type: string): keyof ChartTypeRegistry => {
                    switch (type) {
                        case "bar":
                            return "bar";
                        case "funnel":
                            return "bar";
                        default:
                            return type as keyof ChartTypeRegistry;
                    }
                };

                const config: ChartConfiguration = {
                    type: chartJsType(chartType),
                    data: {
                        labels: data.labels,
                        datasets: data.datasets.map((dataset, index) => ({
                            ...dataset,
                            borderColor: `hsl(${index * 137.5}, 70%, 50%)`,
                            backgroundColor: `hsla(${index * 137.5}, 70%, 50%, 0.7)`,
                            borderWidth: 2,
                            tension: chartType === "line" ? 0.4 : undefined,
                        })),
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        layout: {
                            padding: {
                                top: 12,
                                right: 12,
                                bottom: 12,
                                left: 12,
                            },
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: "CSV Data Visualization",
                                font: {
                                    size: textSize === "xlarge" ? 24 : textSize === "large" ? 20 : 16,
                                },
                                color: theme === "dark" ? "white" : "black",
                            },
                            legend: {
                                labels: {
                                    font: {
                                        size: textSize === "xlarge" ? 16 : textSize === "large" ? 14 : 12,
                                    },
                                    color: theme === "dark" ? "white" : "black",
                                },
                            },
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: "Labels",
                                    font: {
                                        size: textSize === "xlarge" ? 16 : textSize === "large" ? 14 : 12,
                                    },
                                    color: theme === "dark" ? "white" : "black",
                                },
                                ticks: {
                                    font: {
                                        size: textSize === "xlarge" ? 14 : textSize === "large" ? 12 : 10,
                                    },
                                    color: theme === "dark" ? "white" : "black",
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: "Values",
                                    font: {
                                        size: textSize === "xlarge" ? 16 : textSize === "large" ? 14 : 12,
                                    },
                                    color: theme === "dark" ? "white" : "black",
                                },
                                ticks: {
                                    font: {
                                        size: textSize === "xlarge" ? 14 : textSize === "large" ? 12 : 10,
                                    },
                                    color: theme === "dark" ? "white" : "black",
                                },
                            },
                        },
                        elements: {
                            line: {
                                borderWidth: 2,
                                tension: 0.4,
                            },
                            point: {
                                radius: 0,
                            },
                        },
                    },
                };

                if (theme === "dark") {
                    config.options!.plugins!.legend!.labels!.color = "white";
                    config.options!.scales!.x!.grid = { color: "rgba(255, 255, 255, 0.1)" };
                    config.options!.scales!.y!.grid = { color: "rgba(255, 255, 255, 0.1)" };
                    ctx.canvas.style.backgroundColor = "#333";
                } else {
                    ctx.canvas.style.backgroundColor = "white";
                }

                if (chartType === "funnel") {
                    config.data.datasets.forEach((dataset) => {
                        dataset.data = dataset.data.map(
                            (value, index, array) => (value * (array.length - index)) / array.length
                        );
                    });
                }

                chartInstance.current = new Chart(ctx, config);
            }
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, chartRef, chartType, theme, textSize]);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                maxWidth: "1600px",
                maxHeight: "1200px",
                borderRadius: "8px",
                overflow: "hidden",
            }}
        >
            <canvas ref={chartRef} style={{ width: "100%", height: "100%" }} />
        </div>
    );
};

export default GraphRenderer;
