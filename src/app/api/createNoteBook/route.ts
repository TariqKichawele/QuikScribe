import { db } from "@/lib/db";
import { generateImage, generateImagePrompt } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { $notes } from "@/lib/db/schema";

export const runtime = "edge";

export async function POST(req: Request) {
    const { userId } = auth();

    if(!userId) {
        return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json();
    const { name } = body;

    const image_description = await generateImagePrompt(name);
    if(!image_description) {
        return new NextResponse('Failed to generate image description', { status: 500 })
    }

    const imageUrl = await generateImage(image_description);
    if(!imageUrl) {
        return new NextResponse('Failed to generate image', { status: 500 })
    }

    const note_ids = await db
        .insert($notes)
        .values({
            name,
            imageUrl,
            userId,
        })
        .returning({
            insertedId: $notes.id,
        })

    return NextResponse.json({
        note_id: note_ids[0].insertedId,
    }, { status: 200 })
}