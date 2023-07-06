import type { Meta, StoryObj } from '@storybook/web-components';

import { html } from 'lit-html';

import mdx from './bq-breadcrumb.mdx';

const meta: Meta = {
  title: 'Components/Breadcrumb',
  component: 'bq-breadcrumb',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    text: { control: 'text', table: { disable: true } },
  },
  args: {
    text: 'text',
  },
};
export default meta;

type Story = StoryObj;

const Template = () => html`
  <bq-breadcrumb>
    <bq-breadcrumb-item>
      <bq-icon name="house-line" size="16" slot="prefix"></bq-icon>
      <span>Home</span>
    </bq-breadcrumb-item>
    <bq-breadcrumb-item>Application Center</bq-breadcrumb-item>
    <bq-breadcrumb-item>
      Application List
      <bq-icon name="list-dashes" size="16" slot="suffix"></bq-icon>
    </bq-breadcrumb-item>
    <bq-breadcrumb-item>App 1</bq-breadcrumb-item>
  </bq-breadcrumb>
`;

export const Default: Story = {
  render: Template,
  args: {},
};

export const Links: Story = {
  render: () => html`
    <bq-breadcrumb>
      <bq-breadcrumb-item href="https://example.com/" target="_blank">
        <bq-icon name="house-line" size="16" slot="prefix"></bq-icon>
        <span slot="label">Home</span>
      </bq-breadcrumb-item>
      <bq-breadcrumb-item href="https://example.com/center" target="_blank">
        <span slot="label">Application Center</span>
      </bq-breadcrumb-item>
      <bq-breadcrumb-item href="https://example.com/center/list" target="_blank">
        <span slot="label">Application List</span>
        <bq-icon name="list-dashes" size="16" slot="suffix"></bq-icon>
      </bq-breadcrumb-item>
      <bq-breadcrumb-item href="https://example.com/center/list/app" target="_blank">
        <span slot="label">App 1</span>
      </bq-breadcrumb-item>
    </bq-breadcrumb>
  `,
};
