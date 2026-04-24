'use client';

import React from 'react';
import { Button } from '@/library/ui/button';
/**
 * BackButton component for navigation
 * This is a client component to handle click events
 */
export function BackButton() {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={handleBack}
      className="mb-6 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded shadow-sm border border-gray-200 transition"
    >
      ← Back to Previous Page
    </button>
  );
}
