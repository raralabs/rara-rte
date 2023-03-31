# TODO

 - [x] Color Text
 - [x] Bold
 - [x] Italic
 - [x] Underline
 - [x] Strikethrough
 - [x] Quote
 - [x] Heading (1,2...5)
 - [x] Code
 - [x] Checklist
 - [x] Copy from html
 - [ ] Text Align
 - [ ] Mention
 - [ ] Ordered List
 - [ ] Unordered List
 - [ ] Nested List
 - [ ] Indent (Increase, Decrease)

# How To Use

Demo Link: https://codesandbox.io/s/example-rara-rte-dumskc

1. Install @raralabs/rara-rte 

   `npm i @raralabs/rara-rte`
 
2. Import component and style and use it in your code

    ```javascript
    import {RaraEditor} from '@raralabs/rara-rte';

    import '@raralabs/rara-rte/dist/rara-rte.css'
    import { useState } from 'react';
    export default function App() {
      const [value,setValue]=useState(null)
      return (
        <div className="">
          <h1>Rara Rich Text Editor</h1>
          <RaraEditor
          value={value}
          onChange={(v)=>{
            setValue(v);
          }}
          />
        </div>
      );
    }
    ```


# Props
| Name  | Description  |  Default |
|---|---|---|
| value  |  `string` |  - |
| onChange  | `((val: string) => void)`  |  - |
| readOnly  | `boolean`  |  false |
| onCheckboxChange | `((checked: boolean, value: string) => void)`  |  - |
| onMentionQuery  | `((query: string) => Promise<MentionItemProps[]>)`  |  - |
| mentionItemRenderer  | `((mentionOptionItem: MentionItemProps) => ReactNode)`  |  - |
| mentionOptionRenderer  | `((mentionOptionItem: MentionItemProps) => ReactNode)`  |  - |


# License
RTE is [MIT Licensed](./LICENSE)
