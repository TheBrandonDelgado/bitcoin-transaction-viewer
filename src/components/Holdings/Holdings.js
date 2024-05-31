import React, { useState, useEffect } from 'react';
import './Holdings.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

function Holdings({ fullAddressHistory }) {
    const [ chartData, setChartData ] = useState();

    useEffect(() => {
        // Prepare the data for the chart
        console.log(fullAddressHistory)
        if (fullAddressHistory && fullAddressHistory.length > 0) {
            const data = {
                labels: fullAddressHistory.filter(tx => tx.status.confirmed === true).map(tx => new Date(tx.status.block_time * 1000).toLocaleDateString()),
                datasets: [
                    {
                        label: 'Balance Value (EUR)',
                        data: fullAddressHistory.filter(tx => tx.status.confirmed === true).map(tx => tx.balanceValue),
                        fill: false,
                        borderColor: 'rgba(75,192,192,1)',
                        tension: 0.1
                    }
                ]
            };

            console.log(data)

            setChartData(data);
        }
    }, [fullAddressHistory]);

    // Options for the chart
    const chartOptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Balance Value (USD)'
                }
            }
        },
        plugins: {
            legend: {
                display: true,
                position: 'top'
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    return (
        <div className="holdings">
            <div className="holdings-header">
                <h2>Holdings</h2>
            </div>
            <div className="chart-container">
                { chartData && <Line data={chartData} options={chartOptions} />}
            </div>
        </div>
    );
}

export default Holdings;