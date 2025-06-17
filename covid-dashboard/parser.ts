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

export function fetchState(state:string) {
    fetch('data/all-states-history.csv')
        .then(response => response.text())
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                complete: function(results:Papa.ParseResult<datum>) {
                    results.data.forEach((datum) => {
                        if(datum.state == state) {
                            datum = nullifyEmptyValues(datum);
                        }
                    });
                    
                },
            });
        }
    )
}

/** Modifies each empty string property of datum to null, leaving non-empty values */
function nullifyEmptyValues(datum:datum) {
    // const fixedDatum = Object.values(datum).map((value) => {
    //     if(value === "") {
    //         return null;
    //     } 
    //     return value;
    // })
    // 
    // //manually convert each property explicitly from an array back to interface? 
    // return fixedDatum as datum;

    const fixedDatum:datum = { ...datum };
    for (const k in fixedDatum) {
        const key = k as keyof datum; //cast to datum property type

        if (fixedDatum[key] === "") {
            (fixedDatum[key] as unknown) = null; //there HAS to be a better way.
        }
    }
    return fixedDatum;
}



