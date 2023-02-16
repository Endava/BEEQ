import { html } from 'lit-html';
import mdx from './bq-badge.mdx';
import { BADGE_SIZE } from '../bq-badge.types';

export default {
  title: 'Components/Badge',
  component: 'bq-badge',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'background-color': { control: 'text' },
    size: { control: 'select', options: BADGE_SIZE },
    'text-color': { control: 'text' },
    // This control is not part of the component
    content: { control: 'text' },
  },
  args: {
    size: 'small',
  },
};

const Template = (args) => html`
  <bq-badge background-color=${args['background-color']} size=${args.size} text-color=${args['text-color']}>
    ${args.content}
  </bq-badge>
`;

export const Default = Template.bind({});

export const Medium = Template.bind({});
Medium.args = { size: 'medium' };

export const Digit = Template.bind({});
Digit.args = { content: '2' };

export const Number = Template.bind({});
Number.args = { content: '12' };

export const Green = Template.bind({});
Green.args = {
  'background-color': 'data--green',
  size: 'large',
};
