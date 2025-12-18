
import React, { useState, useEffect } from 'react';
import { User, PaymentRequest, PaymentStatus, ViewType } from './types';
import Sidebar from './components/Sidebar';
import UserForm from './components/UserForm';
import PaymentModal from './components/PaymentModal';
import { ICONS } from './constants';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [processingPayment, setProcessingPayment] = useState<PaymentRequest | null>(null);

  // Initialize with some mock data
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex.j@example.com',
        socialMedia: { twitter: '@alexj', linkedin: 'linkedin.com/in/alexj' },
        promoCode: { code: 'NEXUS50', discountPercentage: 50, startDate: '2024-01-01', endDate: '2024-12-31' }
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Miller',
        email: 'sarah.m@example.com',
        socialMedia: { instagram: '@sarahpics' },
        promoCode: { code: 'WELCOME10', discountPercentage: 10, startDate: '2024-03-15', endDate: '2024-04-15' }
      }
    ];

    const mockPayments: PaymentRequest[] = [
      { id: 'pay1', userId: '1', userName: 'Alex Johnson', amount: 1500, status: PaymentStatus.PENDING, date: '2024-05-10' },
      { id: 'pay2', userId: '2', userName: 'Sarah Miller', amount: 450, status: PaymentStatus.PAID, date: '2024-05-08' }
    ];

    setUsers(mockUsers);
    setPayments(mockPayments);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleSaveUser = (userData: User) => {
    if (editingUser) {
      setUsers(users.map(u => u.id === userData.id ? userData : u));
    } else {
      setUsers([...users, userData]);
    }
    setShowUserForm(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleUpdatePayment = (id: string, status: PaymentStatus, receipt?: string) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status, receiptImage: receipt } : p));
    setProcessingPayment(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
            <div className="text-center space-y-2">
              <div className="mx-auto bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-3xl text-white shadow-xl shadow-indigo-500/20 mb-6">N</div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
              <p className="text-slate-500 font-medium">Nexus Admin Control Panel</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700 ml-1">Admin Email</label>
                <input required type="email" defaultValue="admin@nexus.io" className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" placeholder="admin@nexus.io" />
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-semibold text-slate-700 ml-1">Password</label>
                <input required type="password" defaultValue="password" className="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all">
                Sign In
              </button>
            </form>
          </div>
          <p className="text-center text-slate-400 mt-8 text-sm">Nexus Systems &copy; 2024. Security protocols active.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar currentView={currentView} setView={setCurrentView} onLogout={() => setIsLoggedIn(false)} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              {currentView === 'dashboard' && 'Dashboard Overview'}
              {currentView === 'users' && 'User Management'}
              {currentView === 'payments' && 'Payment Requests'}
            </h1>
            <p className="text-slate-500 font-medium">Welcome, System Administrator</p>
          </div>
          
          <div className="flex gap-4">
            <button className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
            <div className="flex items-center gap-3 bg-white pl-4 pr-2 py-2 rounded-2xl shadow-sm border border-slate-100">
              <span className="font-semibold text-slate-700">Admin</span>
              <img src="https://picsum.photos/40/40?random=1" className="w-10 h-10 rounded-xl object-cover" alt="Admin" />
            </div>
          </div>
        </header>

        {currentView === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Users', value: users.length, change: '+12%', color: 'indigo' },
                { label: 'Active Promos', value: users.filter(u => new Date(u.promoCode.endDate) > new Date()).length, change: '+2', color: 'emerald' },
                { label: 'Pending Payments', value: payments.filter(p => p.status === PaymentStatus.PENDING).length, change: '-3%', color: 'amber' }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
                  <div>
                    <span className="text-slate-500 font-semibold">{stat.label}</span>
                    <div className="text-4xl font-bold text-slate-900 mt-2">{stat.value}</div>
                  </div>
                  <div className={`mt-4 text-sm font-bold inline-flex items-center px-2 py-1 rounded-lg ${
                    stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                    stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {stat.change} <span className="ml-1 font-normal opacity-60">this month</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
                <div className="space-y-6">
                  {users.slice(0, 3).map((user, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="bg-slate-100 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-slate-600">{user.firstName[0]}</div>
                      <div className="flex-1">
                        <div className="font-bold text-slate-900">{user.firstName} {user.lastName}</div>
                        <div className="text-sm text-slate-500">New user registration</div>
                      </div>
                      <div className="text-xs text-slate-400 font-medium">2h ago</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-900/10">
                <h3 className="text-lg font-bold mb-6">Promotions Overview</h3>
                <div className="space-y-6">
                  {users.slice(0, 2).map((user, i) => (
                    <div key={i} className="bg-slate-800/50 p-5 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-indigo-400">{user.promoCode.code}</span>
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg text-xs font-bold">{user.promoCode.discountPercentage}% OFF</span>
                      </div>
                      <div className="text-xs text-slate-400">Assigned to: {user.firstName}</div>
                      <div className="mt-3 flex justify-between text-xs font-medium">
                        <span>Ends: {user.promoCode.endDate}</span>
                        <span className="text-white">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'users' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div className="relative w-72">
                <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
              </div>
              <button 
                onClick={() => { setEditingUser(null); setShowUserForm(true); }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
              >
                <ICONS.Plus /> Add User
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <th className="px-8 py-5">User Profile</th>
                    <th className="px-6 py-5">Promo Details</th>
                    <th className="px-6 py-5">Social Presence</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg">{user.firstName[0]}{user.lastName[0]}</div>
                          <div>
                            <div className="font-bold text-slate-900">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{user.promoCode.code}</span>
                            <span className="text-xs font-bold text-emerald-600">{user.promoCode.discountPercentage}%</span>
                          </div>
                          <div className="text-xs text-slate-400 font-medium">Valid until: {user.promoCode.endDate}</div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex gap-2">
                          {Object.entries(user.socialMedia).map(([key, val]) => val && (
                            <span key={key} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-tighter">
                              {key}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingUser(user); setShowUserForm(true); }}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <ICONS.Edit />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <ICONS.Trash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {currentView === 'payments' && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 border-b border-slate-100">
              <div className="flex gap-4">
                {['All Requests', 'Pending', 'Approved'].map((tab, i) => (
                  <button key={i} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${i === 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:bg-slate-100'}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left text-slate-500 text-xs font-bold uppercase tracking-widest">
                    <th className="px-8 py-5">Reference</th>
                    <th className="px-6 py-5">Amount</th>
                    <th className="px-6 py-5">Date</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-900">{payment.userName}</div>
                        <div className="text-xs text-slate-400 font-mono">ID: {payment.id}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="font-bold text-slate-900 tracking-tight">${payment.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-6 text-sm text-slate-500">{payment.date}</td>
                      <td className="px-6 py-6">
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-tighter ${
                          payment.status === PaymentStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                          payment.status === PaymentStatus.PAID ? 'bg-blue-100 text-blue-700' :
                          payment.status === PaymentStatus.APPROVED ? 'bg-emerald-100 text-emerald-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setProcessingPayment(payment)}
                          className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                        >
                          View Receipt / Process
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {showUserForm && (
        <UserForm 
          user={editingUser || undefined} 
          onSave={handleSaveUser} 
          onClose={() => { setShowUserForm(false); setEditingUser(null); }} 
        />
      )}

      {processingPayment && (
        <PaymentModal 
          payment={processingPayment} 
          onUpdateStatus={handleUpdatePayment} 
          onClose={() => setProcessingPayment(null)} 
        />
      )}
    </div>
  );
};

export default App;
