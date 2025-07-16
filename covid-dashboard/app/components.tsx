import { ReactElement } from "react";
// import { State, datum } from "../parser";

// import { LineChart } from "@mui/x-charts";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
// import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";



interface DropDownProps {
  items: React.ReactNode[]; // of the form [<MenuItem value={}>...</MenuItem>...]
  selected: string[];
  onChange: (e: SelectChangeEvent<string[]>) => void;
}
/** Dropdown component to select which metrics of data to display */
export function Dropdown(props: DropDownProps): ReactElement {
  return (
    <div className="border-tertiary-border bg-tertiary m-2 rounded-md">
      <FormControl fullWidth>
        <InputLabel
          className="bg-tertiary rounded-md"
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

interface StrikeThroughConditionalProps {
  condition?: boolean;
  text?: string;
}
/** Component that adds strikethrough to the provided text if condition is true, otherwise returns text */
export function StrikeThroughConditional(
  props: StrikeThroughConditionalProps,
): ReactElement {
  if (props.condition) {
    return (
      <p className="inline text-xl font-medium line-through">{props.text}</p>
    );
  } else {
    return <p className="inline text-xl font-medium">{props.text}</p>;
  }
}
