import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ShieldAlert, Sparkles, Share2, RefreshCcw, Send, Volume2, VolumeX } from 'lucide-react';
import { PRESET_MESSAGES, getCustomTranslation, type Translation } from './messages';
import { soundEngine } from './sounds';
import './App.css';

const App: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<Translation | null>(null);
  const [customText, setCustomText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleMusic = () => {
    soundEngine.toggleMusic();
    setIsMuted(!isMuted);
  };

  const handleSelect = (msg: Translation) => {
    soundEngine.playClick();
    setSelectedMessage(msg);
    // Scroll to processing section
    scrollToSection(2);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    
    soundEngine.playSuccess();
    const customMsg: Translation = {
      id: 'custom',
      original: customText,
      meaning: getCustomTranslation(customText)
    };
    setSelectedMessage(customMsg);
    scrollToSection(2);
  };

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPos = container.scrollTop;
      const index = Math.round(scrollPos / window.innerHeight);

      if (index === 2 && selectedMessage && !isProcessing && !showResult) {
        startProcessing();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [selectedMessage, isProcessing, showResult]);

  const startProcessing = () => {
    setIsProcessing(true);
    soundEngine.playType();
    
    setTimeout(() => {
      setIsProcessing(false);
      setShowResult(true);
      soundEngine.playSuccess();
      scrollToSection(3);
    }, 3000);
  };

  const reset = () => {
    setSelectedMessage(null);
    setCustomText('');
    setIsProcessing(false);
    setShowResult(false);
    scrollToSection(0);
    soundEngine.playClick();
  };

  return (
    <div className="snap-container" ref={scrollContainerRef}>
      {/* MUSIC TOGGLE */}
      <button className="music-toggle glass-card" onClick={toggleMusic}>
        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      </button>

      {/* SECTION 0: HERO */}
      <section className="snap-section hero">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="hero-content"
        >
          <h1 className="gradient-text">TEXT MESSAGE TRANSLATOR</h1>
          <p className="subtext">What they said vs. what they actually meant.</p>
          <div className="scroll-indicator" onClick={() => {
            if (isMuted) toggleMusic();
            scrollToSection(1);
          }}>
            <span>Scroll to Decode</span>
            <ChevronDown size={24} />
          </div>
        </motion.div>
      </section>

      {/* SECTION 1: CHOOSE MESSAGE */}
      <section className="snap-section selection">
        <div className="section-header">
          <h2>Choose a Message</h2>
          <p>Tap a classic or type your own drama.</p>
        </div>
        
        <div className="messages-grid">
          {PRESET_MESSAGES.map((msg) => (
            <motion.button
              key={msg.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`msg-bubble ${selectedMessage?.id === msg.id ? 'active' : ''}`}
              onClick={() => handleSelect(msg)}
            >
              {msg.original}
            </motion.button>
          ))}
        </div>

        <form className="custom-input-form" onSubmit={handleCustomSubmit}>
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder="Type your own message..." 
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              onFocus={() => soundEngine.playType()}
            />
            <button type="submit" className="send-btn">
              <Send size={20} />
            </button>
          </div>
        </form>
      </section>

      {/* SECTION 2: PROCESSING */}
      <section className="snap-section processing">
        {!selectedMessage ? (
          <div className="waiting-state">
            <ShieldAlert size={48} className="icon-pulse" />
            <p>Wait! You need to pick a message first.</p>
            <button onClick={() => scrollToSection(1)} className="back-btn">Go Back</button>
          </div>
        ) : (
          <div className="loading-state">
            <div className="typing-animation">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <motion.div 
              key={isProcessing ? 'proc' : 'done'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="processing-text"
            >
              {isProcessing ? (
                <>
                  <p className="glitch" data-text="Analyzing emotional subtext...">Analyzing emotional subtext...</p>
                  <p className="sub-loading">Decoding hidden passive-aggression...</p>
                </>
              ) : (
                <p>Scroll down to reveal the truth.</p>
              )}
            </motion.div>
          </div>
        )}
      </section>

      {/* SECTION 3: REVEAL */}
      <section className="snap-section result">
        {selectedMessage && (
          <motion.div 
            className="result-card glass-card"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <div className="card-tag">Translated</div>
            <div className="original-box">
              <span className="label">THEY SAID:</span>
              <div className="bubble-sent">{selectedMessage.original}</div>
            </div>
            <div className="divider">
              <Sparkles size={20} />
            </div>
            <div className="meaning-box">
              <span className="label">THEY MEANT:</span>
              <div className="meaning-text">"{selectedMessage.meaning}"</div>
            </div>
            
            <div className="card-actions">
              <button className="action-btn share" onClick={() => {
                soundEngine.playClick();
                alert('Shared to clipboard! (Simulation)');
              }}>
                <Share2 size={18} /> Share Result
              </button>
              <button className="action-btn retry" onClick={reset}>
                <RefreshCcw size={18} /> Try Another
              </button>
            </div>
          </motion.div>
        )}
        
        <div className="final-footer">
          <h3>Communication is complicated.</h3>
          <p>Made with sarcasm for Weboreel.</p>
        </div>
      </section>
    </div>
  );
};

export default App;
