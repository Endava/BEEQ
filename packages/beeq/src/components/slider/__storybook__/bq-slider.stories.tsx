import type { Args, Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { fn } from 'storybook/test';

import mdx from './bq-slider.mdx';

const meta: Meta = {
  title: 'Components/Slider',
  component: 'bq-slider',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    'debounce-time': { control: 'number' },
    disabled: { control: 'boolean' },
    'enable-value-indicator': { control: 'boolean' },
    'enable-tooltip': { control: 'boolean' },
    'tooltip-always-visible': { control: 'boolean' },
    gap: { control: 'number' },
    max: { control: 'number' },
    min: { control: 'number' },
    name: { control: 'text' },
    step: { control: 'number' },
    type: { control: 'inline-radio', options: ['single', 'range'] },
    value: { control: 'object' },
  },
  args: {
    'debounce-time': 0,
    disabled: false,
    'enable-value-indicator': false,
    'enable-tooltip': false,
    'tooltip-always-visible': false,
    gap: 0,
    max: 100,
    min: 0,
    name: 'bq-slider',
    step: 1,
    type: 'single',
    value: undefined,
    // Events
    bqBlur: fn(),
    bqChange: fn(),
    bqFocus: fn(),
  },
};
export default meta;

type Story = StoryObj;

const Template = (args: Args) => html`
  <style>
    .bq-story-slider {
      inline-size: calc(100vw - var(--bq-spacing-xxl3));
      max-width: 768px;
    }
  </style>
  <div class="bq-story-slider">${SliderTemplate(args)}</div>
`;

const SliderTemplate = (args: Args) => html`
  <bq-slider
    debounce-time=${ifDefined(args['debounce-time'])}
    ?disabled=${args.disabled}
    ?enable-value-indicator=${args['enable-value-indicator']}
    ?enable-tooltip=${args['enable-tooltip']}
    ?tooltip-always-visible=${args['tooltip-always-visible']}
    gap=${ifDefined(args.gap)}
    max=${ifDefined(args.max)}
    min=${ifDefined(args.min)}
    name=${ifDefined(args.name)}
    step=${ifDefined(args.step)}
    type=${ifDefined(args.type)}
    value=${ifDefined(JSON.stringify(args.value))}
    @bqBlur=${args.bqBlur}
    @bqChange=${args.bqChange}
    @bqFocus=${args.bqFocus}
  >
    ${args.text}
  </bq-slider>
`;

export const Default: Story = {
  render: Template,
  parameters: {
    layout: 'centered',
  },
  args: {
    value: 30,
  },
};

export const Range: Story = {
  render: Template,
  parameters: {
    layout: 'centered',
  },
  args: {
    value: [30, 70],
    type: 'range',
  },
};

export const Disabled: Story = {
  render: Template,
  parameters: {
    layout: 'centered',
  },
  args: {
    disabled: true,
    value: [30, 70],
    type: 'range',
  },
};

export const ValueIndicator: Story = {
  render: Template,
  parameters: {
    layout: 'centered',
  },
  args: {
    'enable-value-indicator': true,
    value: [30, 70],
    type: 'range',
  },
};

export const MinMaxStep: Story = {
  name: 'Min, Max, Step',
  render: Template,
  parameters: {
    layout: 'centered',
  },
  args: {
    'enable-value-indicator': true,
    max: 10,
    min: 0,
    step: 1.25,
    value: 3,
  },
};

export const Gap: Story = {
  render: Template,
  parameters: {
    layout: 'centered',
  },
  args: {
    'enable-value-indicator': true,
    gap: 10,
    max: 100,
    min: 0,
    step: 5,
    type: 'range',
    value: [30, 70],
  },
};

export const DecimalValues: Story = {
  render: Template,
  parameters: {
    layout: 'centered',
  },
  args: {
    'enable-value-indicator': true,
    max: 1,
    min: 0,
    type: 'range',
    step: 0.05,
    value: [0.3, 0.7],
  },
};

