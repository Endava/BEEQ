import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import mdx from './bq-option.mdx';

const meta: Meta = {
  title: 'Components/Option',
  component: 'bq-option',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'all-selected-label': { control: 'text' },
    disabled: { control: 'boolean' },
    'display-value': { control: 'text' },
    hidden: { control: 'boolean' },
    checkbox: { control: 'boolean' },
    expanded: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    selected: { control: 'boolean' },
    'selected-count-label': { control: 'text' },
    'show-selection-summary': { control: 'boolean' },
    value: { control: 'text' },
    // Event handlers
    bqBlur: { action: 'bqBlur' },
    bqFocus: { action: 'bqFocus' },
    bqClick: { action: 'bqClick' },
    bqEnter: { action: 'bqEnter' },
    // Event handler of the parent component (bq-option-list)
    bqSelect: { action: 'bqSelect', table: { disable: true } },
    // Not part of the public API, so we don't want to expose it in the docs
    children: { control: 'text', table: { disable: true } },
    text: { control: 'text', table: { disable: true } },
    iconPrefix: { control: 'text', table: { disable: true } },
    iconSuffix: { control: 'text', table: { disable: true } },
  },
  args: {
    'all-selected-label': 'All selected',
    disabled: false,
    'display-value': undefined,
    hidden: false,
    checkbox: false,
    expanded: false,
    indeterminate: false,
    selected: false,
    'selected-count-label': '{count} selected',
    'show-selection-summary': true,
    value: undefined,
    iconPrefix: undefined,
    iconSuffix: undefined,
  },
};
export default meta;

type Story = StoryObj;

const TemplateList = (args: Args) => html`
  <bq-option-list @bqSelect=${args.bqSelect}> ${args.children} </bq-option-list>
`;

const Template = (args: Args) => {
  const bqIconPrefix = args.iconPrefix ? html`<bq-icon name=${args.iconPrefix} slot="prefix"></bq-icon>` : nothing;
  const bqIconSuffix = args.iconSuffix ? html`<bq-icon name=${args.iconSuffix} slot="suffix"></bq-icon>` : nothing;

  return html`
    <bq-option
      ?disabled=${args.disabled}
      ?hidden=${args.hidden}
      ?checkbox=${args.checkbox}
      all-selected-label=${ifDefined(args['all-selected-label'])}
      display-value=${ifDefined(args['display-value'])}
      ?expanded=${args.expanded}
      ?indeterminate=${args.indeterminate}
      ?selected=${args.selected}
      selected-count-label=${ifDefined(args['selected-count-label'])}
      ?show-selection-summary=${args['show-selection-summary']}
      value=${ifDefined(args.value)}
      @bqBlur=${args.bqBlur}
      @bqFocus=${args.bqFocus}
      @bqClick=${args.bqClick}
      @bqEnter=${args.bqEnter}
    >
      ${bqIconPrefix}
      <span>${args.text}</span>
      ${bqIconSuffix}
    </bq-option>
  `;
};

export const Default: Story = {
  render: (args: Args) =>
    html` ${TemplateList({
      ...args,
      children: html`
        <!-- Option 1 -->
        ${Template({ ...args, text: 'User profile', iconPrefix: 'user', value: 'user' })}
        <!-- Option 2 -->
        ${Template({ ...args, text: 'Change password', iconPrefix: 'lock-simple', value: 'changepassword' })}
        <!-- Option 3 -->
        ${Template({ ...args, text: 'Close session', iconPrefix: 'sign-out', value: 'logout' })}
      `,
    })}`,
};

export const Active: Story = {
  render: (args: Args) =>
    html` ${TemplateList({
      ...args,
      children: html`
        <!-- Option 1 -->
        ${Template({ ...args, selected: true, text: 'User profile', iconPrefix: 'user', value: 'user' })}
        <!-- Option 2 -->
        ${Template({ ...args, text: 'Change password', iconPrefix: 'lock-simple', value: 'changepassword' })}
        <!-- Option 3 -->
        ${Template({ ...args, text: 'Close session', iconPrefix: 'sign-out', value: 'logout' })}
      `,
    })}`,
};

