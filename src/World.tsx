import React from 'react';
import { useMousePos, useMouseUp } from './hooks';
import { WORLD_WIDTH, WORLD_HEIGHT, WORLD_UNIT } from './common';
import { ActionType as At, DragSubject } from './state';
import { Vec2 } from './geometry';
import Camera from './Camera';
import Obj from './Obj';
import { StateContext } from './App';

const World: React.FC<{}> = () => {
  const [state, dispatch] = React.useContext(StateContext);

  const ref = useMousePos<SVGSVGElement>((left, top) => {
    dispatch({
      type: At.MoveMouse,
      payload: new Vec2(left / WORLD_UNIT, top / WORLD_UNIT),
    });
  });

  useMouseUp(() => dispatch({ type: At.LiftMouse }));

  function handleCamRoot() {
    return dispatch({
      type: At.SelectDragSubject,
      payload: DragSubject.CamRoot,
    });
  }

  function handleCamFocus() {
    return dispatch({
      type: At.SelectDragSubject,
      payload: DragSubject.CamFocus,
    });
  }

  function handleWing() {
    return dispatch({
      type: At.SelectDragSubject,
      payload: DragSubject.CamWing,
    });
  }

  return (
    <div className="world">
      <h1>The World from Above</h1>
      <svg
        width={WORLD_WIDTH}
        height={WORLD_HEIGHT}
        viewBox={`0 0 ${WORLD_WIDTH / WORLD_UNIT} ${WORLD_HEIGHT / WORLD_UNIT}`}
        xmlns="http://www.w3.org/2000/svg"
        ref={ref}
      >
        {state.entities.map(attrs => (
          <Obj
            key={attrs.id}
            {...attrs}
            {...state.objects.find(obj => obj.name === attrs.obj)!}
          />
        ))}
        <Camera
          attrs={state.camera}
          onRootDown={handleCamRoot}
          onFocusDown={handleCamFocus}
          onWingDown={handleWing}
        />
      </svg>
    </div>
  );
};

export default World;
