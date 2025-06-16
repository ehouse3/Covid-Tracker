"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Papa = require("papaparse");
var file = fetch('data/all-states-history.csv')
    .then(function (response) { return response.text(); })
    .then(function (csvText) {
    Papa.parse(csvText, {
        worker: true,
        header: true,
        step: function (row) {
            // console.log("Row:", row.data);
        },
        complete: function (results) {
            console.log("complete");
        },
    });
});
