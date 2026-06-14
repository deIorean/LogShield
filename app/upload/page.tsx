import React from 'react';
import { Upload, FileText, CheckCircle } from 'lucide-react';

export default function UploadPage() {
  return (
    <div className="p-8 bg-[#0a0a0a] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-2">Upload Loggg</h1>
      <p className="text-gray-400 mb-8">Select ae from your computer to analyze for threats.</p>

      {/* The Upload Card */}
      <div className="max-w-2xl border-2 border-dashed border-gray-800 rounded-xl p-12 flex flex-col items-center justify-center bg-[#111] hover:border-blue-500 transition-colors cursor-pointer">
        <div className="bg-blue-500/10 p-4 rounded-full mb-4">
          <Upload className="w-10 h-10 text-blue-500" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Click to upload or drag and drop</h2>
        <p className="text-sm text-gray-500 mb-6">Support for .txt, .csv, or .log files (Max 50MB)</p>
        
        {/* Hidden standard input, styled button */}
        <input type="file" id="log-upload" className="hidden" />
        <label 
          htmlFor="log-upload" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition-all"
        >
          Select File from PC
        </label>
      </div>

      {/* Helpful Instructions */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-[#111] rounded-lg border border-gray-800">
          <h3 className="font-bold flex items-center gap-2 mb-2 text-blue-400">
            <CheckCircle size={18} /> Accepted Formats
          </h3>
          <p className="text-sm text-gray-400">Ensure your logs are in standard Apache, Nginx, or Syslog format for the AI to read them correctly.</p>
        </div>
      </div>
    </div>
  );
}