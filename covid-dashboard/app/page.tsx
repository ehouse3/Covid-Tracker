/* Euan House, July 2025, Covid Dashboard **/
/* Main Dashboard react page **/

"use client";
import { useState } from "react";
import { Button, StateItem } from "./components";

import { SelectChangeEvent } from "@mui/material/Select";

import { State, datum, fetchState } from "../parser";

// List and Display List of metrics in order, except date and state (always required for rendering)
const metricsMap = new Map<keyof datum, string>([
  ["death", "Deaths"],
  ["deathConfirmed", "Confirmed Deaths"],
  ["deathIncrease", "Increased Deaths"],
  ["deathProbable", "Probable Deaths"],
  ["hospitalized", "Hospitalizations"],
  ["hospitalizedCumulative", "Cumulative Hospitalizations"],
  ["hospitalizedCurrently", "Currently Hospitalized"],
  ["hospitalizedIncrease", "Increase Hospitalizations"],
  ["inIcuCumulative", "Cumulative in ICU"],
  ["inIcuCurrently", "Currently in ICU "],
  ["negative", "Negatives"],
  ["negativeIncrease", "Increase Negatives"],
  ["negativeTestsAntibody", "Negative Antibody Tests"],
  ["negativeTestsPeopleAntibody", "Negative Antibody Tests People"],
  ["negativeTestsViral", "Negative Viral Tests"],
  ["onVentilatorCumulative", "Cumulativly on Ventilator"],
  ["onVentilatorCurrently", "Currently on Ventilator"],
  ["positive", "Positive"],
  ["positiveCasesViral", "Positive Viral Cases"],
  ["positiveIncrease", "Positive Increase"],
  ["positiveScore", "Positive Score"],
  ["positiveTestsAntibody", "Positive Tests Antibody"],
  ["positiveTestsAntigen", "Positive Antigen Tests"],
  ["positiveTestsPeopleAntibody", "Positive Antibody Tests People"],
  ["positiveTestsPeopleAntigen", "Positive Antigen Tests Peopel"],
  ["positiveTestsViral", "Positive Viral Tests"],
  ["recovered", "Recovered"],
  ["totalTestEncountersViral", "Total Viral Test Encounters"],
  ["totalTestEncountersViralIncrease", "Total Viral Test Encounters Increase"],
  ["totalTestResults", "Total Test Results"],
  ["totalTestResultsIncrease", "Total Test Results Increase"],
  ["totalTestsAntibody", "Total Antibody Tests"],
  ["totalTestsAntigen", "Total Antigen Tests"],
  ["totalTestsPeopleAntibody", "Total Antibody Tests People "],
  ["totalTestsPeopleAntigen", "Total Antigen Tests People"],
  ["totalTestsPeopleViral", "Total Viral Tests People "],
  ["totalTestsPeopleViralIncrease", "Total Increase Viral Tests People"],
  ["totalTestsViral", "Total Viral Tests"],
  ["totalTestsViralIncrease", "Total Increase Viral Tests"],
]);

// Map of state's abbreviations to state's fullname
const abbrevMap = new Map<string, string>([
  ["AL", "Alabama"],
  ["AK", "Alaska"],
  ["AZ", "Arizona"],
  ["AR", "Arkansas"],
  ["CA", "California"],
  ["CO", "Colorado"],
  ["CT", "Connecticut"],
  ["DE", "Delaware"],
  ["FL", "Florida"],
  ["GA", "Georgia"],
  ["HI", "Hawaii"],
  ["ID", "Idaho"],
  ["IL", "Illinois"],
  ["IN", "Indiana"],
  ["IA", "Iowa"],
  ["KS", "Kansas"],
  ["KY", "Kentucky"],
  ["LA", "Louisiana"],
  ["ME", "Maine"],
  ["MD", "Maryland"],
  ["MA", "Massachusetts"],
  ["MI", "Michigan"],
  ["MN", "Minnesota"],
  ["MS", "Mississippi"],
  ["MO", "Missouri"],
  ["MT", "Montana"],
  ["NE", "Nebraska"],
  ["NV", "Nevada"],
  ["NH", "New Hampshire"],
  ["NJ", "New Jersey"],
  ["NM", "New Mexico"],
  ["NY", "New York"],
  ["NC", "North Carolina"],
  ["ND", "North Dakota"],
  ["OH", "Ohio"],
  ["OK", "Oklahoma"],
  ["OR", "Oregon"],
  ["PA", "Pennsylvania"],
  ["RI", "Rhode Island"],
  ["SC", "South Carolina"],
  ["SD", "South Dakota"],
  ["TN", "Tennessee"],
  ["TX", "Texas"],
  ["UT", "Utah"],
  ["VT", "Vermont"],
  ["VA", "Virginia"],
  ["WA", "Washington"],
  ["WV", "West Virginia"],
  ["WI", "Wisconsin"],
  ["WY", "Wyoming"],
]);

