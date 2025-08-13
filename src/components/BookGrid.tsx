"use client";

import { useState, useEffect } from "react";

// Book data structure
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
}

// Props for the grid component
interface BookGridProps {
  books: Book[];                    // List of books to display
  selectedBooks: string[];          // IDs of currently selected books
  onSelectionChange: (bookId: string, selected: boolean) => void;  // Handle checkbox changes
  onEdit: (book: Book) => void;    // Handle edit button click
  onDelete: (bookId: string) => void;  // Handle delete button click
}

// Grid view component - shows books in a table format
export default function BookGrid({ books, selectedBooks, onSelectionChange, onEdit, onDelete }: BookGridProps) {
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
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {/* Select All Checkbox */}
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedBooks.length === books.length && books.length > 0}
                  onChange={(e) => {
                    // Select/deselect all books
                    books.forEach(book => {
                      onSelectionChange(book.id, e.target.checked);
                    });
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Book Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Author Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Genre</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {books.map((book) => (
              <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                {/* Individual Book Checkbox */}
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedBooks.includes(book.id)}
                    onChange={(e) => onSelectionChange(book.id, e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </td>

                {/* Book Title */}
                <td className="px-4 py-3 text-sm text-gray-900">{book.title}</td>

                {/* Book Author */}
                <td className="px-4 py-3 text-sm text-gray-600">{book.author}</td>

                {/* Book Genre */}
                <td className="px-4 py-3">
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                    {book.genre}
                  </span>
                </td>

                {/* Action Menu */}
                <td className="px-4 py-3">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
