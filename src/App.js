import React, { useState } from 'react';

function App() {

  const quotes = [
    "Believe you can and you're halfway there. – Theodore Roosevelt",
    "Dream big and dare to fail. – Norman Vaughan",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Act as if what you do makes a difference. It does. – William James"
  ]

  const [quote, setQuote] = useState(quotes[0]);
  const [copied, setCopied] = useState(false);
  const [quoteKey, setQuoteKey] = useState(0);

  const getQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
    setCopied(false); // Reset copied state when getting new quote
    setQuoteKey(prev => prev + 1); // Trigger animation by changing key
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(quote);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center border border-white/20">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
          Random Quote Generator
        </h1>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/30 relative overflow-hidden">
          <p 
            key={quoteKey}
            className="text-xl md:text-2xl text-white font-medium leading-relaxed italic animate-fade-in-slide-up"
          >
            "{quote}"
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={getQuote}
            className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-xl"
          >
            Get New Quote
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
