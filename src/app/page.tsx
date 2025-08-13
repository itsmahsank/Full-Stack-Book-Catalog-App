"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ViewToggle from "@/components/ViewToggle";
import BookGrid from "@/components/BookGrid";
import BookCards from "@/components/BookCards";
import EditBookModal from "@/components/EditBookModal";
import { useSession, signIn } from "next-auth/react";

// Book data structure
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
}

// Main page component for the book catalog
export default function Home() {
  // State variables to manage the component
  const [books, setBooks] = useState<Book[]>([]);           // List of all books
  const [loading, setLoading] = useState(true);             // Loading state while fetching books
  const [view, setView] = useState<'grid' | 'card'>('card'); // Current view mode (grid or card)
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]); // IDs of selected books
  const [editingBook, setEditingBook] = useState<Book | null>(null); // Book being edited
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Whether edit modal is open
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10); // Show 10 books per page
  
  const { status, data: session } = useSession();
  const isAuthenticated = status === "authenticated";

  // Calculate pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  // Reset to first page when books change
  useEffect(() => {
    setCurrentPage(1);
  }, [books.length]);

  // Debug logging
  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
    console.log("Is authenticated:", isAuthenticated);
  }, [status, session, isAuthenticated]);

  // Fetch books when component first loads
  useEffect(() => {
    fetchBooks();
  }, []);

  // Function to get all books from the API
  async function fetchBooks() {
    try {
      console.log("Fetching books from API...");
      const res = await fetch('/api/books');
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      console.log("Fetched books:", data);
      console.log("Number of books fetched:", data.length);
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }

  // Handle checkbox selection changes
  const handleSelectionChange = (bookId: string, selected: boolean) => {
    if (selected) {
      // Add book to selected list
      setSelectedBooks(prev => [...prev, bookId]);
    } else {
      // Remove book from selected list
      setSelectedBooks(prev => prev.filter(id => id !== bookId));
    }
  };

  // Handle select all on current page
  const handleSelectAllOnPage = (selected: boolean) => {
    if (selected) {
      // Add all current page books to selection
      const currentPageBookIds = currentBooks.map(book => book.id);
      setSelectedBooks(prev => [...new Set([...prev, ...currentPageBookIds])]);
    } else {
      // Remove all current page books from selection
      const currentPageBookIds = currentBooks.map(book => book.id);
      setSelectedBooks(prev => prev.filter(id => !currentPageBookIds.includes(id)));
    }
  };

  // Handle bulk delete of selected books
  const handleBulkDelete = async () => {
    if (selectedBooks.length === 0) return;

    if (!isAuthenticated) {
      await signIn(undefined, { callbackUrl: '/' });
      return;
    }
    
    // Ask user to confirm deletion
    const confirmed = confirm(`Are you sure you want to delete ${selectedBooks.length} selected book(s)?`);
    if (!confirmed) return;

    try {
      // Delete each selected book one by one
      for (const bookId of selectedBooks) {
        const res = await fetch(`/api/books/${bookId}`, { method: "DELETE" });
        if (res.status === 401) {
          await signIn(undefined, { callbackUrl: '/' });
          return;
        }
      }
      
      // Clear selection and refresh book list
      setSelectedBooks([]);
      fetchBooks();
    } catch (error) {
      console.error("Error deleting books:", error);
      alert("Failed to delete some books");
    }
  };

  // Handle edit button click
  const handleEdit = (book: Book) => {
    if (!isAuthenticated) {
      signIn(undefined, { callbackUrl: '/' });
      return;
    }
    setEditingBook(book);
    setIsEditModalOpen(true);
  };

  // Handle save after editing
  const handleEditSave = (updatedBook: Book) => {
    // Update the book in the local state
    setBooks(prev => prev.map(book => 
      book.id === updatedBook.id ? updatedBook : book
    ));
    
    // Close the modal
    setEditingBook(null);
    setIsEditModalOpen(false);
  };

  // Handle closing the edit modal
  const handleEditClose = () => {
    setEditingBook(null);
    setIsEditModalOpen(false);
  };

  // Handle delete button click for individual books
  const handleDelete = async (bookId: string) => {
    if (!isAuthenticated) {
      await signIn(undefined, { callbackUrl: '/' });
      return;
    }

    console.log("Attempting to delete book:", bookId);
    console.log("Current books count:", books.length);

    // Ask user to confirm deletion
    const confirmed = confirm("Are you sure you want to delete this book?");
    if (!confirmed) return;

    try {
      // Send delete request to API
      const res = await fetch(`/api/books/${bookId}`, { method: "DELETE" });
      console.log("Delete response status:", res.status);
      
      if (res.status === 401) {
        await signIn(undefined, { callbackUrl: '/' });
        return;
      }
      if (!res.ok) throw new Error("Failed to delete book");
      
      console.log("Book deleted successfully, refreshing list...");
      
      // Clear any selected books that might include the deleted one
      setSelectedBooks(prev => prev.filter(id => id !== bookId));
      
      // Refresh the book list
      await fetchBooks();
      
      console.log("Books list refreshed, new count:", books.length);
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Failed to delete book");
    }
  };

  // Show loading message while fetching books
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Books</h1>
        <p className="text-gray-600 mb-4">A simple collection of my favorite books</p>
      </div>

      {/* Main Content */}
      {books.length > 0 ? (
        <div className="space-y-4">
          
          {/* Control Bar - View Toggle and Bulk Delete */}
          <div className="flex items-center justify-between">
            {/* Left side: Add Book button and Bulk Delete */}
            <div className="flex items-center space-x-4">
              {/* Add Book Button */}
              <Link 
                href={isAuthenticated ? "/add" : "/auth/signin?callbackUrl=%2Fadd"}
                onClick={() => {
                  if (!isAuthenticated) {
                    // Let the link handle redirect to signin with callback
                  }
                }}
                className={`inline-block px-4 py-2 rounded text-white ${isAuthenticated ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-indigo-400'}`}
              >
                Add Book
              </Link>
              
              {/* Bulk Delete Button - disabled when no selection or not authenticated */}
              <button
                onClick={handleBulkDelete}
                disabled={selectedBooks.length === 0 || !isAuthenticated}
                className={`px-4 py-2 rounded text-sm transition-colors ${
                  selectedBooks.length > 0 && isAuthenticated
                    ? 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Delete Selected ({selectedBooks.length})
              </button>
            </div>
            
            {/* Right side: View Toggle */}
            <ViewToggle view={view} onViewChange={setView} />
          </div>

          {/* Grid View */}
          <div className={`transition-all duration-300 ${view === 'grid' ? 'opacity-100' : 'opacity-0'}`}>
            {view === 'grid' && (
              <BookGrid
                books={currentBooks}
                selectedBooks={selectedBooks}
                onSelectionChange={handleSelectionChange}
                onSelectAllOnPage={handleSelectAllOnPage}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>

          {/* Card View */}
          <div className={`transition-all duration-300 ${view === 'card' ? 'opacity-100' : 'opacity-0'}`}>
            {view === 'card' && (
              <BookCards
                books={currentBooks}
                selectedBooks={selectedBooks}
                onSelectionChange={handleSelectionChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>

          {/* Pagination */}
          {books.length > booksPerPage && (
            <div className="flex items-center justify-between mt-6">
              {/* Pagination Info */}
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstBook + 1}-{Math.min(indexOfLastBook, books.length)} of {books.length} records
              </div>
              
              {/* Pagination Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm border rounded ${
                        currentPage === page
                          ? 'bg-indigo-500 text-white border-indigo-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State - when no books exist */
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No books added yet.</p>
          <Link 
            href={isAuthenticated ? "/add" : "/auth/signin?callbackUrl=%2Fadd"}
            className="text-indigo-500 hover:underline"
          >
            Add your first book
          </Link>
        </div>
      )}

      {/* Edit Book Modal */}
      <EditBookModal
        book={editingBook}
        isOpen={isEditModalOpen}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />
    </div>
  );
}
