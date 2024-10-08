'use client';

import React, { useState } from 'react'
import { 
    Dialog, 
    DialogTrigger, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription 
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Plus } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation';

const CreateNote = () => {
    const [input, setInput] = useState('')
    const router = useRouter();

    const uploadToFirebase = useMutation({
        mutationFn: async (noteId: string) => {
            const response = await axios.post('/api/uploadFirebase', {
                noteId: noteId
            })
            return response.data
        },
    })

    const createNoteBook = useMutation({
        mutationFn: async () => {
            const response = await axios.post('/api/createNoteBook', { 
                name: input 
            })
            return response.data
        }
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if(input === '') {
            window.alert('Please enter a name for your note book')
        }
        createNoteBook.mutate(undefined, {
            onSuccess: ({ note_id }) => {
                console.log('Notebook created', { note_id })
                uploadToFirebase.mutate(note_id)
                router.push(`/notebook/${note_id}`)
            },
            onError: (error) => {
                console.log('Error creating notebook:', error)
                window.alert('Error creating notebook')
            }
        })
    }
  return (
    <Dialog>
      <DialogTrigger>
        <div className="border-dashed border-2 flex border-green-600 h-full rounded-lg items-center justify-center sm:flex-col hover:shadow-xl transition hover:-translate-y-1 flex-row p-4">
          <Plus className="w-6 h-6 text-green-600" strokeWidth={3} />
          <h2 className="font-semibold text-green-600 sm:mt-2">
            New Note Book
          </h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Note Book</DialogTitle>
          <DialogDescription>
            You can create a new note by clicking the button below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
            placeholder="Name..."
          />
          <div className="h-4"></div>
          <div className="flex items-center gap-2">
            <Button type="reset" variant={"secondary"}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600"
              disabled={createNoteBook.isPending}
            >
              {createNoteBook.isPending && (
                <Loader2 className='w-4 h-4 mr-2 animate-spin' />
              )}
              Create
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateNote