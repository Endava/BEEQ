import type { Placement, Strategy } from '@floating-ui/core';

export interface FloatingUIOptions {
  distance?: number;
  placement?: Placement;
  arrow?: HTMLElement;
  strategy: Strategy;
  sameWidth?: boolean;
  skidding?: number;
  onPositionChange?: (placement: Placement) => void;
}
export type { Placement };
