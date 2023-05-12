import { html } from 'lit-html';
import mdx from './bq-option.mdx';

import type { Args, Meta, StoryObj } from '@storybook/web-components';

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
    text: { control: 'text', table: { disable: true } },
    bqOptionBlur: { action: 'bqOptionBlur' },
    bqOptionFocus: { action: 'bqOptionFocus' },
    bqOptionClick: { action: 'bqOptionClick' },
    bqOptionOnEnter: { action: 'bqOptionOnEnter' },
  },
  args: {
    disabled: false,
    selected: false,
    text: 'Option label',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <div style="width: 200px;">
    <bq-option
      disabled=${args.disabled}
      selected=${args.selected}
      @bqBlur=${args.bqBlur}
      @bqFocus=${args.bqFocus}
      @bqClick=${args.bqClick}
    >
      <bq-icon name="user" size="16" slot="prefix"></bq-icon>
      <span>${args.text}</span>
      <bq-icon name="gear" size="16" slot="suffix"></bq-icon>
    </bq-option>
  </div>
`;

export const Default: Story = {
  render: Template,
  args: {},
};

export const Selected: Story = {
  render: Template,
  args: {
    selected: true,
    text: 'Selected',
  },
};

export const Disabled: Story = {
  render: (args) => html`
    <div style="width: 200px;">
      <bq-option
        disabled=${args.disabled}
        selected=${args.selected}
        @bqBlur=${args.bqBlur}
        @bqFocus=${args.bqFocus}
        @bqClick=${args.bqClick}
      >
        <bq-icon name="lock" size="16" slot="prefix"></bq-icon>
        <span>${args.text}</span>
      </bq-option>
    </div>
  `,
  args: {
    disabled: true,
    text: 'Disabled',
  },
};

export const InPanel: Story = {
  render: (args) => html`
    <bq-dropdown style="position: absolute; left: 50%">
      <bq-button slot="trigger">Toggle panel</bq-button>

      <bq-panel distance="0" placement="bottom">
        <bq-option value="profile-page"> 
          <bq-icon name="user" size="16" slot="prefix"></bq-icon>
          <span>My profile</span>
          <bq-icon name="gear" size="16" slot="suffix"></bq-icon>
        </bq-option>

        <bq-option value="dashboard" disabled="true">
          <bq-icon name="lock" size="16" slot="prefix"></bq-icon>
          <span>Dashboard</span>
        </bq-option>

        <bq-option value="logout">
          <span>Logout</span>
          <bq-icon name="sign-out" size="16" slot="suffix"></bq-icon></span>
        </bq-option>
      </bq-panel>
    </bq-dropdown>
  `,
};

export const Group: Story = {
  render: (args) => html`
    <bq-dropdown style="position: absolute; left: 50%">
      <bq-button slot="trigger">Toggle panel</bq-button>

      <bq-panel distance="0" placement="bottom">
        <bq-option-group>
          <bq-icon name="person-simple-run" size="16" slot="label-prefix"></bq-icon>
          <span slot="label">Sport</span>

          <bq-option value="biking">
            <span>Biking</span>
            <bq-icon name="person-simple-bike" size="16" slot="suffix"></bq-icon>
          </bq-option>

          <bq-option value="swimming">
            <span>Swimming</span>
            <bq-icon name="swimming-pool" size="16" slot="suffix"></bq-icon>
          </bq-option>

          <bq-option value="hiking">
            <bq-icon name="boot" size="16" slot="prefix"></bq-icon>
            <span>Hiking</span>
          </bq-option>

          <bq-option value="running">
            <bq-icon name="sneaker-move" size="16" slot="prefix"></bq-icon>
            <span>Running</span>
          </bq-option>
        </bq-option-group>

        <bq-option-group>
          <bq-icon name="fork-knife" size="16" slot="label-prefix"></bq-icon>
          <span slot="label">Food</span>

          <bq-option value="pizza">
            <bq-icon name="pizza" size="16" slot="prefix"></bq-icon>
            <span>Pizza</span>
            <bq-icon name="bowl-food" size="16" slot="suffix"></bq-icon>
          </bq-option>

          <bq-option value="seeds" disabled="true">
            <bq-icon name="lock" size="16" slot="prefix"></bq-icon>
            <span>Seeds</span>
          </bq-option>

          <bq-option value="orange">
            <span>Slice of orange</span>
            <bq-icon name="orange-slice" size="16" slot="suffix"></bq-icon>
          </bq-option>
        </bq-option-group>
      </bq-panel>
    </bq-dropdown>
  `,
};
