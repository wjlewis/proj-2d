import React from 'react';
import { HMat2, Vec2 } from './geometry';

export interface ObjProps {
  id: string;
  name: string;
  coords: HMat2;
  pts: Vec2[];
  color: string;
}

const Obj: React.FC<ObjProps> = props => {
  const { coords, pts, color } = props;

  const transPts = pts.map(pt => coords.transform(pt));

  const innerPts = transPts
    .slice(1)
    .map(pt => `L ${pt.toPathPoint()}`)
    .join(' ');
  const ptStr = `M ${transPts[0].toPathPoint()} ${innerPts} Z`;

  return (
    <path d={ptStr} stroke={color} strokeWidth="0.04" fill={`${color}44`} />
  );
};

export default Obj;
