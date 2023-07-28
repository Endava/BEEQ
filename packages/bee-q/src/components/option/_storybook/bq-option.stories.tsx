import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { ifDefined } from 'lit/directives/if-defined.js';
import { html, nothing } from 'lit-html';

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
    disabled: { control: 'boolean' },
    selected: { control: 'boolean' },
    // Event handlers
    bqBlur: { action: 'bqBlur' },
    bqFocus: { action: 'bqFocus' },
    bqClick: { action: 'bqClick' },
    // Event handler of the parent component (bq-option-list)
    bqSelect: { action: 'bqSelect', table: { disable: true } },
    // Not part of the public API, so we don't want to expose it in the docs
    children: { control: 'text', table: { disable: true } },
    text: { control: 'text', table: { disable: true } },
    iconPreffix: { control: 'text', table: { disable: true } },
    iconSuffix: { control: 'text', table: { disable: true } },
  },
  args: {
    disabled: false,
    selected: false,
    iconPreffix: undefined,
    iconSuffix: undefined,
  },
};
export default meta;

type Story = StoryObj;

const TemplateList = (args: Args) => html`
  <bq-option-list @bqSelect=${args.bqSelect}> ${args.children} </bq-option-list>
`;

const Template = (args: Args) => {
  const bqIconPrefix = args.iconPreffix ? html`<bq-icon name=${args.iconPreffix} slot="prefix"></bq-icon>` : nothing;
  const bqIconSuffix = args.iconSuffix ? html`<bq-icon name=${args.iconSuffix} slot="suffix"></bq-icon>` : nothing;

  return html`
    <bq-option
      ?disabled=${args.disabled}
      ?selected=${args.selected}
      value=${ifDefined(args.value)}
      @bqBlur=${args.bqBlur}
      @bqFocus=${args.bqFocus}
      @bqClick=${args.bqClick}
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
        ${Template({ ...args, text: 'User profile', iconPreffix: 'user', value: 'user' })}
        <!-- Option 2 -->
        ${Template({ ...args, text: 'Change password', iconPreffix: 'lock-simple', value: 'changepassword' })}
        <!-- Option 3 -->
        ${Template({ ...args, text: 'Close session', iconPreffix: 'sign-out', value: 'logout' })}
      `,
    })}`,
};

export const Active: Story = {
  render: (args: Args) =>
    html` ${TemplateList({
      ...args,
      children: html`
        <!-- Option 1 -->
        ${Template({ ...args, selected: true, text: 'User profile', iconPreffix: 'user', value: 'user' })}
        <!-- Option 2 -->
        ${Template({ ...args, text: 'Change password', iconPreffix: 'lock-simple', value: 'changepassword' })}
        <!-- Option 3 -->
        ${Template({ ...args, text: 'Close session', iconPreffix: 'sign-out', value: 'logout' })}
      `,
    })}`,
};

export const Disabled: Story = {
  render: (args: Args) =>
    html` ${TemplateList({
      ...args,
      children: html`
        <!-- Option 1 -->
        ${Template({ ...args, text: 'User profile', iconPreffix: 'user', value: 'user' })}
        <!-- Option 2 -->
        ${Template({ ...args, disabled: true, text: 'Admin Dashboard', iconPreffix: 'layout', value: 'admin' })}
        <!-- Option 3 -->
        ${Template({ ...args, text: 'Change password', iconPreffix: 'lock-simple', value: 'changepassword' })}
        <!-- Option 4 -->
        ${Template({ ...args, text: 'Close session', iconPreffix: 'sign-out', value: 'logout' })}
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
          ${Template({ ...args, text: 'Running', iconSuffix: 'sneaker-move', value: 'running' })}
          <!-- Option 2 -->
          ${Template({ ...args, text: 'Hiking', iconSuffix: 'boot', value: 'hiking' })}
          <!-- Option 3 -->
          ${Template({ ...args, text: 'Biking', iconSuffix: 'person-simple-bike', value: 'biking' })}
          <!-- Option 4 -->
          ${Template({ ...args, text: 'Swimming', iconSuffix: 'swimming-pool', value: 'swimming' })}
        </bq-option-group>
        <bq-option-group>
          <span slot="header-label">Food</span>
          <!-- Option 1 -->
          ${Template({ ...args, text: 'Pizza', iconSuffix: 'pizza', value: 'pizza' })}
          <!-- Option 2 -->
          ${Template({ ...args, text: 'Hamburger', iconSuffix: 'hamburger', value: 'hamburger' })}
          <!-- Option 3 -->
          ${Template({ ...args, text: 'Cookie', iconSuffix: 'cookie', value: 'cookie' })}
          <!-- Option 4 -->
          ${Template({ ...args, text: 'Ice-cream', iconSuffix: 'ice-cream', value: 'ice-cream' })}
        </bq-option-group>
      `,
    })}
  `,
};
