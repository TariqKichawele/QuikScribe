import { db } from "@/lib/db";
import { $notes } from "@/lib/db/schema";
import { uploadFile } from "@/lib/firebase";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { noteId } = await req.json();

        const notes = await db
            .select()
            .from($notes)
            .where(eq($notes.id, parseInt(noteId)))

        if(!notes[0].imageUrl) {
            return new NextResponse('No image found', { status: 404 })
        }

        const firebase_url = await uploadFile(
            notes[0].imageUrl,
            notes[0].name
        )

        if(!firebase_url) {
            return new NextResponse('Failed to upload image', { status: 500 })
        }

        await db.update($notes).set({ imageUrl: firebase_url }).where(eq($notes.id, parseInt(noteId)))

        return new NextResponse('Success', { status: 200 })
        
    } catch (error) {
        console.error(error)
        return new NextResponse('Failed to upload image', { status: 500 })
    }
}