import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import mdx from './bq-divider.mdx';
import { DIVIDER_ORIENTATION, DIVIDER_STROKE_LINECAP, DIVIDER_TITLE_ALIGNMENT } from '../bq-divider.types';

const meta: Meta = {
  title: 'Components/Divider',
  component: 'bq-divider',
  parameters: {
    docs: {
      page: mdx,
    },
    layout: 'centered',
  },
  argTypes: {
    orientation: { control: 'select', options: [...DIVIDER_ORIENTATION] },
    dashed: { control: 'boolean' },
    'stroke-color': { control: 'text' },
    'title-alignment': { control: 'select', options: [...DIVIDER_TITLE_ALIGNMENT] },
    'stroke-dash-width': { control: 'number' },
    'stroke-dash-gap': { control: 'number' },
    'stroke-thickness': { control: 'number' },
    'stroke-basis': { control: 'number' },
    'stroke-linecap': { control: 'select', options: [...DIVIDER_STROKE_LINECAP] },
    // This control is not part of the component
    'title-text': { control: 'text', table: { disable: true } },
  },
  args: {
    orientation: 'horizontal',
    dashed: false,
    'stroke-color': 'stroke--secondary',
    'title-alignment': 'middle',
    'stroke-dash-width': 12,
    'stroke-dash-gap': 7,
    'stroke-thickness': 2,
    'stroke-basis': 20,
    'stroke-linecap': 'butt',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <div class="is-[70dvw]">
    <bq-divider
      orientation=${ifDefined(args.orientation)}
      ?dashed=${args.dashed}
      stroke-color=${ifDefined(args['stroke-color'])}
      stroke-dash-width=${ifDefined(args['stroke-dash-width'])}
      stroke-dash-gap=${ifDefined(args['stroke-dash-gap'])}
      stroke-thickness=${ifDefined(args['stroke-thickness'])}
      stroke-basis=${ifDefined(args['stroke-basis'])}
      stroke-linecap=${ifDefined(args['stroke-linecap'])}
      title-alignment=${ifDefined(args['title-alignment'])}
    >
      ${args['title-text'] ? html`<p class="m-0 text-nowrap p-0">${args['title-text']}</p>` : nothing}
    </bq-divider>
  </div>
`;

export const Default: Story = {
  render: Template,
  args: {
    'title-text': 'Default divider',
  },
};

export const Horizontal: Story = {
  render: Template,
  args: {
    'title-text': 'Horizontal divider',
  },
};

export const Vertical: Story = {
  render: Template,
  args: {
    orientation: 'vertical',
    'title-text': 'Vertical divider',
  },
};

export const DashedLine: Story = {
  render: Template,
  args: {
    dashed: true,
  },
};

export const NoTitle: Story = {
  render: Template,
};

export const TextStart: Story = {
  render: Template,
  args: {
    'title-alignment': 'start',
    'title-text': 'Text Start',
  },
};

export const TextEnd: Story = {
  render: Template,
  args: {
    'title-alignment': 'end',
    'title-text': 'Text End',
  },
};

export const TextMiddle: Story = {
  render: Template,
  args: {
    'title-text': 'Text Middle',
  },
};
