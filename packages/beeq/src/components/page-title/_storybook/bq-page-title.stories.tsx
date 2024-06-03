import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html, nothing } from 'lit-html';

import mdx from './bq-page-title.mdx';

const meta: Meta = {
  title: 'Components/Page title',
  component: 'bq-page-title',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'show-back-icon': { control: 'boolean' },
    'show-action-icons': { control: 'boolean' },
    'show-sub-title': { control: 'boolean' },
  },
  args: {
    'show-back-icon': false,
    'show-action-icons': false,
    'show-sub-title': false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-page-title
    ?show-back-icon=${args['show-back-icon']}
    ?show-action-icons=${args['show-action-icons']}
    ?show-sub-title=${args['show-sub-title']}
    >Title ${!args['sub-title'] ? html` <div slot="sub-title">Sub-title</div> ` : nothing}
  </bq-page-title>
`;

export const Default: Story = {
  render: Template,
};

export const TitleBack: Story = {
  name: 'Title + Back',
  render: Template,
  args: {
    'show-back-icon': true,
  },
};

export const TitleBackSubtitle: Story = {
  name: 'Title + Back + Subtitle',
  render: Template,
  args: {
    'show-back-icon': true,
    'show-sub-title': true,
  },
};

export const TitleBackActions: Story = {
  name: 'Title + Back + Subtitle + Actions',
  render: Template,
  args: {
    'show-back-icon': true,
    'show-action-icons': true,
    'show-sub-title': true,
  },
};
