"use client";

import React from 'react';
import Tabs from "./Tabs";
// import Tab from "./Tab";
import Mindfulness from "./Mindfulness";
import Affirmation from "./Affirmation";
import NameTag from "./NameTag";
import { useCustomState } from './state';

function App() {

  const { state, 
  setSelectedWaveHand,
  // setHandChoicesAsString, 
  setCurrentAffirmation,
  setAllAffirmations,
  setCurrentNameTag,
  setNameTagStatus,} = useCustomState();
  

  const handleWaveHandsClick = (num: number) => {
    setSelectedWaveHand(num)
  };


  return (
    <div>
      <div className="header">
        <div className="self-confirm">
          <h1>{state.selectedAffirmation}</h1>
        </div>
      </div>

      <div className="button-rows">
        {state.waveHands.map((waveHand, index) => (
          <button
            key={index}
            className={`wave-hand-button ${state.selectedWaveHand === index ? 'selected' : ''}`}
            onClick={() => handleWaveHandsClick(index)}
          >
            {waveHand}
          </button>
        ))}
      </div>

      <div>
        <Tabs>
          <div page-label="affirmation">
            <Affirmation 
              allAffirmations={state.allAffirmations}
              setCurrentAffirmation={setCurrentAffirmation}
              setAllAffirmations={setAllAffirmations}
            />
          </div>

          <div page-label="nametag">
            <NameTag 
              currentNameTag={state.currentNameTag}
              nameTagStatus={state.nameTagStatus}
              setCurrentNameTag={setCurrentNameTag}
              setNameTagStatus={setNameTagStatus}

              selectedWaveHand = {state.selectedWaveHand}
              waveHands = {state.waveHands}
            />
          </div>

          <div page-label="mindfulness">
            <Mindfulness />
          </div>

          <div page-label="wave-hands">
            wave-hands here! this tab is also <em>extinct</em>!
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default App;