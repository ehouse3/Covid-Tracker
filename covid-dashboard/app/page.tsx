'use client';
import Image from "next/image";
import { BarChart } from '@mui/x-charts/BarChart';
import { useState, useRef } from 'react';

export default function Dashboard() {
  const nextId = useRef(0);
  interface state {
    id: number | null,
    abbrev: string,
    expanded: boolean
  }

  const [states, setStates] = useState<state[]>([]);

  function renderState(state:state, i:number) {
    return (
      <div key={state.id} className="flex flex-row justify-between">
        <li>{state.abbrev} {state.id}</li>
        <button onClick={(event) => {removeState(state.id)}}>test</button>
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

  return (
    <main className="flex flex-row flex-wrap items-center mx-25 my-10 border-2">
      <div className="flex flex-row basis-full justify-between border-2">
        <div></div>
        <h1>Header</h1>
        <div>
          <button
            onClick={(event) => {addState({id:null ,abbrev:"CA", expanded:false});}}
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