export default function Dashboard() {
  const [nextId, setNextId] = useState<number>(0); // Id for state component key
  const [states, setStates] = useState<State[]>([]); // React state to store list of rendered State components

  /** Adds state to active state list w/ id. Fetches state's data. Initializes selectedMetrics map */
  async function addState(s: State): Promise<void> {
    if (states.length > 6) {
      return;
    }

    s = await fetchState(s);
    console.log("page.tsx fetch state returned: ", s);

    setStates([
      ...states,
      {
        ...s,
        id: nextId,
        selectedMetrics: new Map<keyof datum, string>([]), // initializing empty selectedMetrics Map to be appended later
      },
    ]);
    setNextId((prevId) => ++prevId);
  }

  /** Removes active state from state list */
  function removeState(s: State): void {
    setStates(states.filter((st) => st.id !== s.id));
  }

  /** Moves displayed state up one position */
  function ascendState(s: State): void {
    const index = states.findIndex((st) => st.id === s.id);
    if (index !== 0) {
      const newStates = [...states];
      const temp: State = newStates[index];
      newStates[index] = newStates[index - 1];
      newStates[index - 1] = temp;
      setStates(newStates);
    }
  }

  /** Moves displayed state down one position */
  function descendState(s: State): void {
    const index = states.findIndex((st) => st.id === s.id);
    if (index < states.length - 1) {
      const newStates = [...states];
      const temp: State = newStates[index];
      newStates[index] = newStates[index + 1];
      newStates[index + 1] = temp;
      setStates(newStates);
    }
  }

  /** Handles onChange for MetricDropDownComponent. Updates the corresponding state's selected metrics */
  function handleMetricDropdownChange(
    e: SelectChangeEvent<(keyof datum)[]>,
    s: State,
  ): void {
    const metrics = e.target.value as (keyof datum)[];
    const sIndex = states.findIndex((st) => st.id === s.id);
    const newStates = [...states];

    if (newStates[sIndex].selectedMetrics === undefined) {
      return;
    }

    // Assigning selectedMetrics for corresponding state
    const newMetrics = new Map<keyof datum, string>([]);
    metrics.forEach((metric) => {
      newMetrics.set(metric, metricsMap.get(metric) ?? "");
    });
    newStates[sIndex].selectedMetrics = newMetrics;

    setStates(newStates);
  }

  /** Takes in array of values and window size (ex. 7). Returns populated array of window sized rolling averages */
  function calculateRollingAverage(
    data: (number | null | undefined)[],
    window: number,
  ): (number | null)[] {
    const results: (number | null)[] = [];
    for (let i = 0; i < data.length; i++) {
      let sum: number = 0;
      let count: number = 0;
      for (let j = i - window / 2; j < i + window / 2; j++) {
        // calculates individual rolling average. Between +-window/2
        if (data[Math.trunc(j)] !== null && j >= 0 && j < data.length) {
          // keep valid bound results
          sum = sum + Number(data[Math.trunc(j)]);
          count++;
        }
      }
      if (count !== 0) {
        // assign average or null when no average could be found
        results.push(sum / count);
      } else {
        results.push(null);
      }
    }
    return results;
  }

  /** Handles submit event for adding new state button, calling addState if appropriate */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const stateAbbrev =
      formData.get("stateAbbrev")?.toString().toUpperCase() ?? "";

    if (abbrevMap.has(stateAbbrev)) {
      addState({ abbrev: stateAbbrev });
    }
  }

  // Dashboard return
  return (
    <main className="font-main mx-10 my-10 flex flex-row flex-wrap items-center text-2xl">
      <div className="bg-foreground border-foreground-border flex basis-full flex-row justify-between rounded-xl border-4 p-1">
        <div className="w-1/3"></div>
        <h1 className="w-1/3 text-center text-5xl font-bold">
          Covid Tracking Dashboard
        </h1>
        <div className="flex-box flex w-1/3 justify-end">
          <form onSubmit={handleSubmit}>
            <input
              name="stateAbbrev"
              className="text-text-contrast bg-text m-1 rounded-md px-2"
              type="text"
              placeholder="e.g. NY"
              autoCapitalize="characters"
            ></input>
            <Button type="submit" buttonText="ADD STATE" />
          </form>
        </div>
      </div>
      {states.map(
        (state) =>
          state.id !== undefined && (
            <StateItem
              key={state.id}
              state={state}
              abbrevMap={abbrevMap}
              metricsMap={metricsMap}
              ascendState={() => ascendState(state)}
              descendState={() => descendState(state)}
              removeState={() => removeState(state)}
              dropDownMetricChangeHandler={(e: SelectChangeEvent<string[]>) =>
                handleMetricDropdownChange(
                  e as SelectChangeEvent<(keyof datum)[]>,
                  state,
                )
              }
              calculateRollingAverage={calculateRollingAverage}
            />
          ),
      )}
    </main>
  );
}
