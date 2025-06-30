'use client';
import { useState, useRef, ReactElement } from 'react';

import { LineChart } from "@mui/x-charts";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import { State, datum, fetchState } from "../parser";

export default function Dashboard() {
  const nextId = useRef(0); // Id to assign any newly made state
  const [states, setStates] = useState<State[]>([]); // React state to store list of rendered State components

  // List and Display List of metrics in order, except date and state (always required for rendering)
  const metricList: (keyof datum)[] = ["death", "deathConfirmed", "deathIncrease", "deathProbable", "hospitalized", "hospitalizedCumulative", "hospitalizedCurrently", "hospitalizedIncrease", "inIcuCumulative", "inIcuCurrently", "negative", "negativeIncrease", "negativeTestsAntibody", "negativeTestsPeopleAntibody", "negativeTestsViral", "onVentilatorCumulative", "onVentilatorCurrently", "positive", "positiveCasesViral", "positiveIncrease", "positiveScore", "positiveTestsAntibody", "positiveTestsAntigen", "positiveTestsPeopleAntibody", "positiveTestsPeopleAntigen", "positiveTestsViral", "recovered", "totalTestEncountersViral", "totalTestEncountersViralIncrease", "totalTestResults", "totalTestResultsIncrease", "totalTestsAntibody", "totalTestsAntigen", "totalTestsPeopleAntibody", "totalTestsPeopleAntigen", "totalTestsPeopleViral", "totalTestsPeopleViralIncrease", "totalTestsViral", "totalTestsViralIncrease"];
  const metricListPretty: string[] = ["Deaths", "Confirmed Deaths", "Increased Deaths", "Probable Deaths", "Hospitalizations", "Cumulative Hospitalizations", "Currently Hospitalized", "Increase Hospitalizations", "Cumulative in ICU", "Currently in ICU ", "Negatives", "Increase Negatives", "Negative Antibody Tests", "Negative Antibody Tests People", "Negative Viral Tests", "Cumulativly on Ventilator", "Currently on Ventilator", "Positive", "Positive Viral Cases", "Positive Increase", "Positive Score", "Positive Tests Antibody", "Positive Antigen Tests", "Positive Antibody Tests People", "Positive Antigen Tests Peopel", "Positive Viral Tests", "Recovered", "Total Viral Test Encounters", "Total Viral Test Encounters Increase", "Total Test Results", "Total Test Results Increase", "Total Antibody Tests", "Total Antigen Tests", "Total Antibody Tests People ", "Total Antigen Tests People", "Total Viral Tests People ", "Total Increase Viral Tests People", "Total Viral Tests", "Total Increase Viral Tests"];

  // Map of state's abbreviations to state's fullname
  const abbrevMap = new Map<string, string>([["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"], ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"], ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],]);

  interface StateItemProps {
    state: State,
    ascendState: (s: State) => void,
    descendState: (s: State) => void,
    removeState: (s: State) => void
  }
  /** Component for a single state. Includes Name, metric selector, movement buttons and graph */
  function StateItem(props: StateItemProps): ReactElement {
    console.log("as Record",props.state.data as unknown as readonly Record<string, string | number | Date | null | undefined>[]);
    return (
      <div key={props.state.id} className="flex flex-row justify-between flex-wrap bg-foreground rounded-xl p-2 my-7 border-0 border-foreground-border">
        <div className="flex flex-row w-full">
          <div className="w-1/3">
            <Dropdown
              items={metricList.map((metric, index) => {
                return ( // List of metrics to choose
                  <MenuItem value={metric} key={metric}>
                    <StrikeThroughConditional
                      condition={!(props.state.nullMetrics && props.state.nullMetrics[metric as keyof (typeof props.state.nullMetrics)])}
                      text={metricListPretty[index]}
                    ></StrikeThroughConditional>
                  </MenuItem>
                )
              })}
              selected={props.state.selected?.metric as string[]}
              onChange={(e) => { handleMetricDropdownChange(e as SelectChangeEvent<(keyof datum)[]>, props.state); }}
            ></Dropdown>
          </div>
          <h2 className="w-1/3 flex flex-row flex-nowrap justify-center self-center font-bold text-5xl">{abbrevMap.get(props.state.abbrev)}</h2>
          <div className="w-1/3 px-2 flex flex-row flex-nowrap justify-end">
            <Button onClick={() => ascendState(props.state)} buttonText="UP" ></Button>
            <Button onClick={() => descendState(props.state)} buttonText="DOWN" ></Button>
            <Button onClick={() => removeState(props.state)} buttonText="DELETE" ></Button>
          </div>
        </div>

        <div className="basis-full p-2">
          <LineChart
            dataset={props.state.data as unknown as readonly Record<string, string | number | Date | null | undefined>[]}
            xAxis={[
              {
                dataKey: "date",
                scaleType: "time",
                // data: props.state.data?.map((val) => new Date(val.date)).reverse(),
                valueFormatter: (date) =>
                  date instanceof Date
                    ? date.toLocaleDateString()
                    : date,
              }
            ]}
            series={
              props.state.selected?.metric.map((metric, index) => ({
                label: props.state.selected?.prettyMetric[index],
                dataKey: metric,
                // data: props.state.data?.map((data) => data[metric] as number | null)?.reverse(),
              })) ?? []
            }
            height={300}
          ></LineChart>
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
  function Button(props: StateButtonProps): ReactElement {
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
  function Dropdown(props: DropDownProps): ReactElement {
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
  function handleMetricDropdownChange(e: SelectChangeEvent<(keyof datum)[]>, s: State): void {
    const metrics = e.target.value as (keyof datum)[];
    const sIndex = states.findIndex(st => st.id === s.id);
    const newStates = [...states];

    if (newStates[sIndex].selected === undefined) { return }

    // Assigning new selected metrics and prettyMetrics
    newStates[sIndex].selected.metric = metrics;
    metrics.forEach((metric, i) => {
      // set selected.prettyMetric using index of selected.metric
      const dataIndex = metricList.findIndex(m => m === metric);
      if (newStates[sIndex].selected === undefined) { return }
      newStates[sIndex].selected.prettyMetric[i] = metricListPretty[dataIndex];
    })

    setStates(newStates);
  }

  interface StrikeThroughConditionalProps {
    condition?: boolean,
    text?: string,
  }
  /** Component that adds strikethrough to the provided text if condition is true, otherwise returns text */
  function StrikeThroughConditional(props: StrikeThroughConditionalProps): ReactElement {
    if (props.condition) {
      return (<p className="inline font-medium line-through text-xl">{props.text}</p>);
    } else {
      return (<p className="inline font-medium text-xl">{props.text}</p>);
    }
  }

  /** Adds state to active state list w/ id. Fetches state's data as well */
  async function addState(s: State): Promise<void> {
    if (states.length > 6) { return; }

    s = await fetchState(s);
    console.log("page.tsx fetch state returned: ", s);

    setStates([...states, { ...s, id: nextId.current++, selected: { metric: [], prettyMetric: [] } }]);
  }

  /** Removes active state from state list */
  function removeState(s: State): void {
    setStates(states.filter(st => st.id !== s.id));
  }

  /** Moves displayed state up one position */
  function ascendState(s: State): void {
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
  function descendState(s: State): void {
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
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
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
              type="text" placeholder="e.g. NY" autoCapitalize="characters">
            </input>
            <Button type="submit" buttonText="ADD STATE"></Button>
          </form>
        </div>
      </div>
      {states.map((state) => state.id !== undefined && <StateItem key={state.id} state={state} ascendState={ascendState} descendState={descendState} removeState={removeState} ></StateItem>)}
    </main>
  );
}
