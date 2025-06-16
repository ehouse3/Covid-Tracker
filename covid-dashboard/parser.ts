import * as Papa from 'papaparse';

fetch('data/all-states-history.csv')
    .then(response => response.text())
    .then(csvText => {
        Papa.parse(csvText, {
            worker: true,
            header: true,
            step: function(row) {
                console.log("Row:", row.data);
            },
            complete: (results) => {
                console.log("Parsed Results:", results);
                console.log("complete"); 
            },
        });
    })


