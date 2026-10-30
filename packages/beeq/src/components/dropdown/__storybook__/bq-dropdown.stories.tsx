import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { fn } from 'storybook/test';

import mdx from './bq-dropdown.mdx';

const meta: Meta = {
  title: 'Components/Dropdown',
  component: 'bq-dropdown',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'disable-scroll-lock': { control: 'boolean' },
    disabled: { control: 'boolean' },
    distance: { control: 'number' },
    placement: {
      control: 'select',
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'right',
        'right-start',
        'right-end',
        'left',
        'left-start',
        'left-end',
      ],
    },
    open: { control: 'boolean' },
    'panel-height': { control: 'text' },
    'keep-open-on-select': { control: 'boolean' },
    'same-width': { control: 'boolean' },
    skidding: { control: 'number' },
    strategy: { control: 'select', options: ['fixed', 'absolute'] },
    // Event handlers
    bqSelect: { table: { disable: true } },
    // Not part of the public API, so we don't want to expose it in the
    trigger: { control: 'text', table: { disable: true } },
    enableOptionGroup: { control: 'boolean', table: { disable: true } },
  },
  args: {
    'disable-scroll-lock': false,
    disabled: false,
    distance: 4,
    placement: 'bottom-start',
    open: false,
    'panel-height': undefined,
    'keep-open-on-select': false,
    'same-width': false,
    skidding: 0,
    strategy: 'fixed',
    // Events
    bqSelect: fn(),
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  const optionItems = html`
    <bq-option value="users">
      <bq-icon name="users" slot="prefix"></bq-icon>
      <span>Users</span>
    </bq-option>

    <bq-option value="user">
      <bq-icon name="user" slot="prefix"></bq-icon>
      <span>My profile</span>
    </bq-option>

    <bq-option value="dashboard">
      <bq-icon name="sliders" slot="prefix"></bq-icon>
      <span>Dashboard</span>
    </bq-option>

    <bq-option value="settings">
      <span>Settings</span>
      <bq-icon name="gear" slot="prefix"></bq-icon>
    </bq-option>

    <bq-option value="logout">
      <span>Logout</span>
      <bq-icon name="sign-out" slot="suffix"></bq-icon>
    </bq-option>
  `;

  const options = args.enableOptionGroup
    ? html`
        <bq-option-group>
          <span slot="header-label">Configuration</span>
          ${optionItems}
        </bq-option-group>
      `
    : optionItems;

  return html`
    <bq-dropdown
      ?disabled=${args.disabled}
      distance=${ifDefined(args.distance)}
      ?disable-scroll-lock=${args['disable-scroll-lock']}
      ?keep-open-on-select=${args['keep-open-on-select']}
      ?open=${args.open}
      panel-height=${ifDefined(args['panel-height'])}
      placement=${ifDefined(args.placement)}
      ?same-width=${args['same-width']}
      skidding=${ifDefined(args.skidding)}
      strategy=${ifDefined(args.strategy)}
      @bqSelect=${args.bqSelect}
    >
      <!-- TRIGGER ELEMENT -->
      ${args.trigger}

      <bq-option-list> ${options} </bq-option-list>
    </bq-dropdown>
  `;
};

export const Default: Story = {
  render: (args: Args) => html`
    ${Template({
      ...args,
      trigger: html`
        <bq-button slot="trigger">
          Dropdown
          <bq-icon name="caret-down" slot="suffix"></bq-icon>
        </bq-button>
      `,
    })}
  `,
  args: {
    open: true,
  },
};

export const Placement: Story = {
  render: (args: Args) => html`
    <style>
      .bq-story-dropdown {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        place-items: center;
        gap: var(--bq-spacing-m);
        margin-block-start: var(--bq-spacing-xxl3);
      }

      @media (min-width: 640px) {
        .bq-story-dropdown {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    </style>
    <div class="bq-story-dropdown">
      <!-- Bottom end -->
      ${Template({
        ...args,
        trigger: html`
          <bq-button slot="trigger">
            Dropdown
            <bq-icon name="caret-down" slot="suffix"></bq-icon>
          </bq-button>
        `,
      })}
      <!-- Bottom end -->
      ${Template({
        ...args,
        placement: 'bottom-end',
        trigger: html`
          <bq-button slot="trigger">
            Dropdown
            <bq-icon name="caret-down" slot="suffix"></bq-icon>
          </bq-button>
        `,
      })}
    </div>
  `,
  args: {
    open: true,
  },
};

export const CustomTrigger: Story = {
  render: (args: Args) => html`
    <style>
      .bq-story-dropdown {
        display: grid;
        grid-template-columns: repeat(1, minmax(0, 1fr));
        place-items: center;
        gap: var(--bq-spacing-m);
        margin-block-start: var(--bq-spacing-xxl3);
      }

      @media (min-width: 640px) {
        .bq-story-dropdown {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      .bq-story-dropdown bq-button > span {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
    </style>
    <div class="bq-story-dropdown">
      <!-- Button icon -->
      ${Template({
        ...args,
        trigger: html`
          <bq-button appearance="secondary" size="medium" type="button" variant="standard" slot="trigger">
            <span>
              <bq-icon name="dots-three-vertical"></bq-icon>
            </span>
          </bq-button>
        `,
      })}
      <!-- Avatar -->
      ${Template({
        ...args,
        trigger: html`
          <bq-avatar
            alt-text="User profile"
            image="https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80"
            label="Avatar component label"
            slot="trigger"
          ></bq-avatar>
        `,
      })}
    </div>
  `,
  args: {
    open: true,
    placement: 'bottom',
  },
};

export const KeepOpen: Story = {
  render: (args: Args) => html`
    <style>
      .bq-story-dropdown-note {
        border-radius: var(--bq-radius--m);
        border-width: var(--bq-stroke-s);
        border-style: solid;
        border-color: var(--bq-stroke--success);
        background-color: var(--bq-ui--success-alt);
        padding-block: var(--bq-spacing-m);
        padding-inline: var(--bq-spacing-m);
        margin-block-end: var(--bq-spacing-l);
      }

      .bq-story-dropdown-note p {
        font-size: var(--bq-font-size--m);
        font-weight: var(--bq-font-weight--bold);
        margin-block-end: var(--bq-spacing-xs);
      }
    </style>
    <div class="bq-story-dropdown-note">
      <p>💡 NOTE:</p>
      If <code>keepOpenOnSelect</code> is set, the dropdown will remain open after a selection
      is made.
    </div>
    ${Template({
      ...args,
      trigger: html`
        <bq-button slot="trigger">
          Dropdown
          <bq-icon name="caret-down" slot="suffix"></bq-icon>
        </bq-button>
      `,
    })}
  `,
  args: {
    'keep-open-on-select': true,
    open: true,
  },
};

export const WithOptionGroup: Story = {
  render: (args: Args) => html`
    ${Template({
      ...args,
      trigger: html`
        <bq-button slot="trigger">
          Dropdown
          <bq-icon name="caret-down" slot="suffix"></bq-icon>
        </bq-button>
      `,
    })}
  `,
  args: {
    open: true,
    enableOptionGroup: true,
  },
};
