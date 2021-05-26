let myChart = new Chart();

function dataSet(data) {
    let array = [];
    for (let i in data) {
        let obj = {
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
        array.push(obj);
    }
    return array;
}

function drawCharts(data) {
    myChart.destroy();
    let N;
    for (let i in data) {
        N = data[i].length;
        break;
    }
    const labels =
        Array.apply(null, {length: N}).map(Number.call, Number);

    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        title: {
            text: 'Simple Line Chart'
        },
        data: {
            labels: labels,
            datasets: dataSet(data)
        },

        options:
            {
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

function drawAnomaly(anomalies){
    myChart.datasets.push({data: [1,2,3,4,5,6,7],
        label: "avi",
        fill: false,
        pointBackgroundColor: 'red',
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
        backgroundColor: 'red',
    })
}