import React from 'react';
import { Send, X, CheckCircle, AlertCircle } from 'lucide-react';

type FormData = {
  song1: string;
  artist1: string;
  song2: string;
  artist2: string;
  suggesterName: string;
  suggesterEmail: string;
  reason: string;
};

interface Props {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: () => void;
  isFormValid: boolean;
  isSubmitting: boolean;
  submitStatus: 'success' | 'error' | null;
  onClose: () => void;
}

const MashupSuggestionForm: React.FC<Props> = ({
  formData,
  handleInputChange,
  handleSubmit,
  isFormValid,
  isSubmitting,
  submitStatus,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-md w-full border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Suggest a Song for Me</h3>
          <button
            onClick={onClose}
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
            <label className="block text-sm font-medium text-white/80 mb-2">Your Name / @</label>
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
  );
};

export default MashupSuggestionForm;
