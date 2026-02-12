import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getStudyNotes } from '@/app/actions';
import StudyNotesClient from './client-page';

export default async function StudyNotesPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const userId = parseInt(session.user.id!);
    const initialNotes = await getStudyNotes(userId);

    return <StudyNotesClient initialNotes={initialNotes} userId={userId} />;
}
