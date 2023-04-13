import { html } from 'lit-html';
import { TAB_SIZE } from '../../tab/bq-tab.types';
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
    size: { control: 'select', options: [...TAB_SIZE] },
    // Event handlers
    bqChange: { action: 'bqChange' },
    bqFocus: { action: 'bqFocus' },
    bqBlur: { action: 'bqBlur' },
  },
  args: {
    size: 'small',
  },
};

const Template = (args) => {
  return html`
    <bq-tab-group
      value="5"
      .size=${args.size}
      @bqChange=${args.bqChange}
      @bqFocus=${args.bqFocus}
      @bqBlur=${args.bqBlur}
    >
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

const IconTemplate = (args) => {
  return html`
    <bq-tab-group
      value="5"
      .size=${args.size}
      @bqChange=${args.bqChange}
      @bqFocus=${args.bqFocus}
      @bqBlur=${args.bqBlur}
    >
      <bq-tab tab-id="1"><bq-icon name="pulse" slot="icon"></bq-icon>Tab</bq-tab>
      <bq-tab tab-id="2"><bq-icon name="bell" slot="icon"></bq-icon>Tab</bq-tab>
      <bq-tab tab-id="3"><bq-icon name="airplane-in-flight" slot="icon"></bq-icon>Long Tab name</bq-tab>
      <bq-tab tab-id="4" disabled><bq-icon name="airplane-tilt" slot="icon"></bq-icon>Tab</bq-tab>
      <bq-tab tab-id="5" active><bq-icon name="align-right-simple" slot="icon"></bq-icon>Tab</bq-tab>
      <bq-tab tab-id="6"><bq-icon name="anchor" slot="icon"></bq-icon>Tab</bq-tab>
      <bq-tab tab-id="7"><bq-icon name="anchor-simple" slot="icon"></bq-icon>Tab</bq-tab>
      <bq-tab tab-id="8"><bq-icon name="android-logo" slot="icon"></bq-icon>Tab</bq-tab>
    </bq-tab-group>
  `;
};

export const Icon = IconTemplate.bind({});
