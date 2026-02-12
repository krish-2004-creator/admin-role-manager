'use server';

import { auth } from '@/auth';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '@/db';
import { studyNotes } from '@/db/schema';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateStudyNotes(videoUrl: string) {
    const session = await auth();
    const userId = session?.user?.id ? parseInt(session.user.id) : undefined;

    if (!process.env.GEMINI_API_KEY) {
        return { error: 'Gemini API Key is missing. Please add GEMINI_API_KEY to your .env file.' };
    }

    // Extract Video ID
    const videoId = extractVideoId(videoUrl);
    if (!videoId) {
        return { error: 'Invalid YouTube URL' };
    }

    try {
        console.log(`🎬 Generating study notes for video: ${videoId}`);

        // Use Gemini 1.5 Flash which supports video analysis
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are an expert educational content analyst. Analyze this YouTube video and create comprehensive, structured study notes.

        **STRICT INSTRUCTIONS:**
        1.  **Do NOT** simply summarize or recap the video.
        2.  **ANALYZE** the content deeply to extract core educational value.
        3.  **Do NOT** use timestamp format.
        4.  Focus on concepts, insights, and actionable knowledge.
        
        **Required Output Structure:**
        # [Engaging Title]
        
        ## 🎯 Executive Summary
        A concise, high-level overview of the main thesis (2-3 sentences).
        
        ## 🔑 Key Concepts & Definitions
        *   **Concept 1**: Definition/Explanation
        *   **Concept 2**: Definition/Explanation
        *   (Continue as needed)
        
        ## 🧠 Detailed Analysis
        Break down the video's content into logical sections. Use clear headings (###). 
        Provide deep analysis, not just surface-level descriptions.
        Include examples, explanations, and context.
        
        ## 💡 Key Insights
        *   Important realizations or "aha moments" from the content
        
        ## 🚀 Actionable Takeaways
        *   Practical steps or applications derived from the video
        *   What can viewers implement immediately?
        
        ## 📚 Additional Resources (if mentioned)
        *   Any tools, books, or resources referenced in the video
        `;

        console.log('🤖 Calling Gemini API with video URL...');

        // Gemini can analyze YouTube videos directly via URL
        // Pass the URL in the prompt - Gemini will automatically detect and process it
        const result = await model.generateContent([
            {
                text: `${prompt}\n\nVideo URL: ${videoUrl}`
            }
        ]);

        console.log('📥 Received response from Gemini');
        const generatedText = result.response.text();
        console.log('✅ Generated text length:', generatedText.length);

        // Extract title from generated content
        const titleMatch = generatedText.match(/^#\s+(.*)$/m);
        const title = titleMatch ? titleMatch[1] : `Study Notes: ${videoId}`;

        // Save to database
        if (userId) {
            await db.insert(studyNotes).values({
                userId,
                videoUrl,
                videoId,
                title,
                content: generatedText,
            });
            console.log('💾 Notes saved to database');
        }

        return { success: true, notes: generatedText };

    } catch (error) {
        console.error('❌ Error generating study notes:', error);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
        return { error: `Failed to generate notes: ${errorMessage}` };
    }
}

function extractVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
