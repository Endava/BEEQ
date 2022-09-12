import { html } from 'lit-html';
import mdx from './bq-avatar.mdx';

export default {
  title: 'Components/Avatar',
  component: 'bq-avatar',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    image: { control: 'text' },
    label: { control: 'text' },
    initials: { control: 'text' },
    shape: { control: 'inline-radio', options: ['circle', 'square'] },
    size: { control: 'select', options: ['xsmall', 'small', 'medium', 'large'] },
  },
  args: {
    label: 'Avatar component label',
    shape: 'circle',
    size: 'medium',
  },
};

export const Image = (args) => html`
  <bq-avatar image=${args.image} label=${args.label} initials=${args.initials} shape=${args.shape} size=${args.size} />
`;
Image.args = {
  image:
    'https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80',
};

export const Initials = (args) => Image(args);
Initials.args = {
  image: undefined,
  initials: 'JS',
};
