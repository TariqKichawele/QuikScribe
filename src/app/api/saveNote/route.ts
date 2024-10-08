/* eslint-disable prefer-const */
import { $notes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { noteId, editorState } = body;
        if(!noteId || !editorState) {
            return new NextResponse('Note id and editor state are required', { status: 400 });
        }

        noteId = parseInt(noteId);
        const notes = await db.select().from($notes).where(eq($notes.id, noteId));
        if(notes.length === 0) {
            return new NextResponse('Failed to update note', { status: 500 });
        }

        const note = notes[0];
        if(note.editorState !== editorState) {
            await db.update($notes).set({ editorState }).where(eq($notes.id, noteId));
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return new NextResponse('Failed to update note', { status: 500 });
    }

}