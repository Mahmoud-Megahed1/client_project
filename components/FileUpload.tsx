import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon, FileUploadIcon, CheckCircleIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const handleFileSelection = useCallback((file: File | undefined | null) => {
    if (!file || isLoading || selectedFile) return;

    setSelectedFile(file);
    setTimeout(() => {
        onFileSelect(file);
    }, 1500); // 1.5s delay for visual confirmation
  }, [isLoading, onFileSelect, selectedFile]);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading || selectedFile) return;
    setIsDragging(true);
  }, [isLoading, selectedFile]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading || selectedFile) return;
    setIsDragging(false);
  }, [isLoading, selectedFile]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLoading || selectedFile) return;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  }, [handleFileSelection, isLoading, selectedFile]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200">
      <div 
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full p-8 transition-all duration-300 border-2 border-dashed rounded-xl ${
          selectedFile 
            ? 'border-green-400 bg-green-50' 
            : isDragging 
            ? 'border-violet-400 bg-violet-50' 
            : 'border-gray-300'
        }`}
      >
        {selectedFile ? (
            <div className="flex flex-col items-center justify-center text-center">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4"/>
                <p className="text-base font-medium text-gray-800">{t('fileAdded')}</p>
                <p className="mt-1 text-sm text-gray-600 truncate max-w-[250px] sm:max-w-xs" title={selectedFile.name}>{selectedFile.name}</p>
            </div>
        ) : (
          <>
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-violet-100 rounded-full">
                <FileUploadIcon className="w-8 h-8 text-violet-600" />
            </div>
            <p className="mb-2 text-base font-medium text-gray-700">
              {t('dropzoneHint')}
            </p>
            <p className="mb-4 text-sm text-gray-500">{t('or')}</p>
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="application/pdf,image/jpeg,image/png,application/vnd.openxmlformats-officedocument.presentationml.presentation"
              disabled={isLoading || !!selectedFile}
            />
            <button 
              onClick={handleButtonClick}
              disabled={isLoading || !!selectedFile}
              className="flex items-center gap-2 px-6 py-3 font-semibold text-white transition-all duration-300 bg-violet-600 rounded-lg hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              <UploadIcon className="w-5 h-5" />
              {t('chooseFile')}
            </button>
            <p className="mt-4 text-xs text-gray-400">{t('fileTypes')}</p>
          </>
        )}
      </div>
    </div>
  );
};