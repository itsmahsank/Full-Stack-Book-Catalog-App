import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// PUT endpoint to update an existing book
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the book ID from the URL parameters
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
    }

    // Ensure user owns the book (if ownership is tracked)
    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    if (existing.ownerId && existing.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get the request body (updated book data)
    const body = await request.json();
    const { title, author, genre } = body;

    // Check if all required fields are provided
    if (!title || !author || !genre) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Update the book in the database
    const updatedBook = await prisma.book.update({
      where: { id },
      data: { title, author, genre },
    });

    // Return the updated book
    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}

// DELETE endpoint to remove a book
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the book ID from the URL parameters
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
    }

    // Ensure user owns the book (if ownership is tracked)
    const existing = await prisma.book.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    if (existing.ownerId && existing.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete the book from the database
    await prisma.book.delete({ where: { id } });
    
    // Return success message
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting book:", error);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}


