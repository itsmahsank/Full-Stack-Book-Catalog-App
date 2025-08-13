"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AddBookPage() {
  const router = useRouter();
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  useEffect(() => {
    console.log("Add page - Session status:", status);
    console.log("Add page - Session data:", session);
    console.log("Add page - Is authenticated:", isAuthenticated);
  }, [status, session, isAuthenticated]);

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Show message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-6">You need to sign in to add books.</p>
          <Link 
            href="/auth/signin?callbackUrl=%2Fadd" 
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!title || !author || !genre) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    try {
      console.log("Attempting to add book:", { title, author, genre });
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, genre }),
      });
      console.log("Add book response status:", res.status);
      const responseText = await res.text();
      console.log("Add book response:", responseText);
      if (!res.ok) throw new Error("Failed to add book");
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      console.error("Add book error:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Book</h1>
      
      <div className="bg-gray-50 border border-gray-200 rounded p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Title *
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author *
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre *
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-indigo-500"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="e.g. Fiction, Science Fiction, Mystery"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Book"}
            </button>
            
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}