export const Checkbox: Story = {
  render: (args: Args) =>
    html`${TemplateList({
      ...args,
      children: html`
        ${Template({ ...args, checkbox: true, text: 'User profile', value: 'user' })}
        ${Template({ ...args, checkbox: true, selected: true, text: 'Change password', value: 'changepassword' })}
      `,
    })}`,
};

export const Nested: Story = {
  render: () => html`
    <bq-option-list>
      <bq-option expanded value="frontend">
        Frontend
        <span slot="expand-label">2 levels</span>
        <bq-option slot="options" value="react">React</bq-option>
        <bq-option slot="options" value="stencil">Stencil</bq-option>
      </bq-option>
    </bq-option-list>
  `,
};

export const NestedSelectionStates: Story = {
  render: () => html`
    <bq-option-list>
      <bq-option checkbox expanded indeterminate selected value="frontend">
        Frontend
        <bq-option checkbox selected slot="options" value="react">React</bq-option>
        <bq-option checkbox slot="options" value="stencil">Stencil</bq-option>
      </bq-option>
      <bq-option checkbox expanded selected value="backend">
        Backend
        <bq-option checkbox selected slot="options" value="node">Node.js</bq-option>
        <bq-option checkbox selected slot="options" value="dotnet">.NET</bq-option>
      </bq-option>
    </bq-option-list>
  `,
};

export const Disabled: Story = {
  render: (args: Args) =>
    html` ${TemplateList({
      ...args,
      children: html`
        <!-- Option 1 -->
        ${Template({ ...args, text: 'User profile', iconPrefix: 'user', value: 'user' })}
        <!-- Option 2 -->
        ${Template({ ...args, disabled: true, text: 'Admin Dashboard', iconPrefix: 'layout', value: 'admin' })}
        <!-- Option 3 -->
        ${Template({ ...args, text: 'Change password', iconPrefix: 'lock-simple', value: 'changepassword' })}
        <!-- Option 4 -->
        ${Template({ ...args, text: 'Close session', iconPrefix: 'sign-out', value: 'logout' })}
      `,
    })}`,
};

export const WithSuffix: Story = {
  render: (args) => html`
    ${TemplateList({
      ...args,
      children: html`
        <!-- Option 1 -->
        ${Template({ ...args, text: 'User profile', iconSuffix: 'user', value: 'user' })}
        <!-- Option 2 -->
        ${Template({ ...args, text: 'Admin Dashboard', iconSuffix: 'layout', value: 'admin' })}
        <!-- Option 3 -->
        ${Template({ ...args, text: 'Change password', iconSuffix: 'lock-simple', value: 'changepassword' })}
        <!-- Option 4 -->
        ${Template({ ...args, text: 'Close session', iconSuffix: 'sign-out', value: 'logout' })}
      `,
    })}
  `,
};

export const WithOptionGroup: Story = {
  render: (args) => html`
    ${TemplateList({
      ...args,
      children: html`
        <bq-option-group>
          <span slot="header-label">Sport</span>
          <!-- Option 1 -->
          ${Template({ ...args, text: 'Running', iconPrefix: 'sneaker-move', value: 'running' })}
          <!-- Option 2 -->
          ${Template({ ...args, text: 'Hiking', iconPrefix: 'boot', value: 'hiking' })}
          <!-- Option 3 -->
          ${Template({ ...args, text: 'Biking', iconPrefix: 'person-simple-bike', value: 'biking' })}
          <!-- Option 4 -->
          ${Template({ ...args, text: 'Swimming', iconPrefix: 'swimming-pool', value: 'swimming' })}
        </bq-option-group>
        <bq-option-group>
          <span slot="header-label">Food</span>
          <!-- Option 1 -->
          ${Template({ ...args, text: 'Pizza', iconPrefix: 'pizza', value: 'pizza' })}
          <!-- Option 2 -->
          ${Template({ ...args, text: 'Hamburger', iconPrefix: 'hamburger', value: 'hamburger' })}
          <!-- Option 3 -->
          ${Template({ ...args, text: 'Cookie', iconPrefix: 'cookie', value: 'cookie' })}
          <!-- Option 4 -->
          ${Template({ ...args, text: 'Ice-cream', iconPrefix: 'ice-cream', value: 'ice-cream' })}
        </bq-option-group>
      `,
    })}
  `,
};
