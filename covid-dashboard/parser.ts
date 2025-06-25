import * as Papa from 'papaparse';

export interface datum {
    date: string,
    state: string,
    death: number | null,
    deathConfirmed: number | null,
    deathIncrease: number | null,
    deathProbable: number | null,
    hospitalized: number | null,
    hospitalizedCumulative: number | null,
    hospitalizedCurrently: number | null,
    hospitalizedIncrease: number | null,
    inIcuCumulative: number | null,
    inIcuCurrently: number | null,
    negative: number | null,
    negativeIncrease: number | null,
    negativeTestsAntibody: number | null,
    negativeTestsPeopleAntibody: number | null,
    negativeTestsViral: number | null,
    onVentilatorCumulative: number | null,
    onVentilatorCurrently: number | null,
    positive: number | null,
    positiveCasesViral: number | null,
    positiveIncrease: number | null,
    positiveScore: number | null,
    positiveTestsAntibody: number | null,
    positiveTestsAntigen: number | null,
    positiveTestsPeopleAntibody: number | null,
    positiveTestsPeopleAntigen: number | null,
    positiveTestsViral: number | null,
    recovered: number | null,
    totalTestEncountersViral: number | null,
    totalTestEncountersViralIncrease: number | null,
    totalTestResults: number | null,
    totalTestResultsIncrease: number | null,
    totalTestsAntibody: number | null,
    totalTestsAntigen: number | null,
    totalTestsPeopleAntibody: number | null,
    totalTestsPeopleAntigen: number | null,
    totalTestsPeopleViral: number | null,
    totalTestsPeopleViralIncrease: number | null,
    totalTestsViral: number | null,
    totalTestsViralIncrease: number | null,
}

// Does not include 'date' or 'state' as they can not be null
export interface nullMetrics {
    death: boolean,
    deathConfirmed: boolean,
    deathIncrease: boolean,
    deathProbable: boolean,
    hospitalized: boolean,
    hospitalizedCumulative: boolean,
    hospitalizedCurrently: boolean,
    hospitalizedIncrease: boolean,
    inIcuCumulative: boolean,
    inIcuCurrently: boolean,
    negative: boolean,
    negativeIncrease: boolean,
    negativeTestsAntibody: boolean,
    negativeTestsPeopleAntibody: boolean,
    negativeTestsViral: boolean,
    onVentilatorCumulative: boolean,
    onVentilatorCurrently: boolean,
    positive: boolean,
    positiveCasesViral: boolean,
    positiveIncrease: boolean,
    positiveScore: boolean,
    positiveTestsAntibody: boolean,
    positiveTestsAntigen: boolean,
    positiveTestsPeopleAntibody: boolean,
    positiveTestsPeopleAntigen: boolean,
    positiveTestsViral: boolean,
    recovered: boolean,
    totalTestEncountersViral: boolean,
    totalTestEncountersViralIncrease: boolean,
    totalTestResults: boolean,
    totalTestResultsIncrease: boolean,
    totalTestsAntibody: boolean,
    totalTestsAntigen: boolean,
    totalTestsPeopleAntibody: boolean,
    totalTestsPeopleAntigen: boolean,
    totalTestsPeopleViral: boolean,
    totalTestsPeopleViralIncrease: boolean,
    totalTestsViral: boolean,
    totalTestsViralIncrease: boolean,
}

// Would be more effictient as an array, then dynamically decrease the number of checks as it runs
// Beginning list of metrics to be changed after checking if all null
const negativeNullMetrics: nullMetrics = {
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
}

/** State information */
export interface State {
  id?: number, //unique
  abbrev: string,
  data?: datum[], // array of state's data from csv
  selectedMetrics?: (keyof datum)[], // selected data metrics to be displayed by the graph
  nullMetrics?: nullMetrics, // prop is true if all of that metric's props is Null, false otherwise
}


/** Returns an datum array of requested state */
export async function fetchState(s: State) {
    console.log("Parser.ts returning data for: ", s.abbrev);
    // keeps requested state values; nullyfing, and assigning nullMetrics, while it itterates
    s = {
        ...s, // keep abbrev
        data: [],
        nullMetrics: negativeNullMetrics,
    };
    
    await fetch('data/all-states-history.csv')
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                complete: function (results: Papa.ParseResult<datum>) {
                    
                    for (let i = 0; i < results.data.length; i++) { // TODO Coalesce other requests from page.tsx
                        if (results.data[i].state === s.abbrev) {
                            const datum: datum = nullifyEmptyMetrics(results.data[i]);
                            s.nullMetrics = setNullMetrics(datum, s);

                            s.data?.push(datum);
                        }
                    }
                },
            });
        }
    )

    return s;
}

/** Returns datum with empty string properties replaced with null */
function nullifyEmptyMetrics(datum: datum) {
    for (const k in datum) {
        const key = k as keyof datum;
        if (datum[key] === "") {
            (datum[key] as typeof datum[typeof key] | null) = null; // There HAS to be a better way
        }
    }

    return datum;
}

/** Returns nullMetrics, where nullMetrics.prop is set to true if index's metric is non-null, unchanged otherwise */
function setNullMetrics(data: Omit<datum, 'date' | 'state'>, s: State) {
    for (const k in data) {
        if (data[k as keyof nullMetrics] !== null) {
            if(s.nullMetrics !== undefined) { 
                s.nullMetrics[k as keyof nullMetrics] = true; 
            }
        }
    }

    return s.nullMetrics;
}
