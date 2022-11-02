import { html } from 'lit-html';

import { DIVIDER_TITLE_ALIGNMENT, DIVIDER_ORIENTATION } from '../bq-divider.types';
import mdx from './bq-divider.mdx';

export default {
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
    strokeColor: { control: 'text' },
    'title-alignment': { control: 'select', options: [...DIVIDER_TITLE_ALIGNMENT] },
    // This control is not part of the component
    'title-text': { control: 'text', table: { disable: true } },
  },
  args: {
    orientation: 'horizontal',
    dashed: false,
    strokeColor: 'ui--secondary',
    'title-alignment': 'middle',
  },
};

const Template = (args) => html`
  <style>
    .container {
      width: 40%;
      ${args.orientation === 'vertical' ? html`height: 70vh;` : null}
    }
  </style>
  <div class="container">
    <bq-divider
      orientation=${args.orientation}
      ?dashed=${args.dashed}
      strokeColor=${args.strokeColor}
      title-alignment=${args['title-alignment']}
    >
      ${args['title-text'] ? html`<p style="margin: 0;">${args['title-text']}</p>` : null}
    </bq-divider>
  </div>
`;

export const Default = (args) => Template(args);
Default.args = {
  'title-text': 'Default divider',
};

export const Horizontal = (args) => Template(args);
Horizontal.args = {
  'title-text': 'Horizontal divider',
};

export const Vertical = (args) => Template(args);
Vertical.args = {
  orientation: 'vertical',
  'title-text': 'Vertical divider',
};

export const DashedLine = (args) => Template(args);
DashedLine.args = {
  dashed: true,
};

export const NoTitle = (args) => Template(args);

export const TextStart = (args) => Template(args);
TextStart.args = {
  'title-alignment': 'start',
  'title-text': 'Text Start',
};

export const TextEnd = (args) => Template(args);
TextEnd.args = {
  'title-alignment': 'end',
  'title-text': 'Text End',
};

export const TextMiddle = (args) => Template(args);
TextMiddle.args = {
  'title-text': 'Text Middle',
};
