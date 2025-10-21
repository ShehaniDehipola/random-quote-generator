import React, { useState, useEffect } from 'react';

function App() {

  const [quote, setQuote] = useState("Loading inspiring quote...");
  const [author, setAuthor] = useState("");
  const [copied, setCopied] = useState(false);
  const [quoteKey, setQuoteKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch quote from API
  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try multiple APIs in sequence (CORS-friendly, English only)
      const apis = [
        // API 1: quotable.io (using proxy, English only)
        async () => {
          const response = await fetch('/random?tags=inspirational,motivational,success');
          if (!response.ok) throw new Error('quotable.io failed');
          const data = await response.json();
          return { text: data.content, author: data.author };
        },
        
        // API 2: quotegarden (CORS-friendly, English only)
        async () => {
          const response = await fetch('https://quotegarden.herokuapp.com/api/v3/quotes/random');
          if (!response.ok) throw new Error('quotegarden failed');
          const data = await response.json();
          return { text: data.data.quoteText, author: data.data.quoteAuthor };
        },
        
        // API 3: English quotes API (CORS-friendly)
        async () => {
          const response = await fetch('https://api.quotable.io/random?tags=inspirational');
          if (!response.ok) throw new Error('quotable.io direct failed');
          const data = await response.json();
          return { text: data.content, author: data.author };
        }
      ];
      
      // Try each API until one works
      for (let i = 0; i < apis.length; i++) {
        try {
          console.log(`Trying API ${i + 1}...`);
          const result = await apis[i]();
          
          // Filter for English quotes only (basic check)
          const isEnglish = /^[a-zA-Z0-9\s.,!?'"()-]+$/.test(result.text);
          if (!isEnglish) {
            console.log('Non-English quote detected, trying next API...');
            if (i === apis.length - 1) throw new Error('No English quotes found');
            continue;
          }
          
          setQuote(result.text);
          setAuthor(result.author);
          setQuoteKey(prev => prev + 1);
          setCopied(false);
          setLoading(false);
          return; // Success, exit function
        } catch (apiErr) {
          console.error(`API ${i + 1} failed:`, apiErr);
          if (i === apis.length - 1) throw apiErr; // Last API failed
        }
      }
    } catch (err) {
      console.error('All APIs failed:', err);
      setError('Unable to fetch quotes. Using inspirational fallback.');
      
      // Local fallback quotes
      const fallbackQuotes = [
        { text: "Sometimes the best quotes come from within. Keep inspiring yourself!", author: "You" },
        { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
        { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
        { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
        { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" }
      ];
      
      const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomFallback.text);
      setAuthor(randomFallback.author);
      setQuoteKey(prev => prev + 1);
      setCopied(false);
    } finally {
      setLoading(false);
    }
  };

  // Load initial quote on component mount
  useEffect(() => {
    fetchQuote();
  }, []);

  const getQuote = () => {
    fetchQuote();
  }

  const copyToClipboard = async () => {
    try {
      const fullQuote = author ? `"${quote}" - ${author}` : `"${quote}"`;
      await navigator.clipboard.writeText(fullQuote);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Circles */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-pink-300/20 rounded-full animate-float-delayed"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-blue-300/20 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 bg-yellow-300/20 rounded-full animate-float"></div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-white/5 rotate-45 animate-spin-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-pink-200/10 rotate-12 animate-pulse"></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-lg animate-float"></div>
      </div>
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center border border-white/20">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
          Random Quote Generator
        </h1>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/30 relative overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="ml-3 text-white">Loading quote...</span>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-xl md:text-2xl text-white font-medium leading-relaxed italic mb-2">
                "{quote}"
              </p>
            </div>
          ) : (
            <div>
              <p 
                key={quoteKey}
                className="text-xl md:text-2xl text-white font-medium leading-relaxed italic animate-fade-in-slide-up"
              >
                "{quote}"
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={getQuote}
            disabled={loading}
            className={`${
              loading 
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 cursor-not-allowed opacity-50' 
                : 'bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700'
            } text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-xl`}
          >
            {loading ? 'Loading...' : 'Get New Quote'}
          </button>
          <button
            onClick={copyToClipboard}
            className={`${
              copied 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700'
            } text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-xl`}
          >
            {copied ? '✓ Copied!' : 'Copy Quote'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
