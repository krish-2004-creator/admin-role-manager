
'use server';

import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateStudyNotes(videoUrl: string) {
    if (!process.env.GEMINI_API_KEY) {
        return { error: 'Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file.' };
    }

    try {
        console.log(`Generating study notes for: ${videoUrl}`);

        // 1. Extract Video ID
        const videoId = extractVideoId(videoUrl);
        if (!videoId) {
            return { error: 'Invalid YouTube URL' };
        }

        // 2. Fetch Transcript
        console.log(`Fetching transcript for video ID: ${videoId}`);
        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);

        if (!transcriptItems || transcriptItems.length === 0) {
            return { error: 'No transcript found for this video. Please try a video with closed captions.' };
        }

        const fullTranscript = transcriptItems.map(item => item.text).join(' ');

        // Truncate if too long (Gemini has a token limit, though 1.5 Flash is generous)
        // A rough char limit to be safe
        const maxLength = 30000;
        const truncatedTranscript = fullTranscript.length > maxLength
            ? fullTranscript.substring(0, maxLength) + '...[truncated]'
            : fullTranscript;

        console.log(`Transcript length: ${truncatedTranscript.length} characters`);

        // 3. Generate Summary with Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are an expert student assistant. Your task is to create comprehensive study notes from the following YouTube video transcript.
        
        Format the output in clean Markdown:
        - Use H1 (#) for the main title (create a catchy title based on content).
        - Use H2 (##) for section headers.
        - Use bullet points for key concepts.
        - Highlight important terms in **bold**.
        - Include a "Summary" section at the top.
        - Include a "Key Takeaways" section at the bottom.
        
        Transcript:
        "${truncatedTranscript}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return { success: true, notes: text };

    } catch (error) {
        console.error('Error generating study notes:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return { error: `Failed to generate notes: ${errorMessage}` };
    }
}

function extractVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
