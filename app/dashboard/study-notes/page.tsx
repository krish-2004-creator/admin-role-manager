
'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateStudyNotes } from '@/app/ai-actions';

export default function StudyNotesPage() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!url) return;
        setLoading(true);
        setError(null);
        setNotes(null);

        try {
            const result = await generateStudyNotes(url);
            if (result.error) {
                setError(result.error);
            } else if (result.notes) {
                setNotes(result.notes);
            }
        } catch {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-6">
                AI Video Summarizer 🧠
            </h1>

            <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 shadow-xl mb-8">
                <label className="block text-gray-300 text-sm font-medium mb-2">
                    Paste YouTube Video URL
                </label>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all placeholder-gray-500"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={loading || !url}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-purple-900/20"
                    >
                        {loading ? (
                            <>
                                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                                Generating...
                            </>
                        ) : (
                            'Generate Notes ✨'
                        )}
                    </button>
                </div>
                {error && (
                    <div className="mt-4 p-4 bg-red-900/30 border border-red-800 text-red-200 rounded-lg text-sm">
                        ⚠️ {error}
                    </div>
                )}
            </div>

            {notes && (
                <div className="bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-700 shadow-2xl overflow-hidden animate-fade-in">
                    <div className="p-8 prose prose-invert max-w-none prose-headings:text-purple-300 prose-a:text-pink-400 prose-strong:text-white">
                        <ReactMarkdown>{notes}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
}
