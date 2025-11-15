import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GenerationResult } from '../types';
import { ArrowLeftIcon, ArrowRightIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';

interface ResultsDisplayProps {
  result: GenerationResult;
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLanguage();
  const activeSlideRef = useRef<HTMLButtonElement>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % result.slides.length);
  }, [result.slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + result.slides.length) % result.slides.length);
  }, [result.slides.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextSlide, prevSlide]);

  // Scroll active mini-slide into view
  useEffect(() => {
    activeSlideRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  }, [currentSlide]);

  const slide = result.slides[currentSlide];

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{t('resultsTitle')}</h2>
        <p className="mt-4 text-lg text-gray-500">{t('resultsSubtitle')}</p>
      </div>

      {/* Slides Carousel */}
      <div className="relative mb-12 bg-white shadow-xl rounded-2xl p-8 min-h-[500px] flex flex-col justify-between border border-gray-200">
        <div className="flex-grow">
          <h3 className="text-2xl font-bold text-violet-600 mb-4">{slide.title}</h3>
          <ul className="space-y-3 list-disc list-inside text-gray-700">
            {slide.content.map((point, index) => (
              <li key={index} className="text-lg leading-relaxed">{point}</li>
            ))}
          </ul>
        </div>
        
        <div className="mt-auto pt-6">
           {/* Detailed Mini Slides Indicator */}
           <div className="custom-scrollbar overflow-x-auto -mx-2 px-2 pb-4">
            <div className="inline-flex items-center gap-3 whitespace-nowrap">
              {result.slides.map((s, index) => (
                <button
                  key={index}
                  ref={currentSlide === index ? activeSlideRef : null}
                  onClick={() => setCurrentSlide(index)}
                  className={`flex-shrink-0 w-44 p-3 text-left border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 ${
                    currentSlide === index 
                      ? 'bg-violet-100 border-violet-500 shadow-md scale-105' 
                      : 'bg-white border-gray-300 hover:border-violet-400 hover:bg-violet-50'
                  }`}
                  aria-label={`Go to slide ${index + 1}: ${s.title}`}
                  aria-current={currentSlide === index}
                >
                  <span className="text-xs font-medium text-gray-500">{t('slide')} {index + 1}</span>
                  <p className="mt-1 text-sm font-semibold text-gray-800 truncate" title={s.title}>
                    {s.title}
                  </p>
                </button>
              ))}
            </div>
           </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button onClick={prevSlide} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors">
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <span className="text-sm font-medium text-gray-500">
              {t('slide')} {currentSlide + 1} / {result.slides.length}
            </span>
            <button onClick={nextSlide} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors">
              <ArrowRightIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200">
        <h3 className="text-2xl font-bold text-violet-600 mb-4">{t('summaryTitle')}</h3>
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {result.summary}
        </p>
      </div>

      <div className="text-center mt-12">
        <button
          onClick={onReset}
          className="px-8 py-3 font-semibold text-white transition-all duration-300 bg-violet-600 rounded-lg hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          {t('resetButton')}
        </button>
      </div>
    </div>
  );
};