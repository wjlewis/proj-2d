import React from 'react';
import { StateContext } from './App';
import { PROJ_WIDTH, PROJ_HEIGHT, PROJ_UNIT } from './common';
import { HMat2, Vec2 } from './geometry';
import Obj from './Obj';

const PROJ_TRANS = new HMat2(
  0,
  -1,
  1,
  0,
  PROJ_WIDTH / PROJ_UNIT / 2,
  (PROJ_HEIGHT / PROJ_UNIT) * 0.9
);

const ORIGIN = PROJ_TRANS.transform2([0, 0]);
const I = PROJ_TRANS.transform2([1, 0]);
const J = PROJ_TRANS.transform2([0, 1]);

const Projection: React.FC<{}> = () => {
  const [state] = React.useContext(StateContext);
  const { width, fl } = state.camera;

  const camTransform = state.camera.coords.generateTransform();

  return (
    <div>
      <h1>The Camera's POV</h1>
      <svg
        width={PROJ_WIDTH}
        height={PROJ_HEIGHT}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${PROJ_WIDTH / PROJ_UNIT} ${PROJ_HEIGHT / PROJ_UNIT}`}
      >
        <line
          x1="0"
          y1={ORIGIN.y}
          x2={PROJ_WIDTH / PROJ_UNIT}
          y2={ORIGIN.y}
          strokeWidth="0.04"
          stroke="#aaaaaa44"
        />
        <line
          x1={ORIGIN.x}
          y1={ORIGIN.y}
          x2={I.x}
          y2={I.y}
          strokeWidth="0.04"
          stroke="#aaa"
        />
        <line
          x1={ORIGIN.x}
          y1={ORIGIN.y}
          x2={J.x}
          y2={J.y}
          strokeWidth="0.04"
          stroke="#aaa"
        />
        {state.entities.map(attrs => {
          const scale = PROJ_WIDTH / PROJ_UNIT / width;
          const transform = camTransform.after(attrs.coords);
          const obj = state.objects.find(obj => obj.name === attrs.obj)!;
          const pts = obj.pts.map(pt => {
            const pt1 = transform.transform(pt);
            return new Vec2(pt1.x, (scale * (pt1.y * fl)) / pt1.x);
          });

          return (
            <Obj
              key={attrs.id}
              {...attrs}
              {...obj}
              pts={pts}
              coords={PROJ_TRANS}
            />
          );
        })}
      </svg>
    </div>
  );
};

export default Projection;
