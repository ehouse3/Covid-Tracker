import * as Papa from 'papaparse';

interface datum {
    date:string|null,
    state:string|null, 
    death:number|null, 
    deathConfirmed:number|null, 
    deathIncrease:number|null,
    deathProbable:number|null,
    hospitalized:number|null, 
    hospitalizedCumulative:number|null,
    hospitalizedCurrently:number|null,
    hospitalizedIncrease:number|null,
    inIcuCumulative:number|null,
    inIcuCurrently:number|null,
    negative:number|null,
    negativeIncrease:number|null,
    negativeTestsAntibody:number|null,
    negativeTestsPeopleAntibody:number|null,
    negativeTestsViral:number|null, 
    onVentilatorCumulative:number|null,
    onVentilatorCurrently:number|null,
    positive:number|null,
    positiveCasesViral:number|null,
    positiveIncrease:number|null,
    positiveScore:number|null, 
    positiveTestsAntibody:number|null,
    positiveTestsAntigen:number|null,
    positiveTestsPeopleAntibody:number|null,
    positiveTestsPeopleAntigen:number|null,
    positiveTestsViral:number|null,
    recovered:number|null,
    totalTestEncountersViral:number|null,
    totalTestEncountersViralIncrease:number|null,
    totalTestResults:number|null,
    totalTestResultsIncrease:number|null, 
    totalTestsAntibody:number|null,
    totalTestsAntigen:number|null,
    totalTestsPeopleAntibody:number|null,
    totalTestsPeopleAntigen:number|null,
    totalTestsPeopleViral:number|null, 
    totalTestsPeopleViralIncrease:number|null,
    totalTestsViral:number|null,
    totalTestsViralIncrease:number|null
}

/** Returns an datum array of requested state */
export function fetchState(state:string) {
    fetch('data/all-states-history.csv')
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                complete: function(results:Papa.ParseResult<datum>) {
                    const cleanedData:datum[] = [];
                    // keeps requested state values, nullyfing while it itterates
                    for(let i = 0; i < results.data.length; i++) { 
                        if(results.data[i].state === state) {
                            const datum:datum = nullifyEmptyValues(results.data[i]);
                            cleanedData.push(datum);
                        }
                    }
                    
                    return cleanedData;
                },
            });
        }
    )
}

/** Returns datum, with empty string properties replaced with null */
function nullifyEmptyValues(datum:datum) {
    const fixedDatum:datum = { ...datum };
    for (const k in fixedDatum) {
        const key = k as keyof datum; // allows indexing
        if (fixedDatum[key] === "") {
            (fixedDatum[key] as unknown) = null; // there HAS to be a better way to not use unknown type.
        }
    }

    return fixedDatum;
}
