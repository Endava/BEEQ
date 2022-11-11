import { html } from 'lit-html';
import mdx from './bq-tab-group.mdx';

export default {
  title: 'Components/Tab group',
  component: 'bq-tab-group',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    // Event handlers
    bqChange: { action: 'bqChange' },
    bqFocus: { action: 'bqFocus' },
    bqBlur: { action: 'bqBlur' },
  },
  args: {},
};

const Template = (args) => {
  return html`
    <bq-tab-group value="5" @bqChange=${args.bqChange} @bqFocus=${args.bqFocus} @bqBlur=${args.bqBlur}>
      <bq-tab tab-id="1">Tab</bq-tab>
      <bq-tab tab-id="2">Tab</bq-tab>
      <bq-tab tab-id="3">Long Tab name</bq-tab>
      <bq-tab tab-id="4" disabled>Tab</bq-tab>
      <bq-tab tab-id="5" active>Tab</bq-tab>
      <bq-tab tab-id="6">Tab</bq-tab>
      <bq-tab tab-id="7">Tab</bq-tab>
      <bq-tab tab-id="8">Tab</bq-tab>
    </bq-tab-group>
  `;
};

export const Default = Template.bind({});
