import type { Args, Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit-html';

import mdx from './bq-dropdown.mdx';

import { PANEL_PLACEMENT } from '../../panel/bq-panel.type';

const TRIGGER_ELEM_OPTIONS = ['default', 'menu', 'avatar'];

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
    // Not part of the public API, so we don't want to expose it in the
    text: { control: 'text', table: { disable: true } },
    htmlTrigger: { control: 'text', table: { disable: true }, options: TRIGGER_ELEM_OPTIONS },
  },
  args: {
    'panel-distance': 0,
    'panel-placement': 'bottom',
    'panel-open': false,
    'panel-scrollbar': true,
    text: 'Content in the panel',
    htmlTrigger: '',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => {
  const defaultTrigger = html` <bq-button
    appearance="secondary"
    size="medium"
    type="button"
    variant="standard"
    slot="trigger"
  >
    <span class="flex items-center gap-1">
      <span>Dropdown</span>
      <bq-icon name="caret-down"></bq-icon>
    </span>
  </bq-button>`;

  const menuTrigger = html` <bq-button
    appearance="secondary"
    href=""
    size="medium"
    target=""
    type="button"
    variant="standard"
    slot="trigger"
  >
    <bq-icon name="dots-three-vertical"></bq-icon>
  </bq-button>`;

  const avatarTrigger = html` <bq-avatar
    alt-text="User profile"
    image="https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1000&amp;q=80"
    label="Avatar component label"
    initials=""
    shape="circle"
    size="medium"
    slot="trigger"
  ></bq-avatar>`;

  let triggerElem = null;

  switch (args.htmlTrigger) {
    case 'menu':
      triggerElem = menuTrigger;
      break;
    case 'avatar':
      triggerElem = avatarTrigger;
      break;
    default:
      triggerElem = defaultTrigger;
  }

  return html`
    <bq-dropdown
      panel-distance=${args['panel-distance']}
      panel-placement=${args['panel-placement']}
      panel-open=${args['panel-open']}
      @bqPanelChange=${args.bqPanelChange}
    >
      <!-- TRIGGER ELEMENT -->
      ${triggerElem}

      <bq-option-list>
        <bq-option>
          <bq-icon name="user" slot="prefix"></bq-icon>
          <span>My profile</span>
        </bq-option>

        <bq-option>
          <bq-icon name="sliders" slot="prefix"></bq-icon>
          <span>Dashboard</span>
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
  render: Template,
};

export const MenuTrigger: Story = {
  render: Template,
  args: {
    htmlTrigger: 'menu',
  },
};

export const AvatarTrigger: Story = {
  render: Template,
  args: {
    htmlTrigger: 'avatar',
  },
};

export const Top: Story = {
  render: Template,
  args: {
    'panel-placement': top,
  },
};

export const WithoutScrollbar: Story = {
  render: Template,
  args: {
    'panel-scrollbar': false,
  },
};
