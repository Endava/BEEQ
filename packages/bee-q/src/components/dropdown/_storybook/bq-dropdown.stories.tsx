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
    'panel-distance': { control: 'number' },
    'panel-placement': { control: 'select', options: PANEL_PLACEMENT },
    'panel-open': { control: 'boolean' },
    'panel-scrollbar': { control: 'boolean' },
    // Event handlers
    bqPanelChange: { action: 'bqPanelChange' },
    // Event handler (bq-option-list)
    bqSelect: { action: 'bqSelect', table: { disable: true } },
    // Not part of the public API, so we don't want to expose it in the
    children: { control: 'text', table: { disable: true } },
  },
  args: {
    'panel-distance': 0,
    'panel-placement': 'bottom',
    'panel-open': false,
    'panel-scrollbar': false,
    children: { control: 'text', table: { disable: true } },
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  return html`
    <bq-dropdown
      panel-distance=${args['panel-distance']}
      panel-placement=${args['panel-placement']}
      panel-open=${args['panel-open']}
      panel-scrollbar=${args['panel-scrollbar']}
      @bqPanelChange=${args.bqPanelChange}
    >
      <!-- TRIGGER ELEMENT -->
      ${args.children}

      <bq-option-list @bqSelect=${args.bqSelect}>
        <bq-option>
          <bq-icon name="users" slot="prefix"></bq-icon>
          <span>Users</span>
        </bq-option>

        <bq-option>
          <bq-icon name="user" slot="prefix"></bq-icon>
          <span>My profile</span>
        </bq-option>

        <bq-option>
          <bq-icon name="sliders" slot="prefix"></bq-icon>
          <span>Dashboard</span>
        </bq-option>

        <bq-option>
          <span>Settings</span>
          <bq-icon name="gear" slot="prefix"></bq-icon>
        </bq-option>

        <bq-option>
          <span>Logout</span>
          <bq-icon name="sign-out" slot="suffix"></bq-icon>
        </bq-option>
      </bq-option-list>
    </bq-dropdown>
  `;
};

export const Default: Story = {
  render: (args: Args) => html`
    ${Template({
      ...args,
      children: html`
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
      children: html`
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
      children: html`
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
      children: html`
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
    'panel-placement': 'left-start',
  },
};

export const WithScrollbar: Story = {
  render: (args: Args) => html`
    ${Template({
      ...args,
      children: html`
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
    'panel-scrollbar': true,
  },
};
