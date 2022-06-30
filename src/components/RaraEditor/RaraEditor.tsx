import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Editable, withReact, ReactEditor, Slate, useSlateStatic, useReadOnly, RenderElementProps } from 'slate-react'
import {
    createEditor,

    Editor,
    Transforms,
    Element as SlateElement,
    Range,

} from 'slate'

import { withHistory } from 'slate-history';
import { BaseEditor } from 'slate'
import { HistoryEditor } from 'slate-history'
import { CustomElement, CustomTextElement, RaraEditorType, RaraEditorProps, MentionItemProps } from '../../types';
import { serializeSlateData } from '../../utils/serializer';
import { Toolbar } from '../Toolbar';
import { insertMention, isBlockActive, toggleBlock, toggleMark, withInlines, withMentions } from '../../lib/functions';
import { Element, ElementProps, Leaf, LeafProps } from '../Elements';


import './styles.css';
import { onKeyDown } from '../../lib/handlers';
import { Portal } from '../../lib/Portal';

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']


declare module 'slate' {
    interface CustomTypes {
        Editor: RaraEditorType
        Element: CustomElement
        Text: CustomTextElement
    }
}


const RaraEditor = (props: RaraEditorProps) => {
    const { readOnly = false, onCheckboxChange, onChange, isMentionLoading, mentionOptionRenderer, onMentionQuery,mentionItemRenderer } = props;
    const ref = useRef<HTMLDivElement | null>()// useRef<React.LegacyRef<HTMLDivElement>>
    const [target, setTarget] = useState<Range | null>()
    const [index, setIndex] = useState(0)
    // const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState<MentionItemProps[]>([]);
    const [isSearching, setIsSearching] = useState(true);

    const renderElement = useCallback((props: ElementProps) => <Element {...props}
        onCheckboxChange={onCheckboxChange}
        isMentionLoading={isMentionLoading}
        onMentionQuery={onMentionQuery}
        mentionItemRenderer={mentionItemRenderer}


    />, [])
    const renderLeaf = useCallback((props: LeafProps) => <Leaf {...props} />, [])

    const initialValue = useMemo(
        () => {
            try {
                const valueArray = JSON.parse(props.value ?? '[{"type":"paragraph","children":[{"text":""}]}]');
                return valueArray;
            } catch (e) {
                console.error("Unparsable value provided", props.value);
                return [
                    {
                        type: 'paragraph',
                        children: [{ text: '' }],
                    },
                ]
            }
        }
        ,
        []
    )

    const editor = useMemo(() => withMentions(withInlines(withHistory(withReact(createEditor())))), [])

    // const chars = CHARACTERS.filter((c: string) =>
    //     c.toLowerCase().startsWith(search.toLowerCase())
    // ).slice(0, 10)
    // console.log("filtered chars", chars, target);

    const onKeyDown = useCallback(
        (event: any) => {
            if (target) {
                switch (event.key) {
                    case 'ArrowDown':
                        event.preventDefault()
                        const prevIndex = index >= searchResults.length - 1 ? 0 : index + 1
                        setIndex(prevIndex)
                        break
                    case 'ArrowUp':
                        event.preventDefault()
                        const nextIndex = index <= 0 ? searchResults.length - 1 : index - 1
                        setIndex(nextIndex)
                        break
                    case 'Tab':
                    case 'Enter':
                        event.preventDefault()
                        Transforms.select(editor, target)
                        insertMention(editor, searchResults[index]);
                        setTarget(null)
                        setSearchResults([]);
                        break
                    case 'Escape':
                        event.preventDefault()
                        setTarget(null)
                        setSearchResults([])
                        setIsSearching(false);
                        break
                }
            }
        },
        [index, JSON.stringify(searchResults), target]
    )

    useEffect(() => {
        if (target && searchResults.length > 0) {
            const el = ref.current
            if (el) {
                const domRange = ReactEditor.toDOMRange(editor, target)
                const rect = domRange.getBoundingClientRect()
                el.style.top = `${rect.top + window.pageYOffset + 24}px`
                el.style.left = `${rect.left + window.pageXOffset}px`
            }
        }
    }, [editor, index, JSON.stringify(searchResults), target])

    return <div className='rte-editor'>
        <Slate

            onChange={async (change) => {
                //TO check if the values are changed or not
                const isAstChange = editor.operations.some(
                    op => 'set_selection' !== op.type
                )
                const { selection } = editor

                if (selection && Range.isCollapsed(selection)) {
                    const [start] = Range.edges(selection)
                    const wordBefore = Editor.before(editor, start, { unit: 'word' })
                    const before = wordBefore && Editor.before(editor, wordBefore)
                    const beforeRange = before && Editor.range(editor, before, start)
                    const beforeText = beforeRange && Editor.string(editor, beforeRange)
                    const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/)
                    const after = Editor.after(editor, start)
                    const afterRange = Editor.range(editor, start, after)
                    const afterText = Editor.string(editor, afterRange)
                    const afterMatch = afterText.match(/^(\s|$)/)
                    console.log("BMA",beforeMatch,afterMatch);

                    if (beforeMatch && afterMatch) {
                        console.log("Matching");
                        setTarget(beforeRange)
                        setIsSearching(true);
                        if (onMentionQuery) {
                            let results = await onMentionQuery(beforeMatch[1]);
                            console.log("GOT result", results);
                            setSearchResults(results);
                            
                        }
                        setIsSearching(false);

                        // setSearch(beforeMatch[1])
                        setIndex(0)
                        return
                    }else if(searchResults.length>0){
                        setSearchResults([]);
                        setIsSearching(false);
                    }
                }

                setTarget(null)

                if (isAstChange) {
                    // Save the value to Local Storage.
                    onChange && onChange(JSON.stringify(change));
                }
            }}
            editor={editor} value={initialValue} >
            {!readOnly && <Toolbar
                items={
                    [
                        // <BlockButton key={'numbered'} format="numbered-list" label="format_list_numbered" />,
                        // <BlockButton key={'bulleted'} format="bulleted-list" label="format_list_bulleted" />,
                        // <BlockButton key={'left'} format="left" label="format_align_left" />,
                        // <BlockButton key={'center'} format="center" label="format_align_center" />,
                        // <BlockButton key={'right'} format="right" label="format_align_right" />,
                        // <BlockButton key={'justify'} format="justify" label="format_align_justify" />
                    ]}
            />
            }
            {target && (searchResults.length > 0 || isSearching) && (
                <Portal>
                    {isSearching ? <div style={{
                        top: '-9999px',
                        left: '-9999px',
                        position: 'absolute',
                        zIndex: 1,
                        padding: '3px',
                        background: 'white',
                        borderRadius: '4px',
                        boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                    }}>
                        Loading...
                    </div> :
                        <div
                            ref={ref}
                            style={{
                                top: '-9999px',
                                left: '-9999px',
                                position: 'absolute',
                                zIndex: 1,
                                padding: '3px',
                                background: 'white',
                                borderRadius: '4px',
                                boxShadow: '0 1px 5px rgba(0,0,0,.2)',
                            }}
                            data-cy="mentions-portal"
                        >
                            {searchResults.map((searchResultItem, i) => (
                                <div
                                    key={"searchResultItem" + i}
                                    style={{
                                        padding: '1px 3px',
                                        borderRadius: '3px',
                                        background: i === index ? '#B4D5FF' : 'transparent',
                                    }}
                                >
                                    {mentionOptionRenderer != null ?
                                        mentionOptionRenderer(searchResultItem) :
                                        searchResultItem.label}
                                </div>
                            ))}
                        </div>
                    }
                </Portal>
            )}
            <Editable
                renderElement={(p: RenderElementProps) => {
                    return renderElement(p);
                }}
                className='rte-editor-body'
                renderLeaf={renderLeaf}
                placeholder="Placeholder"
                readOnly={readOnly}
                onKeyDown={onKeyDown}
            // onKeyDown={(e) => {

            //     onKeyDown(e, editor, target);
            // }}
            />
        </Slate>
    </div>


}







