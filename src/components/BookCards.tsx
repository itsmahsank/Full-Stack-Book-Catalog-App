"use client";

import { useState, useEffect } from "react";

// Book data structure
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
}

// Props for the card component
interface BookCardsProps {
  books: Book[];                    // List of books to display
  selectedBooks: string[];          // IDs of currently selected books
  onSelectionChange: (bookId: string, selected: boolean) => void;  // Handle checkbox changes
  onEdit: (book: Book) => void;    // Handle edit button click
  onDelete: (bookId: string) => void;  // Handle delete button click
}

// Card view component - shows books in a card layout
export default function BookCards({ books, selectedBooks, onSelectionChange, onEdit, onDelete }: BookCardsProps) {
  // Track which dropdown is currently open
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Function to open/close dropdown for a specific book
  const toggleDropdown = (bookId: string) => {
    if (openDropdown === bookId) {
      setOpenDropdown(null);  // Close if already open
    } else {
      setOpenDropdown(bookId);  // Open this dropdown
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      // Check if click is outside the dropdown container
      if (openDropdown && !target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    // Add event listener when component mounts
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up event listener when component unmounts
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Map through each book and create a card */}
      {books.map((book) => (
        <div key={book.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 relative">
          
          {/* Top row: Checkbox and Action Menu */}
          <div className="flex items-start justify-between mb-3">
            {/* Book Selection Checkbox */}
            <input
              type="checkbox"
              checked={selectedBooks.includes(book.id)}
              onChange={(e) => onSelectionChange(book.id, e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />

            {/* Action Menu Container */}
            <div className="relative dropdown-container">
              {/* Three-dot menu button */}
              <button
                onClick={() => toggleDropdown(book.id)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {openDropdown === book.id && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();  // Prevent event bubbling
                      onEdit(book);
                      setOpenDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();  // Prevent event bubbling
                      onDelete(book.id);
                      setOpenDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Book Title */}
          <h3 className="font-semibold text-gray-800 mb-2">{book.title}</h3>
          
          {/* Book Author */}
          <p className="text-gray-600 text-sm mb-2">By {book.author}</p>
          
          {/* Book Genre */}
          <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
            {book.genre}
          </span>
        </div>
      ))}
    </div>
  );
}
