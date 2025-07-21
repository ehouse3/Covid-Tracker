/* Components.tsx file. This file contains components for the covid dashboard react file **/

import { ReactElement } from "react";
import { State, datum } from "../parser";

import { LineChart } from "@mui/x-charts";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import { twMerge } from "tailwind-merge";

interface StateItemProps {
  state: State;
  abbrevMap: Map<string, string>; // Map of state's abbreviations to state's fullname
  metricsMap: Map<keyof datum, string>; // Map of state's metrics and displayable metrics, in order, except date and state

  ascendState: () => void;
  descendState: () => void;
  removeState: () => void;
  dropDownMetricChangeHandler: (e: SelectChangeEvent<string[]>) => void;
  calculateRollingAverage: (
    data: (number | null | undefined)[],
    window: number,
  ) => (number | null)[];
}
/** Component for a single state. Includes Name, metric selector, movement buttons and graph */
export function StateItem(props: StateItemProps): ReactElement {
  return (
    <div className="bg-foreground border-foreground-border my-7 flex flex-row flex-wrap justify-between rounded-xl border-0 p-2">
      <div className="flex w-full flex-row">
        <div className="w-1/3">
          <Dropdown
            items={props.metricsMap
              .entries()
              .toArray()
              .map(([metric, metricPretty]: [keyof datum, string]) => (
                <MenuItem value={metric} key={metric}>
                  <p
                    className={twMerge(
                      // adds css strike-through for metrics containing all null values
                      "inline text-xl font-medium",
                      props.state.nullMetrics &&
                        props.state.nullMetrics[
                          metric as keyof typeof props.state.nullMetrics
                        ]
                        ? ""
                        : "line-through",
                    )}
                  >
                    {metricPretty}
                  </p>
                </MenuItem>
              ))}
            selected={
              (props.state.selectedMetrics?.keys().toArray() ?? []) as string[]
            }
            onChange={props.dropDownMetricChangeHandler}
          />
        </div>
        <h2 className="flex w-1/3 flex-row flex-nowrap justify-center self-center text-5xl font-bold">
          {props.abbrevMap.get(props.state.abbrev)}
        </h2>
        <div className="flex w-1/3 flex-row flex-nowrap justify-end px-2">
          <Button onClick={props.ascendState} buttonText="UP" />
          <Button onClick={props.descendState} buttonText="DOWN" />
          <Button onClick={props.removeState} buttonText="DELETE" />
        </div>
      </div>

      <div className="basis-full p-2">
        <LineChart
          xAxis={[
            {
              dataKey: "date",
              scaleType: "time",
              data: props.state.data
                ?.map((val) => new Date(val.date))
                .reverse(),
              valueFormatter: (date) =>
                date instanceof Date ? date.toLocaleDateString() : date,
            },
          ]}
          series={[
            // Generates array of sequential values for each selected metric w/ label
            ...(props.state.selectedMetrics
              ?.keys()
              .toArray()
              .map(
                // itterates through selectedMetrics:
                (metric) => ({
                  label: props.state.selectedMetrics?.get(metric) ?? "",
                  data:
                    props.state.data
                      ?.map((data) => data[metric] as number | null) // returns data value for corresponding metric
                      .reverse() ?? [], // reverse to be in ascending date order
                }),
              ) ?? []),
            // Generates array of sequential rolling 7 day avg values for each selected metric w/ label
            ...(props.state
              .selectedMetrics!.keys()
              .toArray()
              .map(
                // itterates through selectedMetrics:
                (metric) => ({
                  label:
                    props.state.selectedMetrics?.get(metric) + " 7-day avg",
                  data: props.calculateRollingAverage(
                    props.state.data
                      ?.map((data) => data[metric] as number | null) // returns data value for corresponding metric
                      .reverse() ?? [], // reverse to be in ascending date order
                    7,
                  ),
                }),
              ) ?? []),
          ]}
          height={300}
        />
      </div>
    </div>
  );
}

interface DropDownProps {
  items: React.ReactNode[]; // of the form [<MenuItem value={}>...</MenuItem>...]
  selected: string[];
  onChange: (e: SelectChangeEvent<string[]>) => void;
}
/** Dropdown component to select which metrics of data to display */
export function Dropdown(props: DropDownProps): ReactElement {
  return (
    <div className="border-tertiary-border bg-text m-2 rounded-md">
      <FormControl fullWidth>
        <InputLabel
          className="bg-text rounded-md"
          id="demo-simple-select-label"
        >
          <div className="text-text-contrast px-2 text-xl">Metrics</div>
        </InputLabel>
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
  );
}

interface StateButtonProps {
  onClick?: () => void;
  buttonText?: string;
  type?: "button" | "submit" | "reset";
}
/** Button Component that displays a button with callback function for press. */
export function Button(props: StateButtonProps): ReactElement {
  return (
    <button
      className="border-accent-border bg-accent text-text-contrast hover:bg-accent-hover hover:border-accent-border-hover m-2 self-center rounded-md border-3 px-3"
      onClick={props.onClick}
      type={props.type}
    >
      {props.buttonText}
    </button>
  );
}