const checkListAndRemoveIfExist = (editor: BaseEditor & ReactEditor & HistoryEditor) => {
    LIST_TYPES.map((format: any) => {
        const isActive = isBlockActive(
            editor,
            format,
        )
        if (isActive) {
            Transforms.unwrapNodes(editor, {
                match: n =>
                    !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    n.type != null &&
                    LIST_TYPES.includes(n.type) &&
                    // n.type == 'paragraph' &&
                    !TEXT_ALIGN_TYPES.includes(format),
                split: true,
            });
            const block: CustomElement = { type: 'paragraph', children: [] }
            Transforms.wrapNodes(editor, block)
        }

    });

    return;
    LIST_TYPES.map((format: any) => {
        const isActive = isBlockActive(
            editor,
            format,
        )
        console.log("Is active", format, isActive);
        const isList = true;

        Transforms.unwrapNodes(editor, {
            match: n =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                n.type != null &&
                LIST_TYPES.includes(n.type) &&
                // n.type == 'paragraph' &&
                !TEXT_ALIGN_TYPES.includes(format),
            split: true,
        })
        let newProperties: Partial<SlateElement>
        if (TEXT_ALIGN_TYPES.includes(format)) {
            newProperties = {
                align: isActive ? undefined : format,
            }
        } else {
            newProperties = {
                type: isActive ? 'paragraph' : isList ? 'list-item' : format,
            }
        }
        Transforms.setNodes<SlateElement>(editor, newProperties)

        // if (!isActive && isList) {
        //     const block: CustomElement = { type: format, children: [] }
        //     Transforms.wrapNodes(editor, block)
        // }

    })
}



