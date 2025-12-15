import * as Papa from "papaparse";

import { State, datum, negativeNullMetrics, nullMetrics } from "./app/lib/types"

/** Returns an datum array of requested state */
export async function fetchState(s: State) {
  console.log("Parser.ts returning data for: ", s.abbrev);
  // keeps requested state values; nullyfing, and assigning nullMetrics, while it itterates
  s = {
    ...s, // keep abbrev
    data: [],
    nullMetrics: negativeNullMetrics,
  };

  await fetch("data/all-states-history.csv")
    .then((response) => response.text())
    .then((csvText) => {
      Papa.parse(csvText, {
        header: true,
        complete: function (results: Papa.ParseResult<datum>) {
          for (let i = 0; i < results.data.length; i++) {
            // TODO Coalesce other requests from page.tsx
            if (results.data[i].state === s.abbrev) {
              const datum: datum = nullifyEmptyMetrics(results.data[i]);
              s.nullMetrics = setNullMetrics(datum, s);

              s.data?.push(datum);
            }
          }
        },
      });
    });

  return s;
}

/** Returns datum with empty string properties replaced with null */
function nullifyEmptyMetrics(datum: datum) {
  for (const k in datum) {
    const key = k as keyof datum;
    if (datum[key] === "") {
      (datum[key] as (typeof datum)[typeof key] | null) = null; // There HAS to be a better way
    }
  }

  return datum;
}

/** Returns nullMetrics, where nullMetrics.prop is set to true if index's metric is non-null, unchanged otherwise */
function setNullMetrics(data: Omit<datum, "date" | "state">, s: State) {
  for (const k in data) {
    if (data[k as keyof nullMetrics] !== null) {
      if (s.nullMetrics !== undefined) {
        s.nullMetrics[k as keyof nullMetrics] = true;
      }
    }
  }

  return s.nullMetrics;
}
