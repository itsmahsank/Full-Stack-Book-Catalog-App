"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
}

export default function BookCard({ book }: { book: Book }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this book?")) {
      setIsDeleting(true);
      try {
        const res = await fetch(`/api/books/${book.id}`, {
          method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete book");
        router.refresh();
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Failed to delete book");
      } finally {
        setIsDeleting(false);
      }
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded p-4 hover:shadow-md">
      <h3 className="font-semibold text-gray-800 mb-2">{book.title}</h3>
      <p className="text-gray-600 text-sm mb-2">By {book.author}</p>
      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mb-3">
        {book.genre}
      </span>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-800 text-sm underline"
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
