import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { classMap } from 'lit/directives/class-map.js';
import { html, nothing } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';

import { DIVIDER_ORIENTATION, DIVIDER_STROKE_LINECAP, DIVIDER_TITLE_ALIGNMENT } from '../bq-divider.types';
import mdx from './bq-divider.mdx';

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
    'stroke-color': 'stroke--primary',
    'title-alignment': 'middle',
    'stroke-dash-width': 12,
    'stroke-dash-gap': 7,
    'stroke-thickness': 1,
    'stroke-basis': 0,
    'stroke-linecap': 'butt',
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <style>
    .bq-story-divider--vertical {
      block-size: 70dvh;
    }
    .bq-story-divider--horizontal {
      inline-size: 70dvw;
    }
    .bq-story-divider p {
      margin: 0;
      padding: 0;
      text-wrap: nowrap;
    }
  </style>
  <div
    class="bq-story-divider ${classMap({
      'bq-story-divider--vertical': args.orientation === 'vertical',
      'bq-story-divider--horizontal': args.orientation === 'horizontal',
    })}"
  >
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
      ${args['title-text'] ? html`<p>${args['title-text']}</p>` : nothing}
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
  render: (args) => html`
    <style>
      .bq-story-divider-group {
        display: flex;
        gap: var(--bq-spacing-xxl);
      }
      .bq-story-divider-group--column {
        flex-direction: column;
      }
      .bq-story-divider-group--row {
        flex-direction: row;
      }
    </style>
    <div
      class="bq-story-divider-group ${classMap({
        'bq-story-divider-group--column': args.orientation === 'horizontal',
        'bq-story-divider-group--row': args.orientation === 'vertical',
      })}"
    >
      <!-- Default -->
      ${Template(args)}
      <!-- with 'stoke-basis'  -->
      ${Template({ ...args, 'title-text': 'Text start with stroke basis', 'stroke-basis': 100 })}
      ${Template({ ...args, 'title-text': 'Text start with stroke basis', 'stroke-basis': 300 })}
    </div>
  `,
  args: {
    'title-alignment': 'start',
    'title-text': 'Text start',
  },
};

export const TextEnd: Story = {
  render: (args) => html`
    <style>
      .bq-story-divider-group {
        display: flex;
        gap: var(--bq-spacing-xxl);
      }
      .bq-story-divider-group--column {
        flex-direction: column;
      }
      .bq-story-divider-group--row {
        flex-direction: row;
      }
    </style>
    <div
      class="bq-story-divider-group ${classMap({
        'bq-story-divider-group--column': args.orientation === 'horizontal',
        'bq-story-divider-group--row': args.orientation === 'vertical',
      })}"
    >
      <!-- Default -->
      ${Template(args)}
      <!-- with 'stoke-basis'  -->
      ${Template({ ...args, 'title-text': 'Text end with stroke basis', 'stroke-basis': 100 })}
      ${Template({ ...args, 'title-text': 'Text end with stroke basis', 'stroke-basis': 300 })}
    </div>
  `,
  args: {
    'title-alignment': 'end',
    'title-text': 'Text end',
  },
};

export const TextMiddle: Story = {
  render: Template,
  args: {
    'title-text': 'Text Middle',
  },
};
