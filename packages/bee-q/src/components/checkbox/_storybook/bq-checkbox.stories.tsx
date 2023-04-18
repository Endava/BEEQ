import { html } from 'lit-html';
import mdx from './bq-checkbox.mdx';

import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/Checkbox',
  component: 'bq-checkbox',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'background-on-hover': { control: 'boolean' },
    'form-id': { control: 'text' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    name: { control: 'text' },
    required: { control: 'boolean' },
    value: { control: 'text' },
    // Event handlers
    bqBlur: { action: 'bqBlur' },
    bqFocus: { action: 'bqFocus' },
    bqChange: { action: 'bqChange' },
    // Not part of the component
    label: { control: 'text' },
  },
  args: {
    'background-on-hover': false,
    'form-id': undefined,
    checked: false,
    disabled: false,
    indeterminate: false,
    name: 'bee-q-checkbox',
    required: false,
    value: 'checkbox-value',
    // Not part of the component
    label: 'Checkbox label',
  },
};

export default meta;
type Story = StoryObj;

const Template = (args) => html`
  <bq-checkbox
    ?background-on-hover=${args['background-on-hover']}
    .formId=${args['form-id']}
    ?checked=${args.checked}
    ?disabled=${args.disabled}
    ?indeterminate=${args.indeterminate}
    .name=${args.name}
    ?required=${args.required}
    .value=${args.value}
    @bqFocus=${args.bqFocus}
    @bqBlur=${args.bqBlur}
    @bqChange=${args.bqChange}
  >
    ${args.label}
  </bq-checkbox>
`;

export const Default: Story = {
  render: Template.bind({}),
};

export const LongLabel: Story = {
  render: Template.bind({}),
  args: {
    label: 'By clicking here, I state that I have read and understood the terms and conditions.',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const BackgroundOnHover: Story = {
  render: Template.bind({}),
  args: {
    'background-on-hover': true,
  },
  name: 'Background on hover',
};

export const Checked: Story = {
  render: Template.bind({}),
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  render: Template.bind({}),
  args: {
    disabled: true,
  },
};

export const Indeterminate: Story = {
  render: (args) => {
    const allCheckboxChange = (event) => {
      const interestCheckboxes = [
        ...Array.from(document.querySelectorAll<HTMLInputElement>('bq-checkbox[name="interest"')),
      ];
      interestCheckboxes.forEach((interestCheckbox: HTMLInputElement) => {
        interestCheckbox.checked = event.detail.checked;
      });
    };

    const interestCheckboxChange = () => {
      const allInterestCheckbox = document.querySelector<HTMLInputElement>('bq-checkbox[name="all-interests"');
      if (!allInterestCheckbox) return;

      const interestCheckboxes = document.querySelectorAll('bq-checkbox[name="interest"');
      const onlyChecked = document.querySelectorAll('bq-checkbox[name="interest"][checked]').length;
      allInterestCheckbox.indeterminate = onlyChecked > 0 && onlyChecked < interestCheckboxes.length;
      allInterestCheckbox.checked = onlyChecked === interestCheckboxes.length;
    };

    return html`
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
        ${Template(args)}
        <div>
          <bq-checkbox value="all" name="all-interests" background-on-hover @bqChange=${allCheckboxChange}>
            Interests
          </bq-checkbox>
          <div style="display: flex; flex-direction: column; margin-left: 24px;">
            <bq-checkbox value="music" name="interest" background-on-hover @bqChange=${interestCheckboxChange}>
              Music
            </bq-checkbox>
            <bq-checkbox value="travel" name="interest" background-on-hover @bqChange=${interestCheckboxChange}>
              Travel
            </bq-checkbox>
            <bq-checkbox value="sport" name="interest" background-on-hover @bqChange=${interestCheckboxChange}>
              Sport
            </bq-checkbox>
          </div>
        </div>
      </div>
    `;
  },
  args: {
    indeterminate: true,
  },
};
