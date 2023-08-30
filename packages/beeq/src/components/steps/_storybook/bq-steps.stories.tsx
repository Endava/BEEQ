import { html } from 'lit-html';
import mdx from './bq-steps.mdx';
import { STEPS_SIZE, STEPS_TYPE } from '../bq-steps.types';

export default {
  title: 'Components/Steps',
  component: 'bq-steps',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    text: { control: 'text', table: { disable: true } },
    type: { control: 'select', options: [...STEPS_TYPE] },
    size: { control: 'select', options: [...STEPS_SIZE] },
  },
  args: {
    text: 'text',
  },
};

const Template = (args) => {
  return html` <bq-steps type=${args.type} class="p-2" size=${args.size}>
    <!-- in JS, add event listener, asa lucrez cu events aici -->
    <!-- icon mosteneste de la parinte culoarea, ma bazez pe asta -->
    <!-- proprietate status -->
    <bq-step-item status="default" value="x">
      <!-- slot pt prefix -->
      <!-- attr trb sa fie "slot" cand vreau nume, name doar in componenta -->
      <!-- ordinea nu conteaza -->
      <bq-icon slot="prefix" name="bell-ringing" size="24" weight="regular"></bq-icon>

      <!-- numar sau iconita sau ce vreau ca user -->
      <!-- componenta sa ofere partea de numeric type -->
      <!-- un singur slot pt titlu si descriere -->
      <span>step item 1</span>
      <span slot="description">description for step</span>
    </bq-step-item>
    <bq-step-item status="disabled" value="xy">
      <!-- slot pt prefix -->
      <!-- attr trb sa fie "slot" cand vreau nume, name doar in componenta -->
      <!-- ordinea nu conteaza -->
      <bq-icon slot="prefix" name="bell-ringing" size="24" weight="regular"></bq-icon>
      <!-- un singur slot pt titlu si descriere -->
      <span>step item 2 with longerlongerlongerlongerlonger title</span>
      <span slot="description">description for step</span>
    </bq-step-item>
    <bq-step-item status="completed" value="xyz">
      <bq-icon slot="prefix" name="factory" size="24" weight="regular"></bq-icon>
      <span>title</span>
      <span slot="description">description for step 3</span>
    </bq-step-item>
  </bq-steps>`;
};

export const Default = (args) => Template(args);
