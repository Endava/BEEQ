import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import { TOOLTIP_PLACEMENT } from '../bq-tooltip.types';
import mdx from './bq-tooltip.mdx';

const meta: Meta = {
  title: 'Components/Tooltip',
  component: 'bq-tooltip',
  parameters: {
    docs: {
      page: mdx,
    },
    layout: 'centered',
  },
  argTypes: {
    'always-visible': { control: 'boolean' },
    distance: { control: 'number' },
    'display-on': { control: 'inline-radio', options: ['click', 'hover'] },
    'hide-arrow': { control: 'boolean' },
    placement: { control: 'select', options: TOOLTIP_PLACEMENT },
    'same-width': { control: 'boolean' },
    visible: { control: 'boolean' },
    // This control is not part of the component
    text: { control: 'text', table: { disable: true } },
    trigger: { control: 'text', table: { disable: true } },
  },
  args: {
    'always-visible': false,
    distance: 10,
    'display-on': 'hover',
    'hide-arrow': false,
    placement: 'top',
    visible: false,
    'same-width': false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-tooltip
    ?always-visible=${args['always-visible']}
    distance=${ifDefined(args.distance)}
    display-on=${ifDefined(args['display-on'])}
    ?hide-arrow=${args['hide-arrow']}
    placement=${ifDefined(args.placement)}
    ?same-width=${args['same-width']}
    ?visible=${args.visible}
  >
    ${args.text}
    <bq-button slot="trigger">${args.trigger}</bq-button>
  </bq-tooltip>
`;

export const Default: Story = {
  render: Template,
  args: {
    visible: true,
    // This is not part of the component
    text: "Yuhu! I'm a tooltip 🙃",
    trigger: 'Hover me!',
  },
};

export const Bottom: Story = {
  render: Template,
  args: {
    placement: 'bottom',
    visible: true,
    // This is not part of the component
    text: "Yuhu! I'm a tooltip 🙃",
    trigger: 'Hover me!',
  },
};

export const Right: Story = {
  render: Template,
  args: {
    placement: 'right',
    visible: true,
    // This is not part of the component
    text: "Yuhu! I'm a tooltip 🙃",
    trigger: 'Hover me!',
  },
};

export const Left: Story = {
  render: Template,
  args: {
    placement: 'left',
    visible: true,
    // This is not part of the component
    text: "Yuhu! I'm a tooltip 🙃",
    trigger: 'Hover me!',
  },
};

export const NoArrow: Story = {
  render: Template,
  args: {
    'hide-arrow': true,
    visible: true,
    // This is not part of the component
    text: "Yuhu! I'm a tooltip 🙃",
    trigger: 'Hover me!',
  },
};

export const SameWidth: Story = {
  render: Template,
  args: {
    'same-width': true,
    visible: true,
    // This is not part of the component
    text: 'Tooltip',
    trigger: 'Hover me!',
  },
};

export const LongContent: Story = {
  render: Template,
  args: {
    visible: true,
    // This is not part of the component
    text: "Yuhu! I'm a tooltip 🙃, and I'm a long text that probably shouldn't be shown here but 'ce sa fac'",
    trigger: 'Hover me!',
  },
};

export const AlwaysVisible: Story = {
  render: Template,
  args: {
    'always-visible': true,
    // This is not part of the component
    text: "Yuhu! I'm a tooltip 🙃, and I'm a long text that probably shouldn't be shown here but 'ce sa fac'",
    trigger: 'Hover me!',
  },
};

export const DisplayOnClick: Story = {
  render: Template,
  args: {
    'display-on': 'click',
    visible: true,
    // This is not part of the component
    text: "Yuhu! I'm a tooltip 🙃",
    trigger: 'Click me!',
  },
};
