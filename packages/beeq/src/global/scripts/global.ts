import 'cally';
import type { JSXBase } from '@stencil/core/internal';
import type { CalendarDateProps, CalendarMonthProps, CalendarMultiProps, CalendarRangeProps } from 'cally';
declare module '@stencil/core' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace JSX {
    interface IntrinsicElements {
      'calendar-multi': CalendarMultiProps & JSXBase.HTMLAttributes<CalendarMultiProps>;
      'calendar-range': CalendarRangeProps & JSXBase.HTMLAttributes<CalendarDateProps>;
      'calendar-date': CalendarDateProps & JSXBase.HTMLAttributes<CalendarDateProps>;
      'calendar-month': CalendarMonthProps & JSXBase.HTMLAttributes<CalendarMonthProps>;
    }
  }
}
