import { html } from 'lit-html';
import mdx from './bq-tooltip.mdx';
import { TOOLTIP_PLACEMENT } from '../bq-tooltip.types';

export default {
  title: 'Components/Tooltip',
  component: 'bq-tooltip',
  parameters: {
    docs: {
      page: mdx,
    },
    layout: 'centered',
  },
  argTypes: {
    distance: { control: 'number' },
    'display-on': { control: 'inline-radio', options: ['click', 'hover'] },
    'hide-arrow': { control: 'boolean' },
    placement: { control: 'select', options: TOOLTIP_PLACEMENT },
    'same-width': { control: 'boolean' },
    visible: { control: 'boolean' },
    // This control is not part of the component
    text: { control: 'text' },
  },
  args: {
    distance: 10,
    'display-on': 'hover',
    'hide-arrow': false,
    placement: 'top',
    visible: false,
    'same-width': false,
  },
};

const Template = (args) => html`
  <bq-tooltip
    distance=${args.distance}
    display-on=${args['display-on']}
    ?hide-arrow=${args['hide-arrow']}
    placement=${args.placement}
    same-width=${args['same-width']}
    ?visible=${args.visible}
  >
    ${args.text}
    <bq-button slot="trigger">Hover me!</bq-button>
  </bq-tooltip>
`;

export const Default = Template.bind({});
Default.args = {
  text: "Yuhu! I'm a tooltip 🙃",
  visible: true,
};

export const Bottom = Template.bind({});
Bottom.args = {
  text: "Yuhu! I'm a tooltip 🙃",
  placement: 'bottom',
  visible: true,
};

export const Right = Template.bind({});
Right.args = {
  text: "Yuhu! I'm a tooltip 🙃",
  placement: 'right',
  visible: true,
};

export const Left = Template.bind({});
Left.args = {
  text: "Yuhu! I'm a tooltip 🙃",
  placement: 'left',
  visible: true,
};

export const NoArrow = Template.bind({});
NoArrow.args = {
  text: "Yuhu! I'm a tooltip 🙃",
  'hide-arrow': true,
  visible: true,
};

export const SameWidth = Template.bind({});
SameWidth.args = {
  text: 'Tooltip',
  'same-width': true,
  visible: true,
};

export const LongContent = Template.bind({});
LongContent.args = {
  text: "Yuhu! I'm a tooltip 🙃, and I'm a long text that probably shouldn't be shown here but 'ce sa fac'",
  visible: true,
};

export const DisplayOnClick = (args) => html`
  <bq-tooltip
    distance=${args.distance}
    display-on=${args['display-on']}
    ?hide-arrow=${args['hide-arrow']}
    placement=${args.placement}
    same-width=${args['same-width']}
    ?visible=${args.visible}
  >
    ${args.text}
    <bq-button slot="trigger">
      <bq-icon name="mouse" slot="prefix"></bq-icon>
      Click me!
    </bq-button>
  </bq-tooltip>
`;
DisplayOnClick.args = {
  'display-on': 'click',
  text: "Yuhu! I'm a tooltip 🙃",
  visible: true,
};
