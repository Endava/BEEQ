import 'cally';
import type { JSXBase } from '@stencil/core/internal';
import type { CalendarDateProps, CalendarMonthProps, CalendarMultiProps, CalendarRangeProps } from 'cally';

type EventName<T> = T extends `on${infer Rest}` ? `on${Capitalize<Lowercase<Rest>>}` : T;
type MapEvents<T> = {
  [K in keyof T as EventName<K>]: T[K];
};

declare module '@stencil/core' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace JSX {
    interface IntrinsicElements {
      'calendar-multi': CalendarMultiProps & JSXBase.HTMLAttributes<CalendarMultiProps>;
      'calendar-range': MapEvents<CalendarRangeProps> & JSXBase.HTMLAttributes<CalendarDateProps>;
      'calendar-date': CalendarDateProps & JSXBase.HTMLAttributes<CalendarDateProps>;
      'calendar-month': CalendarMonthProps & JSXBase.HTMLAttributes<CalendarMonthProps>;
      // Extend the global slot HTML element to include the id and class attributes
      slot: JSXBase.SlotAttributes & { id?: string; class?: string };
    }
  }
}
