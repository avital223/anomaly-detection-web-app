let myChart;
let maxValue = 0;

function dataSet(data) {
    const array = [];

    for (const i in data) {
        let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        const obj = {
            data: data[i],
            label: i,
            fill: false,
            pointBackgroundColor: color,
            pointBorderColor: color,
            pointHoverBorderColor: color,
            pointRadius: 1,
            pointHitRadius: 10,
            borderColor:
            color,
            borderWidth: 1,
            backgroundColor: color,
        }
        const currentMax = Math.max(...data[i]);

        if (maxValue < currentMax) {
            maxValue = currentMax;
        }

        array.push(obj);
    }
    return array;
}

function drawCharts(data) {
    myChart && myChart.destroy();
    let N;
    for (let i in data) {
        N = data[i].length;
        break;
    }
    const labels =
        Array.apply(null, {length: N}).map(Number.call, Number);

    const ctx = document.getElementById('myChart').getContext('2d');

    myChart = new Chart(ctx, {
        responsive: true,
        maintainAspectRatio: false,
        type: 'line',
        title: {
            display: true,
            text: 'Simple Line Chart'
        },
        data: {
            labels: labels,
            datasets: dataSet(data)
        },
        options:
            {
                tooltips: {
                    enabled: false,
                    callbacks: {
                        label: function (tooltipItem, data) {
                            console.log(data);
                            let label = data.datasets[tooltipItem.datasetIndex].label || '';

                            if (label) {
                                label += ': ';
                            }
                            label += Math.round(tooltipItem.yLabel * 100) / 100;
                            return label;
                        }
                    }
                },
                scales: {
                    x: {
                        stacked: true,
                        title: {
                            color: 'black',
                            text: 'Time',
                            display: true,
                        },
                    }
                }
            }
    });
};

function drawAnomaly(anomalies) {
    const parsedData = []
    for (const anomaly of anomalies) {
        const key = Object.keys(anomaly).filter(k => k !== 'reason')[0];
        if (anomaly[key].length !== 0) {
            const anomaliesArray = anomaly[key];
            for (const specificAnomaly in anomaliesArray) {
                for (let i = anomaliesArray[specificAnomaly].start; i < anomaliesArray[specificAnomaly].end; i++) {
                    parsedData.push({x: i, y: maxValue});
                }
            }
        }
    }
    myChart.data.datasets.push({
        label: "Anomalies",
        barPercentage: 1.35,
        data: parsedData,
        type: "bar",
        fill: false,
        options:
            {
                plugins: {
                    tooltips: {
                        enabled: false,
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                    },


                }
            },
        borderColor: "#ff3333",
        borderWidth: 1,
        backgroundColor: "#ff3333",
    });
    myChart.update();
}