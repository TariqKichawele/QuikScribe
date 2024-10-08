'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TipTapMenuBar from './TipTapMenuBar'
import { Button } from '@/components/ui/button'
import useDebounce from '@/lib/useDebounce'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { NoteType } from '@/lib/db/schema'
import { Text } from '@tiptap/extension-text'
import { useCompletion } from 'ai/react'

type Props = {
    note: NoteType
}

const TipTapEditor = ({ note }: Props) => {
    const [ editorState, setEditorState ] = useState<string>(note.editorState || `<h1>${note.name}</h1>`);

    const { complete, completion} = useCompletion({
        api: '/api/completion',
    })

    const saveNote = useMutation({
        mutationFn: async () => {
            const response = await axios.post('/api/saveNote', {
                noteId: note.id,
                editorState
            })
            return response.data
        }
    })

    const customText = Text.extend({
        addKeyboardShortcuts() {
            return {
                'Shift-a': () => {
                    const prompt = this.editor.getText().split(' ').slice(-30).join(' ');
                    complete(prompt);
                    return true
                }
            }
        },
    });

    const editor = useEditor({
        autofocus: true,
        extensions: [StarterKit, customText],
        content: editorState,
        onUpdate: ({ editor }) => {
            setEditorState(editor.getHTML())
        },
        immediatelyRender: false,
    })

    const lastCompletion = useRef('')

    useEffect(() => {
        if(!completion || !editor) return;
        const diff = completion.slice(lastCompletion.current.length);
        lastCompletion.current = completion;
        editor.commands.insertContent(diff)
    }, [completion, editor])

    const debouncedEditorState = useDebounce(editorState, 500);

    useEffect(() => {
        if(debouncedEditorState === '') return;
        saveNote.mutate(undefined, {
            onSuccess: (data) => {
                console.log('Note saved', data)
            },
            onError: (error) => {
                console.log('Failed to save note', error)
            }
        }) 
    }, [debouncedEditorState])

  return (
   <>
    <div className='flex justify-between flex-col sm:flex-row gap-4'>
        {editor && <TipTapMenuBar editor={editor}/>}
        <Button disabled={saveNote.isPending} variant="outline">
            {saveNote.isPending ? 'Saving...' : 'Save'}
        </Button>
    </div>
    <div className='prose prose-sm w-full mt-4'>
        <EditorContent editor={editor} />
    </div>
    <div className='h-4'></div>
    <span className='text-sm'>
        Tip: Press{" "}
        <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg">
          Shift + A
        </kbd>{" "}
        for AI autocomplete
    </span>
   </>
  )
}

export default TipTapEditor