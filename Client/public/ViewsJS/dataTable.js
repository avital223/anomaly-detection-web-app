function addDataToTable(data) {
    const thAn = document.getElementById('theadAn');
    if (thAn !== null) {
        thAn.parentElement.removeChild(thAn);
    }
    const table = document.getElementById('dataTable');
    const th = document.getElementById('thead');
    if (th !== null) {
        th.parentElement.removeChild(th);
    }
    let thead = table.createTHead();
    thead.id = 'thead';
    for (const key in data) {
        let row = thead.insertRow();
        row.id = key;
        let th = document.createElement('th');
        th.innerText = key;
        row.appendChild(th);
        data[key].forEach(d => {
            const td = document.createElement('td');
            td.innerText = d;
            row.appendChild(td);
        });
    }
}

function markAnomalies(anomalies) {
    for (const anomaly of anomalies) {
        const key = Object.keys(anomaly).filter(k => k !== 'reason')[0];
        if (anomaly[key].length !== 0) {
            const anomaliesArray = anomaly[key];
            for (const specificAnomaly in anomaliesArray) {
                const anomalyRow = document.getElementById(key);
                for (let i = anomaliesArray[specificAnomaly].start + 1; i <= anomaliesArray[specificAnomaly].end; i++) {
                    anomalyRow.cells.item(i).className = 'anomaly';
                }
            }
        }
    }
}

function printTableAnomalies(anomalies) {

    const table = document.getElementById('anomalies');
    const th = document.getElementById('theadAn');
    if (th !== null) {
        th.parentElement.removeChild(th);
    }
    let thead = table.createTHead();
    thead.id = 'theadAn';
    let row = thead.insertRow();
    let TH = document.createElement('th');
    let count = false;
    for (let anomaly of anomalies) {
        const key = Object.keys(anomaly).filter(k => k !== 'reason')[0];
        if (anomaly[key].length !== 0) count = true;
    }
    if (count === false) {
        TH.innerText = 'No Anomalies Found';
        row.appendChild(TH);
        return;
    }
    TH.innerText = 'key';
    row.appendChild(TH);
    TH = document.createElement('th');
    TH.innerText = 'time';
    row.appendChild(TH);
    TH = document.createElement('th');
    TH.innerText = 'reason';
    row.appendChild(TH);
    for (const anomaly of anomalies) {
        const key = Object.keys(anomaly).filter(k => k !== 'reason')[0];
        if (anomaly[key].length !== 0) {
            const anomaliesArray = anomaly[key];
            for (const specificAnomaly in anomaliesArray) {
                let row = thead.insertRow();
                let td = document.createElement('td');
                td.innerText = key;
                row.appendChild(td);
                td = document.createElement('td');
                td.innerText = ' [ ' + anomaliesArray[specificAnomaly].start + ' , ' + anomaliesArray[specificAnomaly].end + ' ) ';
                row.appendChild(td);
                td = document.createElement('td');
                td.innerText = 'The Other Feature : ' + anomaly['reason'][specificAnomaly].otherFeature
                    + ' The Max Dev : ' + anomaly['reason'][specificAnomaly].maxDev
                    + ' The Average Dev : ' + anomaly['reason'][specificAnomaly].avgDev
                    + ' The Min Dev : ' + anomaly['reason'][specificAnomaly].minDev;
                row.appendChild(td);
            }
        }
    }
}
