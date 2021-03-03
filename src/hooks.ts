import React from 'react';

export function useMousePos<T extends Element>(
  onMove: (left: number, top: number) => any
): React.RefObject<T> {
  const ref = React.useRef<T>(null);
  const [eltPos, setEltPos] = React.useState({ left: 0, top: 0 });

  React.useEffect(() => {
    function computeEltPos() {
      if (ref.current) {
        const { left, top } = ref.current.getBoundingClientRect();
        return setEltPos({ left, top });
      }
    }

    computeEltPos();
    window.addEventListener('resize', computeEltPos);
    return () => window.removeEventListener('resize', computeEltPos);
  }, []);

  React.useEffect(() => {
    function computeMousePos(e: any) {
      return onMove(e.clientX - eltPos.left, e.clientY - eltPos.top);
    }

    document.addEventListener('mousemove', computeMousePos);
    return () => document.removeEventListener('mousemove', computeMousePos);
  }, [eltPos, onMove]);

  return ref;
}

export interface Offsets {
  left: number;
  top: number;
}

export function useMouseUp(onUp: () => void) {
  React.useEffect(() => {
    document.addEventListener('mouseup', onUp);
    return () => document.removeEventListener('mouseup', onUp);
  }, [onUp]);
}
