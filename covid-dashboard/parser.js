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
/** Returns an datum array of requested state */
function fetchState(state) {
    fetch('data/all-states-history.csv')
        .then(function (response) { return response.text(); })
        .then(function (csvText) {
        Papa.parse(csvText, {
            header: true,
            complete: function (results) {
                var cleanedData = [];
                // keeps requested state values, nullyfing while it itterates
                for (var i = 0; i < results.data.length; i++) {
                    if (results.data[i].state === state) {
                        var datum = nullifyEmptyValues(results.data[i]);
                        cleanedData.push(datum);
                    }
                }
                return cleanedData;
            },
        });
    });
}
/** Modifies each empty string property of a datum to null, leaving non-empty values */
function nullifyEmptyValues(datum) {
    var fixedDatum = __assign({}, datum);
    for (var k in fixedDatum) {
        var key = k; //cast to datum property type
        if (fixedDatum[key] === "") {
            fixedDatum[key] = null; //there HAS to be a better way to not use unknown.
        }
    }
    return fixedDatum;
}