export const WithTooltip: Story = {
  render: Template,
  parameters: {
    layout: 'centered',
  },
  args: {
    'enable-tooltip': true,
    gap: 10,
    max: 100,
    min: 0,
    step: 1,
    type: 'range',
    value: [30, 70],
  },
};

export const WithForm: Story = {
  render: (args: Args) => {
    const handleFormSubmit = (ev: Event) => {
      ev.preventDefault();
      const form = ev.target as HTMLFormElement;
      const formData = new FormData(form);
      const formValues = Object.fromEntries(formData.entries());

      const codeElement = document.getElementById('form-data');
      if (!codeElement) return;

      codeElement.textContent = JSON.stringify(formValues, null, 2);
    };

    return html`
      <style>
        .bq-story-slider-form {
          display: grid;
          grid-auto-columns: auto;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          row-gap: var(--bq-spacing-l);
        }
        @media (min-width: 640px) {
          .bq-story-slider-form {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: var(--bq-spacing-l);
          }
        }
        .bq-story-slider-form__fields::part(wrapper) {
          background-color: var(--bq-background--primary);
        }
        .bq-story-slider-form h4 {
          margin-block-end: var(--bq-spacing-m);
        }
        .bq-story-slider-form form {
          display: flex;
          flex-direction: column;
          row-gap: var(--bq-spacing-m);
        }
        .bq-story-slider-form label {
          display: flex;
          align-items: center;
          column-gap: var(--bq-spacing-s);
        }
        .bq-story-slider-form__range-label {
          margin-block-start: var(--bq-spacing-m);
        }
        .bq-story-slider-form__actions {
          display: flex;
          justify-content: flex-end;
          column-gap: var(--bq-spacing-s);
          margin-block-start: var(--bq-spacing-l);
        }
        .bq-story-slider-form__data::part(wrapper) {
          height: 100%;
        }
        .bq-story-slider-form__snippet {
          overflow-x: scroll;
          white-space: pre;
          border-radius: var(--bq-radius--s);
        }
        .bq-story-slider-form code {
          border-radius: var(--bq-radius--s);
        }
      </style>
      <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.10.0/styles/night-owl.min.css" />
      <div class="bq-story-slider-form">
        <bq-card class="bq-story-slider-form__fields">
          <h4>Taxi information</h4>
          <form @submit=${handleFormSubmit}>
            <label> Number of seats </label>
            ${SliderTemplate({ ...args, name: 'numSeats', max: 8, value: 3 })}
            <!-- Range  -->
            <label class="bq-story-slider-form__range-label"> Price range (€) </label>
            ${SliderTemplate({ ...args, name: 'priceRange', value: [30, 70], type: 'range' })}
            <div class="bq-story-slider-form__actions">
              <bq-button appearance="secondary" type="reset">Cancel</bq-button>
              <bq-button type="submit">Save</bq-button>
            </div>
          </form>
        </bq-card>
        <bq-card class="bq-story-slider-form__data">
          <h4>Form Data</h4>
          <div class="language-javascript bq-story-slider-form__snippet">
            // Handle form submit<br />
            const form = ev.target as HTMLFormElement;<br />
            const formData = new FormData(form);<br />
            const formValues = Object.fromEntries(formData.entries());
          </div>
          <pre>
            <code id="form-data">
              { // submit the form to see the data here }
            </code>
          </pre>
        </bq-card>
      </div>

      <script type="module">
        import hljs from 'https://unpkg.com/@highlightjs/cdn-assets@11.10.0/es/highlight.min.js';
        import javascript from 'https://unpkg.com/@highlightjs/cdn-assets@11.10.0/es/languages/javascript.min.js';

        hljs.registerLanguage('javascript', javascript);
        hljs.highlightAll();

        document.querySelectorAll('div.language-javascript').forEach((block) => {
          hljs.highlightElement(block);
        });
      </script>
    `;
  },
  args: {
    'enable-value-indicator': true,
    max: 100,
    min: 0,
    step: 1,
  },
};
