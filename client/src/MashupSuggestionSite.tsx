import React, { useState } from 'react';
import { Music, Send, Heart, Users, Zap, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';

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

const MashupSuggestionSite: React.FC = () => {
  const [suggestions, setSuggestions] = useState<SongSuggestion[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
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

  // Google Apps Script Web App URL
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyC0avS56JE4NGwQg7WNWXyRRD5CQhrnrHmXQiNGXTax_UHpCudy-RWhTxOupNQSmps/exec';

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
      // Submit to Google Sheets using no-cors mode
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      // With no-cors, we can't read the response, so we assume success
      // if the fetch doesn't throw an error
      console.log('Form submitted successfully');
      
      const result = { success: true }; // Assume success
      
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

  const isFormValid = formData.song1 && formData.artist1 && formData.suggesterName;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full">
                <Music className="h-8 w-8" />
              </div>
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
              <a
                href="https://audiomack.com/ehanzo523"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/30 hover:bg-black/50 border border-white/20 hover:border-white/40 px-6 py-3 rounded-full font-semibold flex items-center space-x-2 transition-all duration-200 transform hover:scale-105"
              >
                <Music className="h-5 w-5" />
                <span>Listen on Audiomack</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Help Me Create Epic Mashups
          </h2>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Got a song you think would make an amazing mashup? I'm always looking for fresh ideas to make new mashups! Suggest some song(s) and I'll work on creating your mashup which will be posted on Audiomack when finished. Thank you! ❤️🎵
          </p>
          <div className="flex justify-center space-x-8 text-white/60">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>{suggestions.length} {suggestions.length == 1 ? 'suggestion' : 'suggestions'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              {/* <span>{suggestions.reduce((total, s) => total + s.likes, 0)} likes</span> */}
              <span>Let's create together!</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Powered by the community</span>
            </div>
          </div>
        </div>
      </section>

      {/* Suggestion Form Modal */}
      {isFormVisible && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Suggest a Song for Me</h3>
              <button
                onClick={() => setIsFormVisible(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span className="text-green-400">Thanks! Your suggestion has been submitted successfully!</span>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-red-400">Oops! Something went wrong. Please try again.</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Song Title</label>
                <input
                  type="text"
                  name="song1"
                  value={formData.song1}
                  onChange={handleInputChange}
                  placeholder="Enter song title"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Artist</label>
                <input
                  type="text"
                  name="artist1"
                  value={formData.artist1}
                  onChange={handleInputChange}
                  placeholder="Enter artist name"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div className="border-t border-white/20 pt-4">
                <label className="block text-sm font-medium text-white/80 mb-2">Second Song (Optional)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      name="song2"
                      value={formData.song2}
                      onChange={handleInputChange}
                      placeholder="Song title (optional)"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="artist2"
                      value={formData.artist2}
                      onChange={handleInputChange}
                      placeholder="Artist (optional)"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Your Name</label>
                <input
                  type="text"
                  name="suggesterName"
                  value={formData.suggesterName}
                  onChange={handleInputChange}
                  placeholder="How should we credit you?"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email (Optional)</label>
                <input
                  type="email"
                  name="suggesterEmail"
                  value={formData.suggesterEmail}
                  onChange={handleInputChange}
                  placeholder="Get notified when I create your mashup"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Why this song? (Optional)</label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  placeholder="Tell me why you think this would make a great mashup..."
                  rows={3}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Submit Suggestion</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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