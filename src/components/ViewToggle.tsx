"use client";

// Props for the view toggle component
interface ViewToggleProps {
  view: 'grid' | 'card';  // Current view (either grid or card)
  onViewChange: (view: 'grid' | 'card') => void;  // Function to change view
}

// Simple toggle component to switch between grid and card views
export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      {/* Grid View Button */}
      <button
        onClick={() => onViewChange('grid')}
        className={`p-2 rounded-md transition-colors ${
          view === 'grid'
            ? 'bg-white text-indigo-600 shadow-sm'  // Active state
            : 'text-gray-600 hover:text-gray-800'   // Inactive state
        }`}
        title="Grid View"
      >
        {/* Grid icon - 4 squares */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>

      {/* Card View Button */}
      <button
        onClick={() => onViewChange('card')}
        className={`p-2 rounded-md transition-colors ${
          view === 'card'
            ? 'bg-white text-indigo-600 shadow-sm'  // Active state
            : 'text-gray-600 hover:text-gray-800'   // Inactive state
        }`}
        title="Card View"
      >
        {/* Card icon - document with lines */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </button>
    </div>
  );
}
