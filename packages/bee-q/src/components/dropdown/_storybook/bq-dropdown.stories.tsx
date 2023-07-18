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
    text: { control: 'text', table: { disable: true } },
    htmlTrigger: { control: 'text', table: { disable: true }, options: TRIGGER_ELEM_OPTIONS },
    // Event handlers
    bqOptionBlur: { action: 'bqOptionBlur' },
    bqOptionFocus: { action: 'bqOptionFocus' },
    bqOptionSelect: { action: 'bqOptionSelect' },
    bqPanelOpen: { action: 'bqPanelOpen' },
  },
  args: {
    'panel-distance': 0,
    'panel-placement': 'bottom',
    'panel-open': false,
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
    <span class="flex items-center">
      <span>Dropdown</span>
      <bq-icon name="caret-down" class="pl-[3px]"></bq-icon>
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
      @bqOptionBlur=${args.bqOptionBlur}
      @bqOptionFocus=${args.bqOptionFocus}
      @bqOptionSelect=${args.bqOptionSelect}
      @bqPanelOpen=${args.bqPanelOpen}
    >
      <!-- TRIGGER ELEMENT -->
      ${triggerElem}

      <!-- TODO: switch divs with bq-option after merge -->
      <div
        class="flex h-[40px] w-full cursor-pointer items-center rounded-s bg-transparent px-3 py-2 text-m focus-visible:focus hover:bg-ui-secondary-hover active:bg-ui-brand-light active:text-text-brand active:outline-none"
      >
        <bq-icon name="user" size="16" slot="prefix" class="flex items-center"></bq-icon>
        <span class="flex w-full items-center overflow-hidden text-ellipsis whitespace-nowrap px-[12px]"
          >My profile</span
        >
        <bq-icon name="gear" size="16" slot="suffix"></bq-icon>
      </div>
      <div
        class="flex h-[40px] w-full cursor-pointer items-center rounded-s bg-transparent px-3 py-2 text-m focus-visible:focus hover:bg-ui-secondary-hover active:bg-ui-brand-light active:text-text-brand active:outline-none"
      >
        <bq-icon name="lock" size="16" slot="prefix" class="flex items-center"></bq-icon>
        <span class="flex w-full items-center overflow-hidden text-ellipsis whitespace-nowrap px-[12px]"
          >Dashboard</span
        >
      </div>
      <div
        class="flex h-[40px] w-full cursor-pointer items-center rounded-s bg-transparent px-3 py-2 text-m focus-visible:focus hover:bg-ui-secondary-hover active:bg-ui-brand-light active:text-text-brand active:outline-none"
      >
        <span class="flex w-full items-center overflow-hidden text-ellipsis whitespace-nowrap pl-0">Logout</span>
        <bq-icon name="sign-out" size="16" slot="suffix"></bq-icon>
      </div>
    </bq-dropdown>
  `;
};

export const Default: Story = {
  render: Template,
  args: {},
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
