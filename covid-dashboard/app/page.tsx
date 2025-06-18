'use client';
// import Image from "next/image";
// import { BarChart } from '@mui/x-charts/BarChart';
import { useState, useRef } from 'react';
import { LineChart } from "@mui/x-charts";
import { datum ,fetchState } from "../parser.js";

export default function Dashboard() {
  const nextId = useRef(0); 
  interface state {
    id: number | undefined,
    abbrev: string
  }

  const [states, setStates] = useState<state[]>([]);

  /** StateItem Component that displays a single state. Includes title, movement buttons and graph */
  function StateItem(
    { state, ascendState, descendState, removeState }: 
    { state: state, 
      ascendState: (s:state) => void, 
      descendState: (s:state) => void, 
      removeState: (s:state) => void }) 
      {
    return (
      <div key={state.id} className="flex flex-row justify-between flex-wrap border-4 border-sky-700 bg-sky-800 rounded-xl mx-5 my-5">
        <h2 className="basis-3/4">{state.abbrev} {state.id}</h2>
        <StateButton callBack={ascendState} s={state} innerHTML='up'/>
        <StateButton callBack={descendState} s={state} innerHTML='down'/>
        <StateButton callBack={removeState} s={state} innerHTML='Remove'/>

        <div className="basis-full p-2">
          <LineChart
            xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
            series={[
              {
                data: [2, 5.5, 2, 8.5, 1.5, 5],
              },
            ]}
            height={300}
          />
        </div>
      </div>
    )
  }

  /** StateButton Component that displays a button with callback function for press. */
  function StateButton(
    { callBack, s ,innerHTML}: 
    { callBack:(state: state) => void, s:state, innerHTML: string }) {
    return (
      <button className="px-3 m-1 border-2 rounded-md border-sky-500 bg-sky-700 hover:bg-blue-600 hover:border-blue-500"
        onClick={() => { callBack(s) }} >{innerHTML}</button>
    )
  }

  //https://react.dev/reference/react/useState 
  /** Adds state to active state list w/ unique id */
  async function addState(newState:state) {
    if(states.length >= 5) { return; }

    const stateData:datum[] = await fetchState(newState.abbrev);
    console.log("page.tsx fetch state return",stateData); 
    

    setStates([...states, { ...newState, id: nextId.current++ }]);
  }

  /** Removes active state from state list */
  function removeState(s:state) {
    setStates(states.filter(st => st.id !== s.id));
  }

  /** Moves displayed state up one position */
  function ascendState(s:state) {
    const index = states.findIndex(st => st.id === s.id);
    if (index !== 0) {
      const newStates = [...states];
      const temp:state = newStates[index];
      newStates[index] = newStates[index - 1];
      newStates[index - 1] = temp;
      setStates(newStates);
    }
  }

  /** Moves displayed state down one position */
  function descendState(s:state) {
    const index = states.findIndex(st => st.id === s.id);
    if (index < states.length - 1) {
      const newStates = [...states];
      const temp:state = newStates[index];
      newStates[index] = newStates[index + 1];
      newStates[index + 1] = temp;
      setStates(newStates);
    }
  }

  const acceptStates = [
  "AK", "AL", "AR", "AS", "AZ", "CA", "CO", "CT", "DC", "DE",
  "FL", "GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY",
  "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MP", "MS", "MT",
  "NC", "ND", "NE", "NH", "NJ", "NM", "NV", "NY", "OH", "OK",
  "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VA",
  "VI", "VT", "WA", "WI", "WV", "WY" ];
  /** Handles submit event, calling addState if appropriate */
  function handleSubmit(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const stateAbbrev = (formData.get("stateAbbrev") as string).toUpperCase();

    if(acceptStates.includes(stateAbbrev)) {
      addState({ id: undefined, abbrev: stateAbbrev });
    }
  }

  return (
    <main className="flex flex-row flex-wrap items-center mx-10 my-10 bg-sky-900 text-2xl font-mono font-medium tracking-normal">
      <div className="flex flex-row basis-full justify-between border-2">
        <div></div>
        <h1 className="text-4xl font-bold">Covid Tracking Dashboard</h1>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              name='stateAbbrev'
              className="px-2 m-1 rounded-md text-neutral-900 bg-sky-50"
              type="text" placeholder="e.g. NY" autoCapitalize="characters" />
            <button
              className="px-2 m-1 border-2 rounded-md border-sky-500 bg-sky-700 hover:bg-blue-600 hover:border-blue-500" 
              type="submit">Add State</button>
          </form>
        </div>
      </div>
      <div className="basis-full border-2"> Tracked States
        <div>
          {states.map((state) => state.id !== undefined && <StateItem key={state.id} state={state} ascendState={ascendState} descendState={descendState} removeState={removeState} />)}
        </div>
      </div>
    </main>
  );
}
