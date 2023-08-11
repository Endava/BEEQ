import type { Args, Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit-html';

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
    bqSelect: { action: 'bqSelect', table: { disable: true } },
    // Not part of the public API, so we don't want to expose it in the
    trigger: { control: 'text', table: { disable: true } },
  },
  args: {
    distance: 4,
    placement: 'bottom-start',
    open: false,
    'panel-height': undefined,
    'keep-open-on-select': false,
    'same-width': false,
    skidding: 0,
    strategy: 'fixed',
    trigger: { control: 'text', table: { disable: true } },
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-dropdown
    distance=${args.distance}
    placement=${args.placement}
    ?open=${args.open}
    panel-height=${args['panel-height']}
    ?keep-open-on-select=${args['keep-open-on-select']}
    ?same-width=${args['same-width']}
    skidding=${args.skidding}
    strategy=${args.strategy}
    @bqSelect=${args.bqSelect}
  >
    <!-- TRIGGER ELEMENT -->
    ${args.trigger}

    <bq-option-list>
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
    </bq-option-list>
  </bq-dropdown>
`;

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
    <div class="mt-xxl3 grid grid-cols-1 place-items-center gap-m sm:grid-cols-2">
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
    <div class="mt-xxl3 grid grid-cols-1 place-items-center gap-m sm:grid-cols-2">
      <!-- Button icon -->
      ${Template({
        ...args,
        trigger: html`
          <bq-button appearance="secondary" size="medium" type="button" variant="standard" slot="trigger">
            <span class="flex items-center gap-1">
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
    <div class="bg-ui-success-light mb-l rounded-m border border-solid border-stroke-success p-m">
      <p class="mb-xs text-m font-bold">💡 NOTE:</p>
      If <code class="text-text-danger">keepOpenOnSelect</code> is set, the dropdown will remain open after a selection
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
