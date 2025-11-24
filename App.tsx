import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AppState, GenerationResult } from './types';
import { generateSlidesAndSummary } from './services/aiClient';
import { FileUpload } from './components/FileUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { 
    LockIcon, 
    BoltIcon, 
    GraduationCapIcon,
    GlobeIcon,
    ChevronDownIcon,
    ChatBubbleIcon,
    CheckCircleIcon,
    DatabaseIcon,
    AtomIcon
} from './components/icons';
import { useLanguage, Language } from './contexts/LanguageContext';

const Header: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        setDropdownOpen(false);
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <img src="images/noqra-logo.png" alt="Nodqra Logo" className="w-8 h-8 object-contain" />
                    <h1 className="text-2xl font-bold text-violet-600">Nodqra</h1>
                </div>
                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-300 px-3 py-1.5 rounded-lg"
                    >
                        <GlobeIcon className="w-5 h-5" />
                        <span>{language.toUpperCase()}</span>
                        <ChevronDownIcon className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isDropdownOpen && (
                        <div className="absolute top-full end-0 mt-2 w-36 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <button onClick={() => handleLanguageChange('fr')} className="w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Français</button>
                            <button onClick={() => handleLanguageChange('en')} className="w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">English</button>
                            <button onClick={() => handleLanguageChange('ar')} className="w-full text-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">العربية</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};


const Hero: React.FC<{ onFileSelect: (file: File) => void; isLoading: boolean; }> = ({ onFileSelect, isLoading }) => {
    const { t } = useLanguage();
    return (
        <section className="text-center py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
                {t('heroTitle')} <br className="hidden md:block"/>
                <span className="bg-gradient-to-r from-teal-400 to-violet-500 bg-clip-text text-transparent">
                    {t('heroSubtitle')}
                </span>
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
                {t('heroDescription')}
            </p>
            <div className="mt-10">
                <FileUpload onFileSelect={onFileSelect} isLoading={isLoading} />
            </div>
            <div className="mt-8 flex justify-center items-center space-x-4 md:space-x-8 text-sm text-gray-500 rtl:space-x-reverse">
                <div className="flex items-center">
                    <LockIcon className="w-4 h-4 me-1.5 text-gray-400" />
                    <span>{t('secure')}</span>
                </div>
                <div className="flex items-center">
                    <BoltIcon className="w-4 h-4 me-1.5 text-gray-400" />
                    <span>{t('instant')}</span>
                </div>
                <div className="flex items-center">
                    <GraduationCapIcon className="w-4 h-4 me-1.5 text-gray-400" />
                    <span>{t('university')}</span>
                </div>
            </div>
        </section>
    );
};

const Features: React.FC = () => {
    const { t } = useLanguage();
    const featureItems = [
        { icon: <ChatBubbleIcon className="w-7 h-7 text-blue-500"/>, name: t('feature1Title'), description: t('feature1Desc') },
        { icon: <CheckCircleIcon className="w-7 h-7 text-green-500"/>, name: t('feature2Title'), description: t('feature2Desc') },
        { icon: <BoltIcon className="w-7 h-7 text-yellow-500"/>, name: t('feature3Title'), description: t('feature3Desc') },
        { icon: <DatabaseIcon className="w-7 h-7 text-violet-500"/>, name: t('feature4Title'), description: t('feature4Desc') },
        { icon: <AtomIcon className="w-7 h-7 text-pink-500"/>, name: t('feature5Title'), description: t('feature5Desc') }
    ];

    return (
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/70 border-t border-gray-200">
            <div className="max-w-5xl mx-auto">
                <div className="text-center">
                    <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900">{t('whyNodqra')}</h3>
                    <p className="mt-4 max-w-2xl mx-auto text-md text-gray-600">
                        {t('whyNodqraDesc')}
                    </p>
                </div>
                <div className="mt-16 grid gap-8 md:grid-cols-2">
                    {featureItems.map((item, index) => (
                        <div key={index} className="p-6 bg-white rounded-xl shadow-md border border-gray-200 flex items-start gap-4">
                            <div className="flex-shrink-0">{item.icon}</div>
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};


const Footer: React.FC = () => {
    const { t } = useLanguage();
    return (
        <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
                 <div className="flex items-center gap-2">
                     <div className="flex items-center gap-2">
                        <img src="images/noqra-logo.png" alt="Nodqra Logo" className="w-6 h-6 object-contain" />
                        <h3 className="font-bold text-violet-600">Nodqra</h3>
                     </div>
                     <p>&copy; 2025</p>
                </div>
                <div className="flex space-x-6 mt-4 sm:mt-0 rtl:space-x-reverse">
                    <a href="#" className="hover:text-gray-800 transition-colors">{t('privacy')}</a>
                    <a href="#" className="hover:text-gray-800 transition-colors">{t('terms')}</a>
                    <a href="#" className="hover:text-gray-800 transition-colors">{t('contact')}</a>
                </div>
            </div>
        </footer>
    );
};

const ProcessingOverlay: React.FC<{fileName: string}> = ({fileName}) => {
    const { t } = useLanguage();
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 text-center px-4">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-xl text-gray-800">{t('processingTitle')}</p>
          <p className="mt-2 text-gray-500">{t('processingDesc')} <span className="font-medium text-gray-700">{fileName}</span></p>
        </div>
    );
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const { t } = useLanguage();

  const handleFileSelect = useCallback(async (file: File) => {
    setCurrentFile(file);
    setAppState(AppState.PROCESSING);
    setError(null);
    try {
      const generationResult = await generateSlidesAndSummary(file);
      setResult(generationResult);
      setAppState(AppState.SUCCESS);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setAppState(AppState.ERROR);
    }
  }, []);
  
  const handleReset = useCallback(() => {
    setAppState(AppState.IDLE);
    setResult(null);
    setError(null);
    setCurrentFile(null);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {appState === AppState.PROCESSING && currentFile && <ProcessingOverlay fileName={currentFile.name}/>}
      <Header />
      <main className="flex-grow">
        {appState === AppState.IDLE || appState === AppState.ERROR ? (
          <>
            {/* FIX: The `isLoading` prop is set to `false` because the `Hero` component is only rendered when the app state is `IDLE` or `ERROR`, not `PROCESSING`. This resolves the impossible comparison error. */}
            <Hero onFileSelect={handleFileSelect} isLoading={false} />
             {error && (
              <div className="max-w-lg mx-auto -mt-8 mb-8 p-4 bg-red-100 border border-red-300 text-red-800 rounded-lg text-center">
                <p className="font-semibold">{t('errorTitle')}</p>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </>
        ) : null}
        
        {appState === AppState.SUCCESS && result && (
          <ResultsDisplay result={result} onReset={handleReset} />
        )}
      </main>
      
      {(appState === AppState.IDLE || appState === AppState.ERROR) && <Features />}
      <Footer />
    </div>
  );
};

export default App;