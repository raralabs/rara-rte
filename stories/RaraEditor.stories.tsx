import React from 'react';
import { Meta, Story } from '@storybook/react';
import { RaraEditor } from '../src';

import  RaraEditorExample from '../src/components/RaraEditorExample';

const meta: Meta = {
  title: 'Welcome',
  component: RaraEditor,
  argTypes: {
    value:{
      type:'string'
    }
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

const Template: Story<{}> = args => <div>
  <RaraEditorExample {...args} />
  {/* <RaraEditor {...args} readOnly onCheckboxChange={(checked,value)=>{
    console.log("Checkbox changed trigger",checked,value);
  }} /> */}
</div>;

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

Default.args = {};
