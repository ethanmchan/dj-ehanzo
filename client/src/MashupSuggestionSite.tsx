import React, { useState, useEffect } from 'react';
import { Music, Heart, Users, Zap, Plus, X, DollarSign } from 'lucide-react';
import MashupSuggestionForm from './MashupSuggestionForm';
import MusicIconSVG from './assets/music_icon.svg';
import AudioMackIcon from './assets/audiomack.svg';
import PaypalIcon from './assets/paypal.svg'
import VenmoIcon from './assets/venmo.svg'
import CashappIcon from './assets/cashapp.svg'

interface SongSuggestion {
  id: string;
  song1: string;
  artist1: string;
  song2: string;
  artist2: string;
  suggesterName: string;
  suggesterEmail: string;
  reason: string;
  timestamp: Date;
  likes: number;
}

interface SongMade {
  id: string;
  title: string;
  artist: string;
  releaseDate: Date;
  link?: string;
}

const MashupSuggestionSite: React.FC = () => {
  const [suggestions, setSuggestions] = useState<SongSuggestion[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isDonateVisible, setIsDonateVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [formData, setFormData] = useState({
    song1: '',
    artist1: '',
    song2: '',
    artist2: '',
    suggesterName: '',
    suggesterEmail: '',
    reason: ''
  });

  // Placeholder for songs made by the artist. Replace with DB/API fetch later.
  const [songsMade] = useState<SongMade[]>([
    {
      id: '1',
      title: 'Midnight Mashup',
      artist: 'eHanzo',
      releaseDate: new Date('2024-05-01'),
      link: 'https://audiomack.com/ehanzo523'
    },
    {
      id: '2',
      title: 'Sunset Blend',
      artist: 'eHanzo',
      releaseDate: new Date('2024-10-10'),
      link: 'https://audiomack.com/ehanzo523'
    }
  ]);

  // Netlify Functions endpoints
  const CREATE_SUGGESTION_URL = '/.netlify/functions/createSuggestion';
  const GET_SUGGESTIONS_URL = '/.netlify/functions/getSuggestions';

  // Load suggestions from backend on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(GET_SUGGESTIONS_URL);
        if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
        const data = await res.json();
        // Map incoming records to local SongSuggestion shape
        const mapped: SongSuggestion[] = (data || []).map((d: any) => ({
          id: d.id?.toString() || Date.now().toString(),
          song1: d.song1 || d.song1,
          artist1: d.artist1 || d.artist1,
          song2: d.song2 || d.song2 || '',
          artist2: d.artist2 || d.artist2 || '',
          suggesterName: d.suggester_name || d.suggesterName || 'Anonymous',
          suggesterEmail: d.suggester_email || d.suggesterEmail || '',
          reason: d.reason || '',
          timestamp: d.timestamp ? new Date(d.timestamp) : new Date(),
          likes: d.likes || 0
        }));
        setSuggestions(mapped);
      } catch (err) {
        console.error('Error loading suggestions:', err);
      }
    };
    load();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const res = await fetch(CREATE_SUGGESTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.error('Server error response:', errBody);
        setSubmitStatus('error');
        return;
      }

      const result = await res.json();

      if (result.success) {
        // Add to local state for immediate display
        const newSuggestion: SongSuggestion = {
          id: Date.now().toString(),
          ...formData,
          timestamp: new Date(),
          likes: 0
        };

        setSuggestions([newSuggestion, ...suggestions]);
        setFormData({
          song1: '',
          artist1: '',
          song2: '',
          artist2: '',
          suggesterName: '',
          suggesterEmail: '',
          reason: ''
        });
        setSubmitStatus('success');
        
        // Close form after successful submission
        setTimeout(() => {
          setIsFormVisible(false);
          setSubmitStatus(null);
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = (id: string) => {
    setSuggestions(suggestions.map(suggestion => 
      suggestion.id === id 
        ? { ...suggestion, likes: suggestion.likes + 1 }
        : suggestion
    ));
  };

  const isFormValid = !!(formData.song1 && formData.artist1 && formData.suggesterName);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full"> */}
                <img src={MusicIconSVG} className="h-14 w-14 rounded-full" alt="Music" />
              {/* </div> */}
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  eHanzo Mashups
                </h1>
                <p className="text-white/70 text-sm">Help me create the perfect mashup!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsFormVisible(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 px-6 py-3 rounded-full font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Suggest Song</span>
              </button>
              <button
                onClick={() => setIsDonateVisible(true)}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 px-6 py-3 rounded-full font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
              >
                <Heart className="h-5 w-5" />
                <span>Support</span>
              </button>
              <a
                href="https://audiomack.com/ehanzo523"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/30 hover:bg-black/50 border border-white/20 hover:border-white/40 px-6 py-3 rounded-full font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
              >
                <img src={AudioMackIcon} className="h-5 w-5" alt="Audiomack" />
                <span>Listen on Audiomack</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl py-3 font-bold mb-6 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Help Me Create Epic Mashups
          </h2>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Got a song you think would make an amazing mashup? I'm always looking for fresh ideas to make new mashups! Suggest some song(s) and I'll work on creating your custom mix which will be posted on Audiomack when finished. Thank you! ❤️🎵
          </p>
          <div className="flex justify-center space-x-8 text-white/60">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>{suggestions.length} {suggestions.length == 1 ? 'suggestion' : 'suggestions'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Let's create together!</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Powered by the community</span>
            </div>
          </div>
        </div>
      </section>

      {/* Donate Modal */}
      {isDonateVisible && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Support My Music
              </h3>
              <button
                onClick={() => setIsDonateVisible(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-full">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <p className="text-white/80 mb-8 leading-relaxed">
                Love the mashups? Help me keep creating amazing music by supporting my work! 
                Your donations help me invest in better equipment, software, and more time to create the mashups you love.
              </p>
              
              <div className="space-y-4">
                <a
                  href="https://www.paypal.com/donate/?business=ehanzo523@gmail.com&no_recurring=0&item_name=Support+eHanzo+Mashups&currency_code=USD"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 px-6 py-4 rounded-full font-semibold flex items-center justify-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {/* <DollarSign className="h-5 w-5" /> */}
                  <img src={PaypalIcon} className="h-6 w-6 rounded-full" alt="Paypal" />
                  <span>Donate via PayPal</span>
                </a>
                
                <a
                  href="https://venmo.com/ehanzo523"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 px-6 py-4 rounded-full font-semibold flex items-center justify-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {/* <Heart className="h-5 w-5" /> */}
                  <img src={VenmoIcon} className="h-5 w-5 rounded-full" alt="Venmo" />
                  <span>Venmo</span>
                </a>
                
                <a
                  href="https://cash.app/$ehanzo523"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 px-6 py-4 rounded-full font-semibold flex items-center justify-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  {/* <DollarSign className="h-5 w-5" /> */}
                  <img src={CashappIcon} className="h-5 w-5 rounded-full" alt="Cash App" />
                  <span>Cash App</span>
                </a>
              </div>
              
              <div className="mt-6 text-white/60 text-sm">
                <p>Every contribution helps me create better mashups for you! 🎵❤️</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggestion Form Modal (moved to separate component) */}
      {isFormVisible && (
        <MashupSuggestionForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isFormValid={isFormValid}
          isSubmitting={isSubmitting}
          submitStatus={submitStatus}
          onClose={() => setIsFormVisible(false)}
        />
      )}

      {/* Songs I've Made - this will be pulled from a DB in the future. */}
      <section className="container mx-auto px-4 pb-16">
        <h3 className="text-3xl font-bold text-center mb-6">Songs I've Made</h3>
        <p className="text-center text-white/70 mb-8">Tracks I've released — (placeholder data). In the future this list will be fetched from a database or API.</p>

        {/* Sample / placeholder data for now */}
        {/* Replace with DB fetch (useEffect) and setSongsMade once backend is ready */}
        {/** For now, render a small grid of cards. */}
        <div className="grid gap-6 max-w-4xl mx-auto md:grid-cols-2">
          {songsMade.map((song) => (
            <div key={song.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{song.title}</h4>
                  <p className="text-white/70">{song.artist}</p>
                </div>
                {song.link ? (
                  <a href={song.link} target="_blank" rel="noopener noreferrer" className="text-sm bg-black/20 px-3 py-2 rounded-full">Listen</a>
                ) : (
                  <span className="text-sm text-white/50 px-3 py-2 rounded-full">No link</span>
                )}
              </div>
              <p className="text-white/80 text-sm">Released {song.releaseDate.toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Suggestions List */}
      <section className="container mx-auto px-4 pb-16">
        <h3 className="text-3xl font-bold text-center mb-12">What You've Suggested So Far</h3>
        
        {suggestions.length === 0 ? (
          <div className="text-center py-16">
            <Music className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No suggestions yet! Be the first to help me out with a song idea 🎶</p>
          </div>
        ) : (
          <div className="grid gap-6 max-w-4xl mx-auto">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg p-3">
                        <Music className="h-6 w-6 text-pink-300" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">
                          "{suggestion.song1}" by {suggestion.artist1}
                        </h4>
                        {suggestion.song2 && suggestion.artist2 && (
                          <>
                            <p className="text-white/70">+</p>
                            <h4 className="font-semibold text-lg">
                              "{suggestion.song2}" by {suggestion.artist2}
                            </h4>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {suggestion.reason && (
                      <p className="text-white/80 mb-3 italic">"{suggestion.reason}"</p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <span>Suggested by {suggestion.suggesterName}</span>
                      <span>{suggestion.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleLike(suggestion.id)}
                    className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all duration-200"
                  >
                    <Heart className="h-4 w-4" />
                    <span>{suggestion.likes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-white/60">
          <p>&copy; 2025 eHanzo Mashups. Keep the music flowing! 🎵</p>
        </div>
      </footer>
    </div>
  );
};

export default MashupSuggestionSite;
