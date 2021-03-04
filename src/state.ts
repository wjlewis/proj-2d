import { HMat2, Vec2 } from './geometry';
import { WORLD_WIDTH, WORLD_HEIGHT, WORLD_UNIT } from './common';
import { CameraAttrs } from './Camera';

export interface WorldState {
  dragSubject: undefined | DragSubject;
  camera: CameraAttrs;
  objects: ObjAttrs[];
  entities: EntityAttrs[];
}

interface ObjAttrs {
  name: string;
  pts: Vec2[];
}

interface EntityAttrs {
  id: string;
  obj: string;
  coords: HMat2;
  color: string;
}

export const initWorldState: WorldState = {
  dragSubject: undefined,
  camera: {
    coords: new HMat2(
      0,
      -1,
      1,
      0,
      WORLD_WIDTH / WORLD_UNIT / 2,
      WORLD_HEIGHT / WORLD_UNIT / 1.3
    ),
    fl: 1,
    width: 1.5,
    clip: 5,
  },
  objects: [
    {
      name: 'square',
      pts: [
        new Vec2(-0.5, -0.5),
        new Vec2(0.5, -0.5),
        new Vec2(0.5, 0.5),
        new Vec2(-0.5, 0.5),
      ],
    },
  ],
  entities: [
    {
      id: 'square-1',
      obj: 'square',
      coords: new HMat2(
        1,
        0,
        0,
        1,
        WORLD_WIDTH / WORLD_UNIT / 4,
        WORLD_HEIGHT / WORLD_UNIT / 4
      ),
      color: '#ff0000',
    },
    {
      id: 'square-2',
      obj: 'square',
      coords: new HMat2(
        Math.cos(Math.PI / 3),
        -Math.sin(Math.PI / 3),
        Math.sin(Math.PI / 3),
        Math.cos(Math.PI / 3),
        WORLD_WIDTH / WORLD_UNIT / 1.3,
        WORLD_HEIGHT / WORLD_UNIT / 4
      ),
      color: '#00ff00',
    },
    {
      id: 'square-3',
      obj: 'square',
      coords: new HMat2(
        Math.cos(Math.PI / 5),
        -Math.sin(Math.PI / 5),
        Math.sin(Math.PI / 5),
        Math.cos(Math.PI / 5),
        WORLD_WIDTH / WORLD_UNIT / 2,
        WORLD_HEIGHT / WORLD_UNIT / 5
      ),
      color: '#0000ff',
    },
  ],
};

export enum ActionType {
  MoveMouse = 'MoveMouse',
  LiftMouse = 'LiftMouse',
  SelectDragSubject = 'SelectDragSubject',
}

export interface Action {
  type: ActionType;
  payload?: any;
}

export enum DragSubject {
  CamRoot = 'CamRoot',
  CamFocus = 'CamFocus',
  CamWing = 'CamWing',
}

export function reducer(state: WorldState, action: Action): WorldState {
  switch (action.type) {
    case ActionType.MoveMouse:
      return moveMouse(state, action.payload);
    case ActionType.LiftMouse:
      return liftMouse(state);
    case ActionType.SelectDragSubject:
      return selectDragSubject(state, action.payload);
    default:
      return state;
  }
}

function moveMouse(state: WorldState, pos: Vec2): WorldState {
  if (!state.dragSubject) {
    return state;
  }

  if (state.dragSubject === DragSubject.CamRoot) {
    return {
      ...state,
      camera: {
        ...state.camera,
        coords: state.camera.coords.moveTo(pos),
      },
    };
  } else if (state.dragSubject === DragSubject.CamFocus) {
    const { coords } = state.camera;
    const dX = pos.x - coords.wx;
    const dY = pos.y - coords.wy;
    const fl = Math.sqrt(dY * dY + dX * dX);
    const angle = Math.atan2(-dY, dX);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return {
      ...state,
      camera: {
        ...state.camera,
        coords: new HMat2(cos, -sin, sin, cos, coords.wx, coords.wy),
        fl,
      },
    };
  } else if (state.dragSubject === DragSubject.CamWing) {
    const { coords, fl } = state.camera;

    const root = coords.transform2([0, 0]);
    const focus = coords.transform2([fl, 0]);
    const centerline = focus.minus(root);
    const wing = centerline.perp();
    const diff = pos.minus(focus);
    const halfWidth = diff.proj(wing).len();

    return {
      ...state,
      camera: {
        ...state.camera,
        width: 2 * halfWidth,
      },
    };
  } else {
    return state;
  }
}

function liftMouse(state: WorldState): WorldState {
  return {
    ...state,
    dragSubject: undefined,
  };
}

function selectDragSubject(
  state: WorldState,
  dragSubject: DragSubject
): WorldState {
  return {
    ...state,
    dragSubject,
  };
}
