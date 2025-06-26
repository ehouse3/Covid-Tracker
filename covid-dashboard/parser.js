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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchState = fetchState;
var Papa = require("papaparse");
// Would be more effictient as an array, then dynamically decrease the number of checks as it runs
// Beginning list of metrics to be changed after checking if all null
var negativeNullMetrics = {
    death: false,
    deathConfirmed: false,
    deathIncrease: false,
    deathProbable: false,
    hospitalized: false,
    hospitalizedCumulative: false,
    hospitalizedCurrently: false,
    hospitalizedIncrease: false,
    inIcuCumulative: false,
    inIcuCurrently: false,
    negative: false,
    negativeIncrease: false,
    negativeTestsAntibody: false,
    negativeTestsPeopleAntibody: false,
    negativeTestsViral: false,
    onVentilatorCumulative: false,
    onVentilatorCurrently: false,
    positive: false,
    positiveCasesViral: false,
    positiveIncrease: false,
    positiveScore: false,
    positiveTestsAntibody: false,
    positiveTestsAntigen: false,
    positiveTestsPeopleAntibody: false,
    positiveTestsPeopleAntigen: false,
    positiveTestsViral: false,
    recovered: false,
    totalTestEncountersViral: false,
    totalTestEncountersViralIncrease: false,
    totalTestResults: false,
    totalTestResultsIncrease: false,
    totalTestsAntibody: false,
    totalTestsAntigen: false,
    totalTestsPeopleAntibody: false,
    totalTestsPeopleAntigen: false,
    totalTestsPeopleViral: false,
    totalTestsPeopleViralIncrease: false,
    totalTestsViral: false,
    totalTestsViralIncrease: false,
};
/** Returns an datum array of requested state */
function fetchState(s) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Parser.ts returning data for: ", s.abbrev);
                    // keeps requested state values; nullyfing, and assigning nullMetrics, while it itterates
                    s = __assign(__assign({}, s), { data: [], nullMetrics: negativeNullMetrics });
                    return [4 /*yield*/, fetch('data/all-states-history.csv')
                            .then(function (response) { return response.text(); })
                            .then(function (csvText) {
                            Papa.parse(csvText, {
                                header: true,
                                complete: function (results) {
                                    var _a;
                                    for (var i = 0; i < results.data.length; i++) { // TODO Coalesce other requests from page.tsx
                                        if (results.data[i].state === s.abbrev) {
                                            var datum = nullifyEmptyMetrics(results.data[i]);
                                            s.nullMetrics = setNullMetrics(datum, s);
                                            (_a = s.data) === null || _a === void 0 ? void 0 : _a.push(datum);
                                        }
                                    }
                                },
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, s];
            }
        });
    });
}
/** Returns datum with empty string properties replaced with null */
function nullifyEmptyMetrics(datum) {
    for (var k in datum) {
        var key = k;
        if (datum[key] === "") {
            datum[key] = null; // There HAS to be a better way
        }
    }
    return datum;
}
/** Returns nullMetrics, where nullMetrics.prop is set to true if index's metric is non-null, unchanged otherwise */
function setNullMetrics(data, s) {
    for (var k in data) {
        if (data[k] !== null) {
            if (s.nullMetrics !== undefined) {
                s.nullMetrics[k] = true;
            }
        }
    }
    return s.nullMetrics;
}
