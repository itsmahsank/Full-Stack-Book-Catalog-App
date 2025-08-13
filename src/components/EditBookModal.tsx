"use client";

import { useState, useEffect } from "react";

// Book data structure
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
}

// Props for the edit modal component
interface EditBookModalProps {
  book: Book | null;                // Book to edit (null if modal is closed)
  isOpen: boolean;                  // Whether modal is open or closed
  onClose: () => void;              // Function to close the modal
  onSave: (book: Book) => void;     // Function to save the edited book
}

// Modal component for editing book details
export default function EditBookModal({ book, isOpen, onClose, onSave }: EditBookModalProps) {
  // Form state variables
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form fields when book changes
  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setGenre(book.genre);
      setError(null);
    }
  }, [book]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    // Clear any previous errors
    setError(null);

    // Validate that all fields are filled
    if (!title || !author || !genre) {
      setError("All fields are required");
      return;
    }

    // Start loading state
    setLoading(true);

    try {
      // Send PUT request to update the book
      const res = await fetch(`/api/books/${book.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, genre }),
      });

      if (!res.ok) throw new Error("Failed to update book");

      // Call the onSave function with updated book data
      onSave({ ...book, title, author, genre });
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Don't render anything if modal is closed or no book is selected
  if (!isOpen || !book) return null;

  return (
    // Modal overlay - dark background that covers the entire screen
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal content */}
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Edit Book</h2>
          {/* Close button */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Book Title Field */}
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
          
          {/* Author Field */}
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
          
          {/* Genre Field */}
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Form Buttons */}
          <div className="flex gap-3 pt-4">
            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            
            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
