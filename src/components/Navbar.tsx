"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  return (
    <header className="bg-white border-b border-gray-200 relative">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-lg font-semibold text-gray-800">
            Book Catalog
          </Link>
        </div>
      </div>
      
      <div className="absolute top-2 right-4 flex items-center space-x-3">
        <Link 
          href="/" 
          className="text-sm text-gray-600 hover:text-gray-800 px-2 py-1"
        >
          Home
        </Link>
        
        {session?.user ? (
          <>
            <span className="text-sm text-gray-600">
              {session.user.name || session.user.email?.split('@')[0] || 'User'}
            </span>
            <button 
              onClick={() => signOut()} 
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link 
            href="/auth/signin" 
            className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
}


