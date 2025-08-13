import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET() {
	const books = await prisma.book.findMany({
		orderBy: { createdAt: "desc" },
	});
	return NextResponse.json(books);
}

export async function POST(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session || !session.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body = await request.json();
	const { title, author, genre } = body ?? {};
	if (!title || !author || !genre) {
		return NextResponse.json({ error: "Missing fields" }, { status: 400 });
	}
	const book = await prisma.book.create({
		data: {
			title,
			author,
			genre,
			ownerId: session.user.id,
		},
	});
	return NextResponse.json(book, { status: 201 });
}


