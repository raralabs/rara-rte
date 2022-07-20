// Import the `Node` helper interface from Slate.
import { Descendant, Node } from 'slate'
import { jsx } from 'slate-hyperscript'

// Define a serializing function that takes a value and returns a string.
export const serializeSlateData = (value: Descendant[]) => {
  return (
    value
      // Return the string content of each paragraph in the value's children.
      .map((n: any) => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join('\n')
  )
}

// Define a deserializing function that takes a string and returns a value.
export const deserializeSlateData = (string: any) => {
  // Return a value array of children derived by splitting the string.
  return string.split('\n').map((line: any) => {
    return {
      children: [{ text: line }],
    }
  })
}

const ELEMENT_TAGS:{ [index: string]: any }= {
  A: (el:HTMLElement) => ({ type: 'link', url: el.getAttribute('href') }),
  BLOCKQUOTE: () => ({ type: 'quote' }),
  H1: () => ({ type: 'heading-one' }),
  H2: () => ({ type: 'heading-two' }),
  H3: () => ({ type: 'heading-three' }),
  H4: () => ({ type: 'heading-four' }),
  H5: () => ({ type: 'heading-five' }),
  H6: () => ({ type: 'heading-six' }),
  IMG: (el:HTMLElement) => ({ type: 'image', url: el.getAttribute('src') }),
  LI: () => ({ type: 'list-item' }),
  OL: () => ({ type: 'numbered-list' }),
  P: () => ({ type: 'paragraph' }),
  PRE: () => ({ type: 'code' }),
  UL: () => ({ type: 'bulleted-list' }),
}

// COMPAT: `B` is omitted here because Google Docs uses `<b>` in weird ways.
const TEXT_TAGS :{ [index: string]: any }= {
  CODE: () => ({ code: true }),
  DEL: () => ({ strikethrough: true }),
  EM: () => ({ italic: true }),
  I: () => ({ italic: true }),
  S: () => ({ strikethrough: true }),
  STRONG: () => ({ bold: true }),
  U: () => ({ underline: true }),
}

export const deserializeHTMLData = (el: HTMLElement) => {
  if (el.nodeType === 3) {
    return el.textContent
  } else if (el.nodeType !== 1) {
    return null
  } else if (el.nodeName === 'BR') {
    return '\n'
  }

  const { nodeName } = el
  let parent = el

  if (
    nodeName === 'PRE' &&
    el.childNodes[0] &&
    el.childNodes[0].nodeName === 'CODE'
  ) {
    parent = el.childNodes[0] as HTMLElement;
  }
  let children:any[] = Array.from(parent.childNodes)
    .map((e)=>deserializeHTMLData(e as HTMLElement))
    .flat()

  if (children.length === 0) {
    children = [{ text: '' }]
  }

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children)
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el)
    return jsx('element', attrs, children)
  }

  if (TEXT_TAGS[nodeName]) {
    const attrs = TEXT_TAGS[nodeName](el)
    return children.map(child => jsx('text', attrs, child))
  }

  return children
}

