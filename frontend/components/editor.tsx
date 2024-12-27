import { useRoom, useSelf } from '@liveblocks/react/suspense'
import React, { useEffect, useState } from 'react'
import * as Y from 'yjs'
import { LiveblocksYjsProvider } from '@liveblocks/yjs'
import { BlockNoteView } from '@blocknote/shadcn'
import { BlockNoteEditor } from '@blocknote/core'
import { useCreateBlockNote } from '@blocknote/react'
import "@blocknote/core/fonts/inter.css"
import "@blocknote/shadcn/style.css"
import TranslateDoc from './translateDoc'
import ChatToDocument from './chatToDocument'

type EditorProps = {
    doc: Y.Doc,
    provider: unknown
}

const stringToColour = (str: string) => {
    let hash = 0;
    str.split("").forEach((char) => {
      hash = char.charCodeAt(0) + ((hash << 5) - hash);
    });
    let colour = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      colour += value.toString(16).padStart(2, "0");
    }
    return colour;
};

function BlockNote({doc, provider}: EditorProps) {
    const userInfo = useSelf((me)=>me.info)
    const editor: BlockNoteEditor = useCreateBlockNote({
        collaboration: {
            provider,
            fragment: doc.getXmlFragment("document-store"),
            user: {
                name: userInfo?.name,
                color: stringToColour(userInfo.email)
            }
        }
    })
    return (
        <div className='relative max-w-6xl mx-auto'>
            <BlockNoteView 
                editor={editor}
                theme="light"
                className='min-h-screen'
            />
        </div>
  )
}

function Editor() {
    const room = useRoom()
    const [doc, setDoc] = useState<Y.Doc>()
    // const [darkMode, setDarkMode] = useState(false)
    const [provider, setProvider] = useState<LiveblocksYjsProvider>()
    useEffect(()=> {
        const yDoc = new Y.Doc()
        const yProvider = new LiveblocksYjsProvider(room, yDoc)
        setDoc(yDoc)
        setProvider(yProvider)

        return ()=> {
            yDoc?.destroy()
            yProvider?.destroy()
        }

    }, [room])

    if (!doc || !provider) {
        return null
    }

    return (
        <div className='max-w-6xl mx-auto'>
            <div className='flex items-center gap-2 justify-end mb-10'>
                <TranslateDoc doc={doc} />
                <ChatToDocument doc={doc} />
            </div>

            <BlockNote doc={doc} provider={provider} />
        </div>
    )
}

export default Editor