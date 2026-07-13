import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export const UploadCatalog = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setStatus('idle');
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Endpoint to CartAI-ProductWorker (Python FastAPI)
      await axios.post('http://localhost:8000/api/v1/catalogs/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setStatus('success');
      toast.success('Catalog uploaded successfully and queued for processing!');
      setFile(null);
    } catch (error) {
      console.error(error);
      setStatus('error');
      toast.error('Failed to upload the catalog. Check console for details.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all">
      <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Upload Raw Catalog</h2>
      <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">
        Drag and drop a PDF, image, or brochure to automatically extract products using Vision AI.
      </p>

      <div
        className={`relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl transition-all ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500'
        } ${status === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onFileChange}
          disabled={uploading}
          accept="application/pdf,image/*"
        />
        
        {status === 'success' ? (
          <>
            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
            <p className="text-lg font-medium text-green-700 dark:text-green-400">Successfully Queued!</p>
          </>
        ) : file ? (
          <>
            <FileText className="w-16 h-16 text-indigo-500 mb-4" />
            <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">{file.name}</p>
            <p className="text-sm text-zinc-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </>
        ) : (
          <>
            <UploadCloud className="w-16 h-16 text-zinc-400 mb-4" />
            <p className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
              Drag & Drop your file here
            </p>
            <p className="text-sm text-zinc-500 mt-2">or click to browse</p>
          </>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`px-6 py-3 rounded-lg font-medium text-white transition-all transform active:scale-95 ${
            !file || uploading 
              ? 'bg-zinc-300 dark:bg-zinc-700 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30'
          }`}
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading to Worker...
            </span>
          ) : (
            'Process Catalog'
          )}
        </button>
      </div>

      {status === 'error' && (
        <div className="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center gap-3 text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">Failed to communicate with CartAI Worker. Is it running on port 8000?</p>
        </div>
      )}
    </div>
  );
};
