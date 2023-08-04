import type { Args, Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit-html';

import mdx from './bq-dropdown.mdx';

import { PANEL_PLACEMENT } from '../../panel/bq-panel.type';

const meta: Meta = {
  title: 'Components/Dropdown',
  component: 'bq-dropdown',
  parameters: {
    docs: {
      page: mdx,
    },
    layout: 'centered',
  },
  argTypes: {
    distance: { control: 'number' },
    placement: { control: 'select', options: PANEL_PLACEMENT },
    open: { control: 'boolean' },
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
        <bq-button appearance="secondary" size="medium" type="button" variant="standard" slot="trigger">
          <span class="flex items-center gap-1">
            <span>Dropdown</span>
            <bq-icon name="caret-down"></bq-icon>
          </span>
        </bq-button>
      `,
    })}
  `,
};

export const MenuTrigger: Story = {
  render: (args: Args) => html`
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
  `,
};

export const AvatarTrigger: Story = {
  render: (args: Args) => html`
    ${Template({
      ...args,
      trigger: html`
        <bq-avatar
          alt-text="User profile"
          image="https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80"
          label="Avatar component label"
          shape="circle"
          size="medium"
          slot="trigger"
        ></bq-avatar>
      `,
    })}
  `,
};

export const SidePanel: Story = {
  render: (args: Args) => html`
    ${Template({
      ...args,
      trigger: html`
        <bq-button appearance="secondary" size="medium" type="button" variant="standard" slot="trigger">
          <span class="flex items-center gap-1">
            <span>Dropdown</span>
            <bq-icon name="caret-down"></bq-icon>
          </span>
        </bq-button>
      `,
    })}
  `,
  args: {
    placement: 'left-start',
  },
};