RaraEditor.displayName = "RaraEditor";

export default RaraEditor;


const CHARACTERS = [
    'Aayla Secura',
    'Adi Gallia',
    'Admiral Dodd Rancit',
    'Admiral Firmus Piett',
    'Admiral Gial Ackbar',
    'Admiral Ozzel',
    'Admiral Raddus',
    'Admiral Terrinald Screed',
    'Admiral Trench',
    'Admiral U.O. Statura',
    'Agen Kolar',
    'Agent Kallus',
    'Aiolin and Morit Astarte',
    'Aks Moe',
    'Almec',
    'Alton Kastle',
    'Amee',
    'AP-5',
    'Armitage Hux',
    'Artoo',
    'Arvel Crynyd',
    'Asajj Ventress',
    'Aurra Sing',
    'AZI-3',
    'Bala-Tik',
    'Barada',
    'Bargwill Tomder',
    'Baron Papanoida',
    'Barriss Offee',
    'Baze Malbus',
    'Bazine Netal',
    'BB-8',
    'BB-9E',
    'Ben Quadinaros',
    'Berch Teller',
    'Beru Lars',
    'Bib Fortuna',
    'Biggs Darklighter',
    'Black Krrsantan',
    'Bo-Katan Kryze',
    'Boba Fett',
    'Bobbajo',
    'Bodhi Rook',
    'Borvo the Hutt',
    'Boss Nass',
    'Bossk',
    'Breha Antilles-Organa',
    'Bren Derlin',
    'Brendol Hux',
    'BT-1',
    'C-3PO',
    'C1-10P',
    'Cad Bane',
    'Caluan Ematt',
    'Captain Gregor',
    'Captain Phasma',
    'Captain Quarsh Panaka',
    'Captain Rex',
    'Carlist Rieekan',
    'Casca Panzoro',
    'Cassian Andor',
    'Cassio Tagge',
    'Cham Syndulla',
    'Che Amanwe Papanoida',
    'Chewbacca',
    'Chi Eekway Papanoida',
    'Chief Chirpa',
    'Chirrut Îmwe',
    'Ciena Ree',
    'Cin Drallig',
    'Clegg Holdfast',
    'Cliegg Lars',
    'Coleman Kcaj',
    'Coleman Trebor',
    'Colonel Kaplan',
    'Commander Bly',
    'Commander Cody (CC-2224)',
    'Commander Fil (CC-3714)',
    'Commander Fox',
    'Commander Gree',
    'Commander Jet',
    'Commander Wolffe',
    'Conan Antonio Motti',
    'Conder Kyl',
    'Constable Zuvio',
    'Cordé',
    'Cpatain Typho',
    'Crix Madine',
    'Cut Lawquane',
    'Dak Ralter',
    'Dapp',
    'Darth Bane',
    'Darth Maul',
    'Darth Tyranus',
    'Daultay Dofine',
    'Del Meeko',
    'Delian Mors',
    'Dengar',
    'Depa Billaba',
    'Derek Klivian',
    'Dexter Jettster',
    'Dineé Ellberger',
    'DJ',
    'Doctor Aphra',
    'Doctor Evazan',
    'Dogma',
    'Dormé',
    'Dr. Cylo',
    'Droidbait',
    'Droopy McCool',
    'Dryden Vos',
    'Dud Bolt',
    'Ebe E. Endocott',
    'Echuu Shen-Jon',
    'Eeth Koth',
    'Eighth Brother',
    'Eirtaé',
    'Eli Vanto',
    'Ellé',
    'Ello Asty',
    'Embo',
    'Eneb Ray',
    'Enfys Nest',
    'EV-9D9',
    'Evaan Verlaine',
    'Even Piell',
    'Ezra Bridger',
    'Faro Argyus',
    'Feral',
    'Fifth Brother',
    'Finis Valorum',
    'Finn',
    'Fives',
    'FN-1824',
    'FN-2003',
    'Fodesinbeed Annodue',
    'Fulcrum',
    'FX-7',
    'GA-97',
    'Galen Erso',
    'Gallius Rax',
    'Garazeb "Zeb" Orrelios',
    'Gardulla the Hutt',
    'Garrick Versio',
    'Garven Dreis',
    'Gavyn Sykes',
    'Gideon Hask',
    'Gizor Dellso',
    'Gonk droid',
    'Grand Inquisitor',
    'Greeata Jendowanian',
    'Greedo',
    'Greer Sonnel',
    'Grievous',
    'Grummgar',
    'Gungi',
    'Hammerhead',
    'Han Solo',
    'Harter Kalonia',
    'Has Obbit',
    'Hera Syndulla',
    'Hevy',
    'Hondo Ohnaka',
    'Huyang',
    'Iden Versio',
    'IG-88',
    'Ima-Gun Di',
    'Inquisitors',
    'Inspector Thanoth',
    'Jabba',
    'Jacen Syndulla',
    'Jan Dodonna',
    'Jango Fett',
    'Janus Greejatus',
    'Jar Jar Binks',
    'Jas Emari',
    'Jaxxon',
    'Jek Tono Porkins',
    'Jeremoch Colton',
    'Jira',
    'Jobal Naberrie',
    'Jocasta Nu',
    'Joclad Danva',
    'Joh Yowza',
    'Jom Barell',
    'Joph Seastriker',
    'Jova Tarkin',
    'Jubnuk',
    'Jyn Erso',
    'K-2SO',
    'Kanan Jarrus',
    'Karbin',
    'Karina the Great',
    'Kes Dameron',
    'Ketsu Onyo',
    'Ki-Adi-Mundi',
    'King Katuunko',
    'Kit Fisto',
    'Kitster Banai',
    'Klaatu',
    'Klik-Klak',
    'Korr Sella',
    'Kylo Ren',
    'L3-37',
    'Lama Su',
    'Lando Calrissian',
    'Lanever Villecham',
    'Leia Organa',
    'Letta Turmond',
    'Lieutenant Kaydel Ko Connix',
    'Lieutenant Thire',
    'Lobot',
    'Logray',
    'Lok Durd',
    'Longo Two-Guns',
    'Lor San Tekka',
    'Lorth Needa',
    'Lott Dod',
    'Luke Skywalker',
    'Lumat',
    'Luminara Unduli',
    'Lux Bonteri',
    'Lyn Me',
    'Lyra Erso',
    'Mace Windu',
    'Malakili',
    'Mama the Hutt',
    'Mars Guo',
    'Mas Amedda',
    'Mawhonic',
    'Max Rebo',
    'Maximilian Veers',
    'Maz Kanata',
    'ME-8D9',
    'Meena Tills',
    'Mercurial Swift',
    'Mina Bonteri',
    'Miraj Scintel',
    'Mister Bones',
    'Mod Terrik',
    'Moden Canady',
    'Mon Mothma',
    'Moradmin Bast',
    'Moralo Eval',
    'Morley',
    'Mother Talzin',
    'Nahdar Vebb',
    'Nahdonnis Praji',
    'Nien Nunb',
    'Niima the Hutt',
    'Nines',
    'Norra Wexley',
    'Nute Gunray',
    'Nuvo Vindi',
    'Obi-Wan Kenobi',
    'Odd Ball',
    'Ody Mandrell',
    'Omi',
    'Onaconda Farr',
    'Oola',
    'OOM-9',
    'Oppo Rancisis',
    'Orn Free Taa',
    'Oro Dassyne',
    'Orrimarko',
    'Osi Sobeck',
    'Owen Lars',
    'Pablo-Jill',
    'Padmé Amidala',
    'Pagetti Rook',
    'Paige Tico',
    'Paploo',
    'Petty Officer Thanisson',
    'Pharl McQuarrie',
    'Plo Koon',
    'Po Nudo',
    'Poe Dameron',
    'Poggle the Lesser',
    'Pong Krell',
    'Pooja Naberrie',
    'PZ-4CO',
    'Quarrie',
    'Quay Tolsite',
    'Queen Apailana',
    'Queen Jamillia',
    'Queen Neeyutnee',
    'Qui-Gon Jinn',
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
]