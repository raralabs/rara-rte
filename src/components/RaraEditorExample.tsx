import * as React from 'react';
import { useState } from 'react';
import { MentionItemProps } from '../types';
// Import the Slate editor factory.
import RaraEditor from './RaraEditor/RaraEditor';

export const searchMockedCharacter = async (
  query: string = '',
  maxResult: number = 10
) => {
  //To mock sleep for 1 second
  await new Promise(resolve => setTimeout(resolve, 1000));

  const chars = CHARACTERS.filter((c: string) =>
    c.toLowerCase().includes(query.toLowerCase())
  ).slice(0, maxResult);
  return chars;
};

const CHARACTERS = [
  'Aayla Secura',
  'Adi Gallia',
  'Quiggold',
  'Quinlan Vos',
  'R2-D2',
  'R2-KT',
  'R3-S6',
  'R4-P17',
  'R5-D4',
  'RA-7',
  'Rabé',
  'Rako Hardeen',
  'Ransolm Casterfo',
  'Rappertunie',
  'Ratts Tyerell',
  'Raymus Antilles',
  'Ree-Yees',
  'Reeve Panzoro',
  'Rey',
  'Ric Olié',
  'Riff Tamson',
  'Riley',
  'Rinnriyin Di',
  'Rio Durant',
  'Rogue Squadron',
  'Romba',
  'Roos Tarpals',
  'Rose Tico',
  'Rotta the Hutt',
  'Rukh',
  'Rune Haako',
  'Rush Clovis',
  'Ruwee Naberrie',
  'Ryoo Naberrie',
  'Sabé',
  'Sabine Wren',
  'Saché',
  'Saelt-Marae',
  'Saesee Tiin',
  'Salacious B. Crumb',
  'San Hill',
  'Sana Starros',
  'Sarco Plank',
  'Sarkli',
  'Satine Kryze',
  'Savage Opress',
  'Sebulba',
  'Senator Organa',
  'Sergeant Kreel',
  'Seventh Sister',
  'Shaak Ti',
  'Shara Bey',
  'Shmi Skywalker',
  'Shu Mai',
  'Sidon Ithano',
  'Sifo-Dyas',
  'Sim Aloo',
  'Siniir Rath Velus',
  'Sio Bibble',
  'Sixth Brother',
  'Slowen Lo',
  'Sly Moore',
  'Snaggletooth',
  'Snap Wexley',
  'Snoke',
  'Sola Naberrie',
  'Sora Bulq',
  'Strono Tuggs',
  'Sy Snootles',
  'Tallissan Lintra',
  'Tarfful',
  'Tasu Leech',
  'Taun We',
  'TC-14',
  'Tee Watt Kaa',
  'Teebo',
  'Teedo',
  'Teemto Pagalies',
  'Temiri Blagg',
  'Tessek',
  'Tey How',
  'Thane Kyrell',
  'The Bendu',
  'The Smuggler',
  'Thrawn',
  'Tiaan Jerjerrod',
  'Tion Medon',
  'Tobias Beckett',
  'Tulon Voidgazer',
  'Tup',
  'U9-C4',
  'Unkar Plutt',
  'Val Beckett',
  'Vanden Willard',
  'Vice Admiral Amilyn Holdo',
  'Vober Dand',
  'WAC-47',
  'Wag Too',
  'Wald',
  'Walrus Man',
  'Warok',
  'Wat Tambor',
  'Watto',
  'Wedge Antilles',
  'Wes Janson',
  'Wicket W. Warrick',
  'Wilhuff Tarkin',
  'Wollivan',
  'Wuher',
  'Wullf Yularen',
  'Xamuel Lennox',
  'Yaddle',
  'Yarael Poof',
  'Yoda',
  'Zam Wesell',
  'Zev Senesca',
  'Ziro the Hutt',
  'Zuckuss',
];
const CONTACT = [
  9898775635,
  9898725635,
  9898795635,
  9834775635,
  9865775635,
  9875775635,
  9898775635,
  9878775635,
  9898775635,
  9898775635,
  9812775635,
  9898775635,
  9867775635,
  9898775635,
  9879775635,
  9898775635,
  9887775635,
];
const RaraEditorExample = () => {
  const [editorData, setEditorData] = useState(
    ''
  );

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 60,
      }}
    >
      <RaraEditor
        onMentionContact={e => console.log('Contact Mentions', e)}
        onMentionUser={e => console.log('User Mentions', e)}
        value={editorData}
        onCheckboxChange={(checked, value) => {
          console.log('Checkbox Toggled', checked, value);
        }}
        onMentionListChange={mentiondItems => {
          console.log('Mentioned Item Changed', mentiondItems);
        }}
        onChange={val => {
          console.log('VALUE', val);
          // console.log('DESERIALIZED', JSON.parse(val));
          // console.log('SERIALIZED', serializeSlateData(JSON.parse(val)));
          setEditorData(val);
        }}
        onMentionQuery={CHARACTERS?.map((i, index) => {
          return {
            label: i,
            id: i,
            metaData: {
              name: i,
              index: index,
            },
          };
        })}
        onMentionContactQuery={CONTACT?.map((i, index) => {
          return {
            label: i,
            id: i,
            metaData: {
              name: i,
              index: index,
            },
          };
        })}
        mentionContactOptionRenderer={(mentionOptionItem: MentionItemProps) => {
          console.log(mentionOptionItem.metaData?.index);
          return (
            <div
              style={{
                // fontSize: 20,
                fontWeight: 'bold',
                color:
                  (mentionOptionItem.metaData?.index as number) % 2 == 0
                    ? 'red'
                    : 'green',
              }}
            >
              {mentionOptionItem.label}
            </div>
          );
        }}
        mentionOptionRenderer={(mentionOptionItem: MentionItemProps) => {
          // console.log(mentionOptionItem.metaData?.index)
          return (
            <div
              style={{
                // fontSize: 20,
                fontWeight: 'bold',
                color:
                  (mentionOptionItem.metaData?.index as number) % 2 == 0
                    ? 'red'
                    : 'green',
              }}
            >
              {mentionOptionItem.label} {mentionOptionItem.metaData?.index}
            </div>
          );
        }}
        // mentionContactItemRenderer={(mentionItem: MentionItemProps) => {
        //   return (
        //     <p
        //       style={{
        //         margin: 0,
        //         color: mentionItem.metaData?.index % 2 == 0 ? 'red' : 'green',
        //         // display:'flex',
        //         // gap:10,
        //         // fontSize:'inherit'
        //       }}
        //     >
        //       <span data-slate-string="true">{mentionItem.label}</span>
        //     </p>
        //   );
        // }}
        // mentionItemRenderer={(mentionItem: MentionItemProps) => {
        //   return (
        //     <p
        //       style={{
        //         margin: 0,
        //         color: mentionItem.metaData?.index % 2 == 0 ? 'red' : 'green',
        //         // display:'flex',
        //         // gap:10,
        //         // fontSize:'inherit'
        //       }}
        //     >
        //       <img
        //         src="https://www.w3schools.com/w3images/mac.jpg"
        //         style={{
        //           height: 10,
        //           width: 10,
        //           borderRadius: '50%',
        //           marginRight: 10,
        //         }}
        //       />

        //       <span data-slate-string="true">{mentionItem.label}</span>
        //     </p>
        //   );
        // }}
        // mentionDetailRenderer={(mentionItem: MentionItemProps) => {
        //   return (
        //     <p
        //       style={{
        //         margin: 0,
        //         color: mentionItem.metaData?.index % 2 == 0 ? 'red' : 'green',
        //       }}
        //     >
        //       <span data-slate-string="true">{mentionItem.label}</span>
        //     </p>
        //   );
        // }}
        mentionContactDetailRenderer={(mentionItem: MentionItemProps) => {
          return (
            <p
              style={{
                margin: 0,
                color:
                  (mentionItem.metaData?.index as number) % 2 == 0
                    ? 'red'
                    : 'green',
              }}
            >
              <img
                src="https://www.w3schools.com/w3images/mac.jpg"
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: '50%',
                  marginRight: 10,
                }}
              />
              <span data-slate-string="true">{mentionItem.label}</span>
            </p>
          );
        }}
      />
      <RaraEditor
        readOnly={true}
        key={editorData}
        value={editorData}
        onCheckboxChange={(checked, value) => {
          console.log('Checkbox Toggled', checked, value);
        }}
        onMentionListChange={mentiondItems => {
          console.log('Mentioned Item Changed', mentiondItems);
        }}
        onChange={val => {
          // console.log('VALUE', val);
          // console.log('DESERIALIZED', JSON.parse(val));
          // console.log('SERIALIZED', serializeSlateData(JSON.parse(val)));
          setEditorData(val);
        }}
        isMentionLoading={true}
        onMentionQuery={CHARACTERS?.map((i, index) => {
          return {
            label: i,
            id: i,
            metaData: {
              name: i,
              index: index,
            },
          };
        })}
        mentionOptionRenderer={(mentionOptionItem: MentionItemProps) => {
          return (
            <div
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color:
                  (mentionOptionItem.metaData?.index as number) % 2 == 0
                    ? 'red'
                    : 'green',
              }}
            >
              {mentionOptionItem.label} {mentionOptionItem.metaData?.index}
            </div>
          );
        }}
        mentionItemRenderer={(mentionItem: MentionItemProps) => {
          return (
            <p
              style={{
                margin: 0,
                color:
                  (mentionItem.metaData?.index as number) % 2 == 0
                    ? 'red'
                    : 'green',
                // display:'flex',
                // gap:10,
                // fontSize:'inherit'
              }}
            >
              <img
                src="https://www.w3schools.com/w3images/mac.jpg"
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: '50%',
                  marginRight: 10,
                }}
              />

              <span data-slate-string="true">{mentionItem.label}</span>
            </p>
          );
        }}
      />
    </div>
  );
};
RaraEditorExample.defaultName = 'RaraEditorExample';

export default RaraEditorExample;
