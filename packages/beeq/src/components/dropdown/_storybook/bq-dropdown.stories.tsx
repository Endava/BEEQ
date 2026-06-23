import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

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
    bqOpen: { action: 'bqOpen', table: { disable: true } },
    // Not part of the public API, so we don't want to expose it in the controls panel
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
  },
};
export default meta;

type Story = StoryObj;

const storyStyles = html`
  <style>
    .bq-dropdown-story__layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--bq-spacing-m);
      place-items: center;
      margin-block-start: var(--bq-spacing-xxl3);
    }

    .bq-dropdown-story__trigger-content {
      display: flex;
      align-items: center;
      gap: var(--bq-spacing-xs2);
    }

    .bq-dropdown-story__note {
      margin-block-end: var(--bq-spacing-l);
      padding-block: var(--bq-spacing-m);
      padding-inline: var(--bq-spacing-m);
      background-color: var(--bq-ui--success-alt);
      border: var(--bq-stroke-s) solid var(--bq-stroke--success);
      border-radius: var(--bq-radius--m);
    }

    .bq-dropdown-story__note-title {
      margin-block: 0 var(--bq-spacing-xs);
      font-size: var(--bq-font-size--m);
      font-weight: var(--bq-font-weight--bold);
    }

    @media (min-width: 640px) {
      .bq-dropdown-story__layout {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
  </style>
`;

const Template = (args: Args, trigger: unknown) => {
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
      @bqOpen=${args.bqOpen}
    >
      <!-- TRIGGER ELEMENT -->
      ${trigger}

      <bq-option-list> ${options} </bq-option-list>
    </bq-dropdown>
  `;
};

export const Default: Story = {
  render: (args: Args) => html`
    ${Template(
      args,
      html`
        <bq-button slot="trigger">
          Dropdown
          <bq-icon name="caret-down" slot="suffix"></bq-icon>
        </bq-button>
      `,
    )}
  `,
  args: {
    open: true,
  },
};

export const Placement: Story = {
  render: (args: Args) => html`
    ${storyStyles}
    <div class="bq-dropdown-story__layout">
      <!-- Bottom end -->
      ${Template(
        args,
        html`
          <bq-button slot="trigger">
            Dropdown
            <bq-icon name="caret-down" slot="suffix"></bq-icon>
          </bq-button>
        `,
      )}
      <!-- Bottom end -->
      ${Template(
        { ...args, placement: 'bottom-end' },
        html`
          <bq-button slot="trigger">
            Dropdown
            <bq-icon name="caret-down" slot="suffix"></bq-icon>
          </bq-button>
        `,
      )}
    </div>
  `,
  args: {
    open: true,
  },
};

export const CustomTrigger: Story = {
  render: (args: Args) => html`
    ${storyStyles}
    <div class="bq-dropdown-story__layout">
      <!-- Button icon -->
      ${Template(
        args,
        html`
          <bq-button appearance="secondary" size="medium" type="button" variant="standard" slot="trigger">
            <span class="bq-dropdown-story__trigger-content">
              <bq-icon name="dots-three-vertical"></bq-icon>
            </span>
          </bq-button>
        `,
      )}
      <!-- Avatar -->
      ${Template(
        args,
        html`
          <bq-avatar
            alt-text="User profile"
            image="https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80"
            label="Avatar component label"
            slot="trigger"
          ></bq-avatar>
        `,
      )}
    </div>
  `,
  args: {
    open: true,
    placement: 'bottom',
  },
};

export const KeepOpen: Story = {
  render: (args: Args) => html`
    ${storyStyles}
    <div class="bq-dropdown-story__note">
      <p class="bq-dropdown-story__note-title">💡 NOTE:</p>
      If keepOpenOnSelect is set, the dropdown will remain open after
      a selection is made.
    </div>
    ${Template(
      args,
      html`
        <bq-button slot="trigger">
          Dropdown
          <bq-icon name="caret-down" slot="suffix"></bq-icon>
        </bq-button>
      `,
    )}
  `,
  args: {
    'keep-open-on-select': true,
    open: true,
  },
};

export const WithOptionGroup: Story = {
  render: (args: Args) => html`
    ${Template(
      args,
      html`
        <bq-button slot="trigger">
          Dropdown
          <bq-icon name="caret-down" slot="suffix"></bq-icon>
        </bq-button>
      `,
    )}
  `,
  args: {
    open: true,
    enableOptionGroup: true,
  },
};
