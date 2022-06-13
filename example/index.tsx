import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import { RaraEditor } from '../.';
import {RaraEditor} from '../src/components/RaraEditor';

const App = () => {
  const [v,onV]=React.useState("");
  return (
    <div>
      {/* <RaraEditor value='This is value'  /> */}
      <div>Hello</div>
      <RaraEditor value={v} 
      onChange={(v)=>{
        onV(v)
        }} />

    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
