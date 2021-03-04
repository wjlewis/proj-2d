import React from 'react';
import World from './World';
import Projection from './Projection';
import { reducer, initWorldState, WorldState, Action } from './state';

export const StateContext = React.createContext<
  [WorldState, React.Dispatch<Action>]
>([undefined as any, undefined as any]);

const App: React.FC<{}> = () => {
  const [state, dispatch] = React.useReducer(reducer, initWorldState);

  return (
    <div className="container">
      <StateContext.Provider value={[state, dispatch]}>
        <World />
        <Projection />
      </StateContext.Provider>
    </div>
  );
};

export default App;
