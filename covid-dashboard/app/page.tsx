'use client';
import { useState, useRef } from 'react';

import { LineChart } from "@mui/x-charts";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import { State, datum, fetchState } from "../parser";

export default function Dashboard() {
  const nextId = useRef(0);
  const [states, setStates] = useState<State[]>([]);

  // Metrics List and Metrics List to be displayed of data
  const dataList: (keyof datum)[] = ["death", "deathConfirmed", "deathIncrease", "deathProbable", "hospitalized", "hospitalizedCumulative", "hospitalizedCurrently", "hospitalizedIncrease", "inIcuCumulative", "inIcuCurrently", "negative", "negativeIncrease", "negativeTestsAntibody", "negativeTestsPeopleAntibody", "negativeTestsViral", "onVentilatorCumulative", "onVentilatorCurrently", "positive", "positiveCasesViral", "positiveIncrease", "positiveScore", "positiveTestsAntibody", "positiveTestsAntigen", "positiveTestsPeopleAntibody", "positiveTestsPeopleAntigen", "positiveTestsViral", "recovered", "totalTestEncountersViral", "totalTestEncountersViralIncrease", "totalTestResults", "totalTestResultsIncrease", "totalTestsAntibody", "totalTestsAntigen", "totalTestsPeopleAntibody", "totalTestsPeopleAntigen", "totalTestsPeopleViral", "totalTestsPeopleViralIncrease", "totalTestsViral", "totalTestsViralIncrease"];
  const dataListPretty: string[] = ["Deaths", "Confirmed Deaths", "Increased Deaths", "Probable Deaths", "Hospitalizations", "Cumulative Hospitalizations", "Currently Hospitalized", "Increase Hospitalizations", "Cumulative in ICU", "Currently in ICU ", "Negatives", "Increase Negatives", "Negative Antibody Tests", "Negative Antibody Tests People", "Negative Viral Tests", "Cumulativly on Ventilator", "Currently on Ventilator", "Positive", "Positive Viral Cases", "Positive Increase", "Positive Score", "Positive Tests Antibody", "Positive Antigen Tests", "Positive Antibody Tests People", "Positive Antigen Tests Peopel", "Positive Viral Tests", "Recovered", "Total Viral Test Encounters", "Total Viral Test Encounters Increase", "Total Test Results", "Total Test Results Increase", "Total Antibody Tests", "Total Antigen Tests", "Total Antibody Tests People ", "Total Antigen Tests People", "Total Viral Tests People ", "Total Increase Viral Tests People", "Total Viral Tests", "Total Increase Viral Tests"];

  interface StateItemProps {
    state: State,
    ascendState: (s: State) => void,
    descendState: (s: State) => void,
    removeState: (s: State) => void
  }

  /** StateItem Component that displays a single state. Includes title, metric selector, movement buttons and graph */
  function StateItem(props: StateItemProps) { // Being called multiple times... useEffect might fix?
    /** Returns datum.date in "Mon Year" format */
    // console.log(props.state);
    const formatDate = (d: string) => {
      const date = new Date(d);
      return date;
    };

    return (
      <div key={props.state.id} className="flex flex-row justify-between flex-wrap bg-foreground rounded-xl p-2 my-7 border-0 border-foreground-border">
        <div className="flex flex-row w-full">
          <div className="w-1/3">
            <Dropdown
              items={dataList.map((val, index) => { // List of metrics to choose
                if (props.state.nullMetrics && props.state.nullMetrics[val as keyof (typeof props.state.nullMetrics)]) { // Strikes through displayed metrics that are all null
                  return <MenuItem value={val} key={val}><p className="inline font-medium text-xl">{dataListPretty[index]}</p></MenuItem>;
                } else {
                  return <MenuItem value={val} key={val}><p className="inline font-medium line-through text-xl">{dataListPretty[index]}</p></MenuItem>;
                }
              })}
              selected={props.state.selected?.metric as string[]}
              onChange={(e) => { handleMetricDropdownChange(e as SelectChangeEvent<(keyof datum)[]>, props.state); }}
            />
          </div>
          <h2 className="w-1/3 flex flex-row flex-nowrap justify-center self-center font-bold text-5xl">{props.state.abbrev}</h2>
          <div className="w-1/3 px-2 flex flex-row flex-nowrap justify-end">
            <Button onClick={() => ascendState(props.state)} buttonText="UP" ></Button>
            <Button onClick={() => descendState(props.state)} buttonText="DOWN" ></Button>
            <Button onClick={() => removeState(props.state)} buttonText="DELETE" ></Button>
          </div>
        </div>

        <div className="basis-full p-2">
          <LineChart
            xAxis={[
              {
                dataKey: "date",
                scaleType: "time",
                data: props.state.data?.map((val) => formatDate(val.date as string)).reverse(),
                valueFormatter: (date) =>
                  date instanceof Date
                    ? date.toLocaleDateString()
                    : date,
              }
            ]}
            series={
              props.state.selected!.metric.map((metric, index) => ( // Returns chronoligically ordered array of data for each metric to display
                {
                  label: props.state.selected!.prettyMetric[index],
                  data: props.state.data?.map((data) => {
                    return data[metric] as number;
                  }).reverse()
                }
              ))
            }
            height={300}
          />
        </div>
      </div>
    )
  }

  interface StateButtonProps {
    onClick?: () => void,
    buttonText?: string,
    type?: "button" | "submit" | "reset",
  }

  /** Button Component that displays a button with callback function for press. */
  function Button(props: StateButtonProps) {
    return (
      <button
        className="px-3 m-2 self-center border-3 rounded-md border-accent-border bg-accent text-text-contrast hover:bg-accent-hover hover:border-accent-border-hover"
        onClick={props.onClick}
        type={props.type}
      >
        {props.buttonText}
      </button>
    )
  }

  interface DropDownProps {
    items: React.ReactNode[], // of the form [<MenuItem value={}>...</MenuItem>...]
    selected: string[],
    onChange: (e: SelectChangeEvent<string[]>) => void,
  }

  /** Dropdown component to select which metrics of data to display */
  function Dropdown(props: DropDownProps) {
    return (
      <div className="m-2 rounded-md border-tertiary-border bg-tertiary">
        <FormControl fullWidth>
          <InputLabel className="bg-tertiary rounded-md" id="demo-simple-select-label"><div className="px-2 text-xl text-text-contrast">Metrics</div></InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            multiple
            value={props.selected}
            onChange={props.onChange}
          >
            {props.items}
          </Select>
        </FormControl>
      </div>
    )
  }

  /** Handles onChange for MetricDropDownComponent. Updates corresponding state's selected metrics */
  function handleMetricDropdownChange(e: SelectChangeEvent<(keyof datum)[]>, s: State) {
    const metrics = e.target.value as (keyof datum)[];
    const sIndex = states.findIndex(st => st.id === s.id);
    const newStates = [...states];

    if (newStates[sIndex].selected === undefined) { return }

    // Assigning new selected metrics and prettyMetrics
    newStates[sIndex].selected.metric = metrics;
    metrics.forEach((metric, i) => {
      // set selected.prettyMetric using index of selected.metric
      const dataIndex = dataList.findIndex(m => m === metric);
      if (newStates[sIndex].selected === undefined) { return }
      newStates[sIndex].selected.prettyMetric[i] = dataListPretty[dataIndex];
    })

    setStates(newStates);
  }

  /** Adds state to active state list w/ id. Fetches state's data as well */
  async function addState(s: State) {
    if (states.length > 6) { return; }

    s = await fetchState(s);
    console.log("page.tsx fetch state returned: ", s);

    setStates([...states, { ...s, id: nextId.current++, selected: { metric: [], prettyMetric: [] } }]);
  }

  /** Removes active state from state list */
  function removeState(s: State) {
    setStates(states.filter(st => st.id !== s.id));
  }

  /** Moves displayed state up one position */
  function ascendState(s: State) {
    const index = states.findIndex(st => st.id === s.id);
    if (index !== 0) {
      const newStates = [...states];
      const temp: State = newStates[index];
      newStates[index] = newStates[index - 1];
      newStates[index - 1] = temp;
      setStates(newStates);
    }
  }

  /** Moves displayed state down one position */
  function descendState(s: State) {
    const index = states.findIndex(st => st.id === s.id);
    if (index < states.length - 1) {
      const newStates = [...states];
      const temp: State = newStates[index];
      newStates[index] = newStates[index + 1];
      newStates[index + 1] = temp;
      setStates(newStates);
    }
  }

  const acceptStates = ["AK", "AL", "AR", "AS", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MP", "MS", "MT", "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"];
  /** Handles submit event, calling addState if appropriate */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const stateAbbrev = (formData.get("stateAbbrev") as string).toUpperCase();

    if (acceptStates.includes(stateAbbrev)) {
      addState({ abbrev: stateAbbrev });
    }
  }

  return (
    <main className="flex flex-row flex-wrap items-center mx-10 my-10 text-2xl font-main">
      <div className="flex flex-row basis-full justify-between bg-foreground p-1 border-4 rounded-xl border-foreground-border">
        <div className="w-1/3"></div>
        <h1 className="w-1/3 text-center text-5xl font-bold">Covid Tracking Dashboard</h1>
        <div className="w-1/3 flex flex-box justify-end">
          <form onSubmit={handleSubmit}>
            <input
              name="stateAbbrev"
              className="px-2 m-1 rounded-md text-text-contrast bg-tertiary"
              type="text" placeholder="e.g. NY" autoCapitalize="characters" />
            <Button type="submit" buttonText="ADD STATE"></Button>
          </form>
        </div>
      </div>
      {states.map((state) => state.id !== undefined && <StateItem key={state.id} state={state} ascendState={ascendState} descendState={descendState} removeState={removeState} />)}
    </main>
  );
}
