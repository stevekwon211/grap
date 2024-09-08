"use client";

import React, { useEffect, useRef } from "react";
import { Chart, ChartConfiguration, ChartTypeRegistry } from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { enUS } from "date-fns/locale"; // 이 줄을 추가합니다.

interface GraphRendererProps {
    data: {
        labels: string[];
        datasets: {
            label: string;
            data: number[];
        }[];
    } | null;
    chartRef: React.RefObject<HTMLCanvasElement>;
    chartType: string;
    theme: string;
    textSize: string;
    aspectRatio: string;
    chartTitle: string;
    xAxisLabel: string;
    yAxisLabel: string;
    graphColor: string;
}

const GraphRenderer: React.FC<GraphRendererProps> = ({
    data,
    chartRef,
    chartType,
    theme,
    textSize,
    aspectRatio,
    chartTitle,
    xAxisLabel,
    yAxisLabel,
    graphColor,
}) => {
    console.log("GraphRenderer Data:", data);
    const chartInstance = useRef<Chart | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chartRef.current && containerRef.current) {
            const ctx = chartRef.current.getContext("2d");
            if (ctx) {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const aspectRatios = {
                    landscape: 16 / 9,
                    portrait: 9 / 16,
                    square: 1,
                    "ultra-wide": 21 / 9,
                };

                const ratio = aspectRatios[aspectRatio as keyof typeof aspectRatios];

                const containerWidth = containerRef.current.clientWidth;
                const containerHeight = containerRef.current.clientHeight;

                let chartWidth, chartHeight;
                if (containerWidth / containerHeight > ratio) {
                    chartHeight = containerHeight;
                    chartWidth = chartHeight * ratio;
                } else {
                    chartWidth = containerWidth;
                    chartHeight = chartWidth / ratio;
                }

                chartRef.current.style.width = `${chartWidth}px`;
                chartRef.current.style.height = `${chartHeight}px`;
                chartRef.current.width = chartWidth;
                chartRef.current.height = chartHeight;

                const config: ChartConfiguration = {
                    type: chartType as keyof ChartTypeRegistry,
                    data: data
                        ? {
                              labels: data.labels,
                              datasets: data.datasets.map((dataset) => ({
                                  ...dataset,
                                  backgroundColor: chartType === "bar" ? graphColor : "transparent",
                                  borderColor: graphColor,
                                  borderWidth: chartType === "line" ? 2 : 0,
                                  pointBackgroundColor: chartType === "line" ? graphColor : undefined,
                                  pointBorderColor: chartType === "line" ? graphColor : undefined,
                                  pointHoverBackgroundColor: chartType === "line" ? graphColor : undefined,
                                  pointHoverBorderColor: chartType === "line" ? graphColor : undefined,
                                  borderRadius: chartType === "bar" ? 8 : undefined,
                                  borderSkipped: false,
                                  barPercentage: 0.8,
                                  categoryPercentage: 0.9,
                              })),
                          }
                        : { labels: [], datasets: [] },
                    options: {
                        responsive: false,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: chartTitle !== "",
                                text: chartTitle,
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
                                    display: xAxisLabel !== "",
                                    text: xAxisLabel,
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
                                    maxRotation: 45,
                                    minRotation: 45,
                                },
                                adapters: {
                                    date: {
                                        locale: enUS,
                                    },
                                },
                            },
                            y: {
                                title: {
                                    display: yAxisLabel !== "",
                                    text: yAxisLabel,
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
                                beginAtZero: true,
                            },
                        },
                        elements: {
                            line: {
                                tension: 0.4,
                            },
                            point: {
                                radius: chartType === "line" ? 4 : 0,
                                hoverRadius: chartType === "line" ? 6 : 0,
                            },
                        },
                        layout: {
                            padding: {
                                left: 12,
                                right: 12,
                                top: 12,
                                bottom: 12,
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

                chartInstance.current = new Chart(ctx, config);
            }
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [data, chartRef, chartType, theme, textSize, aspectRatio, chartTitle, xAxisLabel, yAxisLabel, graphColor]);

    return (
        <div
            ref={containerRef}
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "12px",
                overflow: "hidden",
            }}
        >
            <canvas
                ref={chartRef}
                style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    borderRadius: "12px",
                }}
            />
        </div>
    );
};

export default GraphRenderer;
