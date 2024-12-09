import React from 'react'
import { IconType } from 'react-icons';

function ErrorComponent({Icon, error}:{Icon: IconType, error: string}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
      <div className="text-center p-8 rounded-2xl bg-white shadow-2xl">
        <Icon className="text-red-500 text-6xl mx-auto mb-4" />
        <p className="text-red-600 text-xl font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
          Retry
        </button>
      </div>
    </div>
  );
}

export default ErrorComponent
