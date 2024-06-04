import type { Args, Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit-html';

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
    haveBackNavigation: { control: 'boolean' },
  },
  args: {
    haveBackNavigation: false,
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <bq-page-title ?have-back-navigation=${args.haveBackNavigation}>
    ${args.title} ${args.subTitle ? html`<div slot="sub-title">${args.subTitle}</div>` : ''}
    ${args.actions ? html`<div class="flex gap-xs" slot="suffix">${args.actions}</div>` : ''}
  </bq-page-title>
`;

export const Default: Story = {
  render: Template,
  args: {
    title: 'Title',
  },
};

export const TitleBack: Story = {
  name: 'Title + Back',
  render: Template,
  args: {
    haveBackNavigation: true,
    title: 'Title',
  },
};

export const TitleBackSubtitle: Story = {
  name: 'Title + Back + Subtitle',
  render: Template,
  args: {
    haveBackNavigation: true,
    title: 'Title',
    subTitle: 'Sub-title',
  },
};

export const TitleBackActions: Story = {
  name: 'Title + Back + Subtitle + Actions',
  render: Template,
  args: {
    haveBackNavigation: true,
    title: 'Title',
    subTitle: 'Sub-title',
    actions: html`
      <bq-icon color="text--brand" name="pencil-simple" size="24" weight="bold"></bq-icon>
      <bq-icon color="text--brand" name="download-simple" size="24" weight="bold"></bq-icon>
    `,
  },
};
