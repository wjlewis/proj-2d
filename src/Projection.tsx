import React from 'react';
import { PROJ_WIDTH, PROJ_HEIGHT } from './common';

const Projection: React.FC<{}> = () => {
  return (
    <div>
      <h1>The Camera's POV</h1>
      <svg
        width={PROJ_WIDTH}
        height={PROJ_HEIGHT}
        xmlns="http://www.w3.org/2000/svg"
      ></svg>
    </div>
  );
};

export default Projection;
