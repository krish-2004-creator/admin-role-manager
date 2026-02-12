'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateStudyNotes } from '@/app/ai-actions';
import { deleteStudyNote } from '@/app/actions';

interface StudyNote {
    id: number;
    userId: number;
    videoUrl: string;
    videoId: string;
    title: string;
    content: string;
    createdAt: Date | null;
}

interface StudyNotesClientProps {
    initialNotes: StudyNote[];
    userId: number;
}

export default function StudyNotesClient({ initialNotes, userId }: StudyNotesClientProps) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [notes, setNotes] = useState<StudyNote[]>(initialNotes);
    const [currentNote, setCurrentNote] = useState<StudyNote | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!url) return;
        setLoading(true);
        setError(null);
        setCurrentNote(null);

        try {
            const result = await generateStudyNotes(url);
            if (result.error) {
                setError(result.error);
            } else if (result.notes) {
                // Determine title (simple parsing or fallback)
                let title = `Study Notes for ${url}`;
                const titleMatch = result.notes.match(/^#\s+(.*)$/m);
                if (titleMatch) title = titleMatch[1];

                // Optimistic update or refresh? 
                // Since generateStudyNotes now saves to DB, we should technically re-fetch or return the saved note.
                // For now, let's just show the textResult as a temporary note object
                const newNote: StudyNote = {
                    id: Date.now(), // Temp ID
                    userId,
                    videoUrl: url,
                    videoId: 'temp',
                    title: title,
                    content: result.notes,
                    createdAt: new Date(),
                };

                // In a real app we'd fetch the latest list or have the action return the new note
                // For simplicity, we might reload the page to get the fresh list with real ID
                // window.location.reload(); 
                // Better: just display it and let user refresh for history update, or manually add to list
                setNotes(prev => [newNote, ...prev]);
                setCurrentNote(newNote);
            }
        } catch {
            setError('An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (noteId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Are you sure you want to delete this note?')) return;

        try {
            await deleteStudyNote(noteId, userId);
            setNotes(prev => prev.filter(n => n.id !== noteId));
            if (currentNote?.id === noteId) {
                setCurrentNote(null);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete note');
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-6">
                AI Video Summarizer 🧠
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar: History */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-gray-700 h-[calc(100vh-200px)] overflow-y-auto">
                        <h2 className="text-gray-400 font-semibold mb-3 uppercase text-xs tracking-wider">Your Notes ({notes.length})</h2>
                        {notes.length === 0 && <p className="text-gray-500 text-sm">No notes yet.</p>}
                        <ul className="space-y-2">
                            {notes.map(note => (
                                <li key={note.id}
                                    onClick={() => setCurrentNote(note)}
                                    className={`p-3 rounded-lg cursor-pointer transition-all border ${currentNote?.id === note.id ? 'bg-purple-900/40 border-purple-500/50' : 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800'}`}
                                >
                                    <div className="flex justify-between items-start gap-2">
                                        <h3 className="text-sm font-medium text-gray-200 line-clamp-2">{note.title}</h3>
                                        <button
                                            onClick={(e) => handleDelete(note.id, e)}
                                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3">
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

                    {currentNote ? (
                        <div className="bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-700 shadow-2xl overflow-hidden animate-fade-in">
                            <div className="p-8 prose prose-invert max-w-none prose-headings:text-purple-300 prose-a:text-pink-400 prose-strong:text-white">
                                <ReactMarkdown>{currentNote.content}</ReactMarkdown>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center p-12 text-gray-500 bg-gray-800/20 rounded-xl border border-dashed border-gray-700">
                            <span className="text-4xl mb-4">📝</span>
                            <p>Select a note from the history or generate a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
