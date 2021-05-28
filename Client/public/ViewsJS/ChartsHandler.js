let myChart;
let maxValue = 0;

function dataSet(data) {
    const array = [];

    for (const i in data) {
        const obj = {
            data: data[i],
            label: i,
            fill: false,
            pointBackgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
            pointBorderColor: 'blue',
            pointHoverBorderColor: 'black',
            pointRadius: 1,
            pointHitRadius: 10,
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
            backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
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
                            color: 'red',
                            text: 'TIME',
                            display: true,
                        },
                    }
                }
            }
    });
};

function drawAnomaly({anomalies, reason}) {
    const parsedData = []
    const data = Object.values(anomalies)[0].map(item => {
        const a = item.map(point => {
            return {x: point, y: maxValue};
        })

        return a;
    });

    data.forEach(pointsArray => {
        pointsArray.forEach(point => parsedData.push(point))
    })

    myChart.data.datasets.push({
        label: "Anomalies",

        // data: [{x: 1, y: maxValue, barThickness: 1}, {x: 2, y: maxValue, barThickness: 1}, {
        //     x: 3,
        //     y: maxValue,
        //     barThickness: 1
        // }, {
        //     x: 0,
        //     y: maxValue,
        //     barThickness: 0.5
        // }],

        data: parsedData,
        type: "bar",
        fill: false,
        options:
            {
                scales: {
                    y: {
                        beginAtZero: true,
                    },


                }
            },
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1,
        backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16),
    });
    myChart.update();
}