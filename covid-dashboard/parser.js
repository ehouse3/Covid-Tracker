"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchState = fetchState;
var Papa = require("papaparse");
function fetchState(state) {
    fetch('data/all-states-history.csv')
        .then(function (response) { return response.text(); })
        .then(function (csvText) {
        Papa.parse(csvText, {
            header: true,
            complete: function (results) {
                results.data.forEach(function (datum) {
                    if (datum.state == state) {
                        console.log(datum);
                        nullifyEmptyValues(datum);
                    }
                });
            },
        });
    });
}
/** Modifies each empty string property of datum to null, leaving non-empty values */
function nullifyEmptyValues(datum) {
    // const fixedDatum = Object.values(datum).map((value) => {
    //     if(value == "") {
    //         return null;
    //     } 
    //     return value;
    // })
    // 
    // //manually convert each property explicitly from an array back to interface? 
    // return fixedDatum as datum;
    var fixedDatum = __assign({}, datum);
    for (var k in fixedDatum) {
        var key = k;
        if (fixedDatum[key] === "") {
            fixedDatum[key] = null; //there HAS to be a better way
        }
    }
    console.log("type of date", typeof (fixedDatum.date), " type of death", typeof (fixedDatum.death));
    return fixedDatum;
}
