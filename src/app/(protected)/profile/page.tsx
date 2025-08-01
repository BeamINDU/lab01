'use client';

import {
  User,
  Mail,
  Fingerprint,
  ShieldCheck,
  Pencil,
  BadgeInfo,
  UserCircle,
} from 'lucide-react';

export default function ProfilePage() {
  const user = {
    userid: 'TH001',
    ufname: 'Admin',
    ulname: 'admin',
    username: 'admin',
    email: 'admin@pi.com',
    userstatus: true,
    rolenames: 'Admin',
    avatar: '',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-28 h-28 rounded-full border object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '';
              }}
            />
          ) : (
            <div className="w-28 h-28 flex items-center justify-center bg-gray-100 rounded-full border">
              <UserCircle size={64} className="text-gray-400" />
            </div>
          )}

          {/* User Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
              <User size={18} />
              <span>
                {user.ufname} {user.ulname}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Fingerprint size={16} />
              <span>{user.userid}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <BadgeInfo size={16} />
              <span>{user.username}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Mail size={16} />
              <span>{user.email}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <ShieldCheck size={16} />
              <span>{user.rolenames}</span>
            </div>

            <button className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition">
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
