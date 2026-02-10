import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getUsers, approveUser, rejectUser, handleSignOut } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user) {
        redirect('/login');
    }

    const user = session.user;

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                Dashboard
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-semibold text-gray-800">
                                    {user.name || 'User'}
                                </span>
                                <span className={`text-xs uppercase tracking-wide px-2 py-0.5 rounded font-bold ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {user.role} MODE
                                </span>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                {(user.name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                            </div>
                            <form
                                action={handleSignOut}
                            >
                                <button className="text-sm text-gray-500 hover:text-red-600 transition-colors font-medium">
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Welcome Section */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Hello, {user.name || 'there'}!
                    </h1>
                    <p className="mt-1 text-gray-500">Here is what is happening with your account today.</p>

                </div>

                {/* Status Messages */}
                {user.status === 'pending' && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8 rounded-r-lg shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm leading-5 font-medium text-amber-800">
                                    Account Pending Approval
                                </h3>
                                <div className="mt-2 text-sm leading-5 text-amber-700">
                                    <p>
                                        Your account is currently under review by an administrator. You will receive full access once approved.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {user.status === 'rejected' && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg shadow-sm">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-red-800">Your account has been rejected. Please contact support.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* User Content */}
                {user.status === 'approved' && user.role === 'user' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Clean user cards */}
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Project Overview</h3>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Active</span>
                                </div>
                                <p className="text-gray-500 text-sm">Access your latest projects and track progress.</p>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <button className="text-blue-600 text-sm font-medium hover:text-blue-800">View Details &rarr;</button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                </div>
                                <p className="text-gray-500 text-sm">View your performance statistics and reports.</p>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <button className="text-blue-600 text-sm font-medium hover:text-blue-800">View Reports &rarr;</button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                                <p className="text-gray-500 text-sm">Manage your profile and account preferences.</p>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <button className="text-blue-600 text-sm font-medium hover:text-blue-800">Manage Account &rarr;</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Admin Content */}
                {user.role === 'admin' && (
                    <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800">User Management</h2>
                            <div className="flex flex-col items-end gap-1">
                                <span className="bg-gray-100 text-gray-600 py-1 px-3 rounded text-xs font-semibold uppercase tracking-wide">
                                    {(await getUsers()).length} Total Users
                                </span>
                                <span className="text-[10px] text-gray-400 italic">
                                    Actions available for Pending users
                                </span>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 transition-all">
                                    {(await getUsers()).map((u) => (
                                        <tr key={u.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 font-bold border border-gray-300">
                                                            {(u.name?.[0] || u.email?.[0] || 'U').toUpperCase()}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{u.name || 'Unknown'}</div>
                                                        <div className="text-sm text-gray-500">{u.email}</div>
                                                        <div className="text-xs text-gray-400 mt-0.5">ID: {u.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full uppercase tracking-wide ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : 'bg-gray-100 text-gray-800 border border-gray-200'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${u.status === 'approved'
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : u.status === 'pending'
                                                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                            : 'bg-red-50 text-red-700 border-red-200'
                                                        }`}
                                                >
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {u.status === 'pending' && (
                                                    <div className="flex justify-end">
                                                        <form action={approveUser.bind(null, u.id)}>
                                                            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-4 rounded-md shadow-sm text-xs uppercase tracking-wide transition-colors">
                                                                Approve
                                                            </button>
                                                        </form>
                                                        <form action={rejectUser.bind(null, u.id)}>
                                                            <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 px-4 rounded-md shadow-sm text-xs uppercase tracking-wide transition-colors ml-2">
                                                                Reject
                                                            </button>
                                                        </form>
                                                    </div>
                                                )}
                                                {u.status !== 'pending' && <span className="text-gray-400 text-xs italic">No actions</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
                }
            </main >
        </div >
    );
}
