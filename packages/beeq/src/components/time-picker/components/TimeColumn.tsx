import { type FunctionalComponent, h } from '@stencil/core';

import type { TTimeMaskField } from '../../../shared/utils';
import type { TDayPeriod, TTimeOption } from '../bq-time-picker.types';
import { TIME_PICKER_PARTS } from '../helper/constants';

type TColumnShellProps = {
  field: TTimeMaskField;
  label: string;
  /** Marks a read-only column that can't receive focus. */
  disabled?: boolean;
  onKeyDown?: (ev: KeyboardEvent) => void;
};

/** Column header and the listbox that holds the options. */
const ColumnShell: FunctionalComponent<TColumnShellProps> = ({ field, label, disabled, onKeyDown }, children) => {
  const headerId = `bq-time-picker__column-header-${field}`;

  return (
    <div class="bq-time-picker__column-group" key={field}>
      <div class="bq-time-picker__column-header" id={headerId} part={TIME_PICKER_PARTS.columnHeader}>
        {label}
      </div>
      <div
        aria-disabled={disabled ? 'true' : undefined}
        aria-labelledby={headerId}
        class="bq-time-picker__column"
        data-column={field}
        onKeyDown={onKeyDown}
        part={TIME_PICKER_PARTS.column}
        role="listbox"
        // Focus roves between the options; -1 only keeps focus in the column when a gap is clicked.
        tabIndex={disabled ? undefined : -1}
      >
        {children}
      </div>
    </div>
  );
};

type TColumnOptionProps = {
  /** Virtual DOM key, set when the component is rendered in a list. */
  key?: string;
  value: number | TDayPeriod;
  label: string;
  selected: boolean;
  disabled: boolean;
  tabStop: boolean;
  onClick?: () => void;
};

// Options can't contain focusable children, so the button itself takes the `option` role.
// Disabled options keep `aria-disabled` instead of `disabled` so assistive tech still lists them.
const ColumnOption: FunctionalComponent<TColumnOptionProps> = ({
  value,
  label,
  selected,
  disabled,
  tabStop,
  onClick,
}) => (
  <button
    aria-disabled={disabled ? 'true' : undefined}
    aria-selected={selected ? 'true' : 'false'}
    class={{ 'bq-time-picker__option': true, 'is-selected': selected }}
    data-value={`${value}`}
    key={`${value}`}
    onClick={onClick}
    part={selected ? `${TIME_PICKER_PARTS.option} ${TIME_PICKER_PARTS.optionSelected}` : TIME_PICKER_PARTS.option}
    role="option"
    tabIndex={tabStop ? 0 : -1}
    type="button"
  >
    {label}
  </button>
);

export type TTimeColumnProps = {
  /** Virtual DOM key, set when the component is rendered in a list. */
  key?: string;
  /** Time field listed by the column. */
  field: TTimeMaskField;
  /** Column header text, also the listbox accessible name. */
  label: string;
  /** Options of the column. */
  options: TTimeOption[];
  /** Callback fired when an option is clicked. */
  onOptionClick: (option: TTimeOption) => void;
  /** Callback fired on keydown inside the column. */
  onKeyDown: (ev: KeyboardEvent) => void;
};

/** Scrollable listbox column of the panel. The selected option, or else the first enabled one, is the tab stop. */
export const TimeColumn: FunctionalComponent<TTimeColumnProps> = ({
  field,
  label,
  options,
  onOptionClick,
  onKeyDown,
}) => {
  const tabStop = options.find((option) => option.selected) ?? options.find((option) => !option.disabled);

  return (
    <ColumnShell field={field} label={label} onKeyDown={onKeyDown}>
      {options.map((option) => (
        <ColumnOption
          disabled={option.disabled}
          key={`${option.value}`}
          label={option.label}
          onClick={() => onOptionClick(option)}
          selected={option.selected}
          tabStop={option === tabStop}
          value={option.value}
        />
      ))}
    </ColumnShell>
  );
};

export type TFixedMinuteColumnProps = {
  /** Virtual DOM key, set when the component is rendered in a list. */
  key?: string;
  /** Column header text. */
  label: string;
  /** Whether an hour is selected, which selects the fixed `00` minute too. */
  selected: boolean;
};

/**
 * Read-only minute column shown on a 24-hour clock at hour precision,
 * so the panel reads as a time (`HH:00`) instead of a single list of numbers.
 */
export const FixedMinuteColumn: FunctionalComponent<TFixedMinuteColumnProps> = ({ label, selected }) => (
  <ColumnShell disabled field="minute" label={label}>
    <ColumnOption disabled label="00" selected={selected} tabStop={false} value={0} />
  </ColumnShell>
);
