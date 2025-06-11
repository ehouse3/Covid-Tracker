'use client';
import Image from "next/image";
import { BarChart } from '@mui/x-charts/BarChart';
import { useState, useRef } from 'react';
import { LineChart } from "@mui/x-charts";
import { foo } from "../parser.js";

export default function Dashboard() {
  const nextId = useRef(0);
  interface state {
    id: number | null,
    abbrev: string
  }

  const [states, setStates] = useState<state[]>([]);

  function renderState(state:state, i:number) {
    return (
      <div key={state.id} className="flex flex-row justify-between flex-wrap border-4 border-sky-700 bg-sky-800 rounded-xl mx-5 my-5">
        <h2 className="basis-3/4">{state.abbrev} {state.id}</h2>
        <button className="px-3 m-1 border-2 rounded-md border-sky-500 bg-sky-700 hover:bg-blue-600 hover:border-blue-500"
          onClick={(event) => {ascendState(state)}} >up</button>
        <button className="px-3 m-1 border-2 rounded-md border-sky-500 bg-sky-700 hover:bg-blue-600 hover:border-blue-500" 
          onClick={(event) => {descendState(state)}} >down</button>
        <button className="px-3 m-1 border-2 rounded-md border-sky-500 bg-sky-700 hover:bg-blue-600 hover:border-blue-500" 
          onClick={(event) => {removeState(state.id)}}>Remove</button>
        
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
    );
  }

  //https://react.dev/reference/react/useState 
  // Addes state to active state list
  // Sets state Id
  function addState(newState:state) {
    if(states.length >= 5) { return; }

    setStates([...states, { ...newState, id: nextId.current++ }]);
  }

  // Removes active state from state list
  function removeState(id:number | null) {
    setStates(states.filter(s => s.id !== id));
  }

  function ascendState(s:state) {
    let index = states.findIndex(st => st.id === s.id);
    if (index !== 0) {
      const newStates = [...states];
      const temp:state = newStates[index];
      newStates[index] = newStates[index - 1];
      newStates[index - 1] = temp;
      setStates(newStates);
    }
  }

  function descendState(s:state) {
    let index = states.findIndex(st => st.id === s.id);
    if (index !== states.length) {
      const newStates = [...states];
      const temp:state = newStates[index];
      newStates[index] = newStates[index + 1];
      newStates[index + 1] = temp;
      setStates(newStates);
    }
  }

  return (
    <main className="flex flex-row flex-wrap items-center mx-10 my-10 bg-sky-900 text-2xl font-mono font-medium tracking-normal">
      <div className="flex flex-row basis-full justify-between border-2">
        <div></div>
        <h1 className="text-4xl font-bold">Covid Tracking Dashboard</h1>
        <div>
          <button
            className="px-3 m-1 border-2 rounded-md border-sky-500 bg-sky-700 hover:bg-blue-600 hover:border-blue-500"
            onClick={(event) => {addState({id:null, abbrev:"ST"});}}
          >
            Add state
          </button>
        </div>
      </div>
      <div className="basis-full border-2"> item Section
        <div>
          {states.map((state, i) => renderState(state, i))}
        </div>
      </div>
    </main>
  );
}
