import React, { useState } from 'react';
import {
  FileJson, FileText, FileCode, FileType, CheckCircle2,
  AlertCircle, Loader2, Sparkles, RefreshCcw, Layout,
  Github, MessageSquare, HelpCircle, ExternalLink, Info
} from 'lucide-react';
import { Button } from './components/Button';
import { ExportFormat, ExtractResponse } from './types';
import { formatMarkdown, formatTxt, generatePdf, downloadFile } from './services/exportService';

declare const chrome: any;

const App: React.FC = () => {
  const [includeThinking, setIncludeThinking] = useState(true);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setStatus('LOADING');
    setErrorMessage('');

    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tab || !tab.id) {
        throw new Error('No active tab found.');
      }

      // Check if we are on AI Studio
      if (!tab.url?.includes('aistudio.google.com')) {
        throw new Error('Please open an AI Studio conversation.');
      }

      // Send message to content script
      const response = await new Promise<ExtractResponse>((resolve, reject) => {
        chrome.tabs.sendMessage(
          tab.id!,
          { type: 'EXTRACT_CHAT', includeThinking },
          (res: ExtractResponse) => {
            if (chrome.runtime?.lastError) {
              const msg = chrome.runtime.lastError.message;
              if (msg.includes('Could not establish connection')) {
                return reject(new Error('RELOAD_REQUIRED'));
              }
              return reject(new Error(msg));
            }
            resolve(res || { success: false, error: 'Empty response' });
          }
        );
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to extract chat data.');
      }

      const { data, title } = response;
      const rawTitle = title || 'export';
      const safeTitle = rawTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase().substring(0, 40) || 'export';

      switch (format) {
        case 'JSON':
          downloadFile(`${safeTitle}.json`, JSON.stringify(data, null, 2), 'application/json');
          break;
        case 'MARKDOWN':
          downloadFile(`${safeTitle}.md`, formatMarkdown(data, rawTitle, includeThinking), 'text/markdown');
          break;
        case 'TXT':
          downloadFile(`${safeTitle}.txt`, formatTxt(data, rawTitle, includeThinking), 'text/plain');
          break;
        case 'PDF':
          generatePdf(data, rawTitle, includeThinking);
          break;
      }

      setStatus('SUCCESS');
      setTimeout(() => setStatus('IDLE'), 3000);
    } catch (err: any) {
      console.error(err);
      setStatus('ERROR');
      if (err.message === 'RELOAD_REQUIRED') {
        setErrorMessage('Please reload AI Studio to activate exporter.');
      } else {
        setErrorMessage(err.message || 'An unexpected error occurred.');
      }
    }
  };

  const handleReload = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]: any) => {
      if (tab?.id) chrome.tabs.reload(tab.id);
    });
  };

  return (
    <div className="h-full bg-carbon flex flex-col p-6 animate-slide-up">
      {/* Premium Header */}
      <header className="mb-8 flex items-center justify-between">
        <div className="relative">
          <h1 className="text-2xl font-black tracking-tight text-white leading-none">
            AI <span className="text-white/40">Studio</span>
          </h1>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-[10px] text-white/30 font-bold tracking-[0.2em] uppercase">Obsidian Export</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
          <img src="/icons/icon48.png" alt="Logo" className="w-9 h-9 object-contain" />
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Toggle Section */}
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between group transition-all hover:bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Sparkles className={`w-4 h-4 transition-colors ${includeThinking ? 'text-yellow-400' : 'text-white/20'}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white/90">Include Reasoning</p>
              <p className="text-[10px] text-white/30">Extract 'Thinking' blocks</p>
            </div>
          </div>
          <button
            onClick={() => setIncludeThinking(!includeThinking)}
            className={`
              relative w-11 h-6 rounded-full transition-all duration-300
              ${includeThinking ? 'bg-white/20' : 'bg-white/5'}
              border border-white/10
            `}
          >
            <div className={`
              absolute top-0.5 left-0.5 w-[1.375rem] h-[1.375rem] rounded-full 
              bg-white shadow-xl transform transition-transform duration-300
              ${includeThinking ? 'translate-x-5' : 'translate-x-0'}
            `} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button icon={<FileCode size={18} />} label="Markdown" onClick={() => handleExport('MARKDOWN')} />
          <Button icon={<FileText size={18} />} label="PDF" onClick={() => handleExport('PDF')} />
          <Button icon={<FileJson size={18} />} label="JSON" onClick={() => handleExport('JSON')} />
          <Button icon={<FileType size={18} />} label="Plain Text" onClick={() => handleExport('TXT')} />
        </div>
      </div>

      {/* Dynamic Status Bar */}
      <footer className="mt-6">
        <div className={`
          min-h-[60px] rounded-2xl p-4 flex items-center justify-center gap-3 transition-all
          border border-transparent
          ${status === 'SUCCESS' ? 'bg-green-500/10 border-green-500/20 text-green-400' : ''}
          ${status === 'ERROR' ? 'bg-red-500/10 border-red-500/20 text-red-400' : ''}
          ${status === 'LOADING' ? 'bg-white/5 animate-pulse' : ''}
          ${status === 'IDLE' ? 'bg-white/5 text-white/30' : ''}
        `}>
          {status === 'IDLE' && (
            <span className="text-xs font-medium tracking-wide">READY FOR EXPORT</span>
          )}

          {status === 'LOADING' && (
            <div className="flex items-center gap-3">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs font-bold uppercase tracking-wider">Extracting...</span>
            </div>
          )}

          {status === 'SUCCESS' && (
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Success</span>
            </div>
          )}

          {status === 'ERROR' && (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-center">{errorMessage}</span>
              </div>
              {errorMessage.includes('reload') && (
                <button
                  onClick={handleReload}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-extrabold transition-colors"
                >
                  <RefreshCcw className="w-3 h-3" /> REFRESH NOW
                </button>
              )}
            </div>
          )}
        </div>
      </footer>

      {/* Support & Help Hub */}
      <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
        {/* Quick Guide Toggle */}
        <button
          onClick={() => setShowGuide(!showGuide)}
          className={`
            w-full py-2 px-4 rounded-xl border flex items-center justify-between transition-all duration-300
            ${showGuide ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}
          `}
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">How to use</span>
          </div>
          <Info className={`w-3 h-3 transition-transform ${showGuide ? 'rotate-180' : ''}`} />
        </button>

        {/* Expandable Guide */}
        {showGuide && (
          <div className="glass-card rounded-xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <ul className="space-y-2.5">
              {[
                "Open any chat on AI Studio",
                "Ensure conversations are fully loaded",
                "Select your preferred format above",
                "Enjoy your Obsidian-ready export!"
              ].map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="text-blue-500 font-black text-[10px] mt-0.5">{i + 1}.</span>
                  <p className="text-[10px] text-white/50 leading-relaxed font-medium">{step}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Support Links & Credits */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/DVRRK/Ai-Studio-Exporter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/20 hover:text-white/60 transition-colors group relative"
              title="Star on GitHub"
            >
              <Github className="w-4 h-4" />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-[8px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Star Repo</span>
            </a>
            <a
              href="https://github.com/DVRRK/Ai-Studio-Exporter/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/20 hover:text-white/60 transition-colors group relative"
              title="Report Bug"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-[8px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">Report Bug</span>
            </a>
          </div>

          <div className="flex flex-col items-end">
            <p className="text-[9px] text-white/10 font-black tracking-tighter uppercase whitespace-nowrap">
              v1.2.0 • <span className="text-white/30">Alpha Build</span>
            </p>
            <p className="text-[8px] text-white/5 font-bold tracking-[0.2em] uppercase mt-0.5">
              Crafted by <span className="text-white/20 hover:text-white/40 cursor-default transition-colors">Bu Ajlan</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
