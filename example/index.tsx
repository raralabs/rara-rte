import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import { RaraEditor } from '../.';
import { RaraEditor } from '../dist/index';
import { searchMockedCharacter } from './Mock/SearchMocker';
import { MentionItemProps } from '../dist/index';

const App = () => {

  const [editorData, setEditorData] = React.useState('[{"type":"paragraph","children":[{"text":""}]}]');

  return <RaraEditor
    value={editorData}
    onCheckboxChange={(checked, value) => {
      console.log("Checkbox Toggled", checked, value);
    }}
    onMentionListChange={(mentiondItems) => {
      console.log("Mentioned Item Changed", mentiondItems);
    }}
    onChange={(val) => {
      setEditorData(val);
    }}
    isMentionLoading={true}
    onMentionQuery={async (query: string) => {
      let chars = await searchMockedCharacter(query)
      let results = chars.map((i, index) => {
        return {
          "label": i,
          "id": i,
          metaData: {
            name: i,
            index: index
          }
        }
      })
      return results;
    }}
    mentionOptionRenderer={(mentionOptionItem: MentionItemProps) => {
      // console.log(mentionOptionItem.metaData?.index)
      return <div style={{
        fontSize: 20,
        fontWeight: 'bold',
        color: (mentionOptionItem.metaData?.index % 2) == 0 ? 'red' : 'green'
      }}>{mentionOptionItem.label} {mentionOptionItem.metaData?.index}</div>
    }}
    mentionItemRenderer={(mentionItem: MentionItemProps) => {

      return <p style={{
        margin: 0,
        color: (mentionItem.metaData?.index % 2) == 0 ? 'red' : 'green'
        // display:'flex',
        // gap:10,
        // fontSize:'inherit'
      }}>
        <img src='https://www.w3schools.com/w3images/mac.jpg' style={{
          height: 10,
          width: 10,
          borderRadius: '50%',
          marginRight: 10

        }} />

        <span data-slate-string='true'>
          {mentionItem.label}
        </span>

      </p>
    }}
  />;

};

ReactDOM.render(<App />, document.getElementById('root'));
