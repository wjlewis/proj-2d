import React from 'react';
import { HMat2 } from './geometry';

export interface CameraAttrs {
  coords: HMat2;
  fl: number;
  width: number;
  clip: number;
}

export interface CameraProps {
  attrs: CameraAttrs;
  onRootDown: () => void;
  onFocusDown: () => void;
  onWingDown: () => void;
}

const Camera: React.FC<CameraProps> = props => {
  const { coords, fl, width } = props.attrs;

  const root = coords.transform2([0, 0]);
  const focus = coords.transform2([fl, 0]);
  const centerline = focus.minus(root);
  const wingBase = centerline
    .perp()
    .norm()
    .scale(width / 2);
  const wing1 = focus.plus(wingBase);
  const wing2 = focus.plus(wingBase.scale(-1));

  return (
    <g>
      <path
        d={`M ${root.toPathPoint()} L ${wing1.toPathPoint()} L ${wing2.toPathPoint()} Z`}
        stroke="#f70052"
        fill="#f7005244"
        strokeWidth="0.04"
      />
      <path
        d={`M ${root.toPathPoint()} L ${focus.toPathPoint()}`}
        stroke="#721aba"
        strokeWidth="0.04"
      />
      <circle
        onMouseDown={props.onRootDown}
        cx={root.x}
        cy={root.y}
        r="0.08"
        stroke="#721aba"
        strokeWidth="0.04"
        fill="#fafafa"
        className="moveable"
      />
      <circle
        onMouseDown={props.onFocusDown}
        cx={focus.x}
        cy={focus.y}
        r="0.08"
        stroke="#721aba"
        strokeWidth="0.04"
        fill="#fafafa"
        className="moveable"
      />
      <circle
        onMouseDown={props.onWingDown}
        cx={wing1.x}
        cy={wing1.y}
        r="0.08"
        stroke="#f70052"
        strokeWidth="0.04"
        fill="#fafafa"
        className="moveable"
      />
      <circle
        onMouseDown={props.onWingDown}
        cx={wing2.x}
        cy={wing2.y}
        r="0.08"
        stroke="#f70052"
        strokeWidth="0.04"
        fill="#fafafa"
        className="moveable"
      />
    </g>
  );
};

export default Camera;
