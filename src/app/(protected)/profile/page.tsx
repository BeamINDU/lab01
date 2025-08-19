'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, Fingerprint, ShieldCheck, Pencil, BadgeInfo, UserCircle, X, Save } from 'lucide-react';
import { userInfo, changePassword } from "@/app/libs/services/user-permissions";
import { update } from "@/app/libs/services/user";
import { z } from "zod";
import { showConfirm, showSuccess, showError } from '@/app/utils/swal';
import { extractErrorMessage } from '@/app/utils/errorHandler';

const EditProfileSchema = z.object({
  ufname: z.string().min(1, "First name is required"),
  ulname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."),
  newPassword: z.string().min(8, "Password must be at least 8 characters."),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match.",
  path: ["confirmNewPassword"],
});

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'password'>('info');

  const [editForm, setEditForm] = useState({
    ufname: '',
    ulname: '',
    email: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof typeof editForm, string>>>({});

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState<Partial<typeof passwordForm>>({});

  useEffect(() => {
    if (session?.user?.userid) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    const result = await userInfo(session?.user?.userid ?? '');
    setUser(result);
    setEditForm({
      ufname: result?.ufname || '',
      ulname: result?.ulname || '',
      email: result?.email || '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSave = () => {
    const result = EditProfileSchema.safeParse(editForm);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      for (const err of result.error.errors) {
        const field = err.path[0] as keyof typeof editForm;
        fieldErrors[field] = err.message;
      }
      setErrors(fieldErrors);
      return;
    }
    updateUser(result.data);
  };

  const updateUser = async (data: any) => {
    try {
      const dataUpdate = {
        userId: user?.userid,
        username: user?.username,
        firstname: data.ufname,
        lastname: data.ulname,
        email: data.email,
        updatedBy: session?.user?.userid
      }
      await update(user?.userid, dataUpdate);
      setUser((u) => ({
        ...u,
        ufname: data.ufname,
        ulname: data.ulname,
        email: data.email,
      }));
      showSuccess(`Saved successfully`);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Save operation failed:', error);
      showError(`Save failed: ${extractErrorMessage(error)}`);
    }
  };

  const handleChangePassword = async () => {
    const validation = passwordSchema.safeParse(passwordForm);

    if (!validation.success) {
      const fieldErrors: Partial<typeof passwordForm> = {};
      for (const err of validation.error.errors) {
        const field = err.path[0] as keyof typeof passwordForm;
        fieldErrors[field] = err.message;
      }
      setPasswordErrors(fieldErrors);
      return;
    }

    try {
      await changePassword(
        session?.user?.userid ?? "",
        validation.data.currentPassword,
        validation.data.newPassword
      );
      showSuccess("Password changed successfully");
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      showError(`Change password failed: ${extractErrorMessage(error)}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Profile</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b">
        <button
          onClick={() => setActiveTab('info')}
          className={`py-2 px-4 font-medium ${activeTab === 'info' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          Profile Info
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`py-2 px-4 font-medium ${activeTab === 'password' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          Change Password
        </button>
      </div>

      {/* Tab: Info */}
      {activeTab === 'info' && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {user?.avatar ? (
              <img
                src={user?.avatar}
                alt="Avatar"
                className="w-28 h-28 rounded-full border object-cover"
              />
            ) : (
              <div className="w-28 h-28 flex items-center justify-center bg-gray-100 rounded-full border">
                <UserCircle size={64} className="text-gray-400" />
              </div>
            )}

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                <User size={18} />
                <span>{user?.ufname} {user?.ulname}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Fingerprint size={16} />
                <span className="font-medium">ID:</span>
                <span>{user?.userid}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <BadgeInfo size={16} />
                <span className="font-medium">Username:</span>
                <span>{user?.username}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <Mail size={16} />
                <span className="font-medium">Email:</span>
                <span>{user?.email}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <ShieldCheck size={16} />
                <span className="font-medium">Role:</span>
                <span>{user?.rolenames}</span>
              </div>

              {/* <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
              >
                <Pencil size={16} />
                Edit Profile
              </button> */}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Change Password */}
      {activeTab === 'password' && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-bold mb-4">Change Password</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className={`mt-1 w-full border rounded px-3 py-2 text-sm ${passwordErrors.currentPassword ? 'border-red-500' : ''}`}
              />
              {passwordErrors.currentPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.currentPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className={`mt-1 w-full border rounded px-3 py-2 text-sm ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
              />
              {passwordErrors.newPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                name="confirmNewPassword"
                value={passwordForm.confirmNewPassword}
                onChange={handlePasswordChange}
                className={`mt-1 w-full border rounded px-3 py-2 text-sm ${passwordErrors.confirmNewPassword ? 'border-red-500' : ''}`}
              />
              {passwordErrors.confirmNewPassword && <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmNewPassword}</p>}
            </div>
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Change Password
            </button>
          </div>
        </div>
      )}

      {/* Modal: Edit Profile */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="ufname"
                  value={editForm.ufname}
                  onChange={handleInputChange}
                  className={`mt-1 w-full border rounded px-3 py-2 text-sm ${errors.ufname ? 'border-red-500' : ''}`}
                />
                {errors.ufname && <p className="text-red-500 text-sm mt-1">{errors.ufname}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="ulname"
                  value={editForm.ulname}
                  onChange={handleInputChange}
                  className={`mt-1 w-full border rounded px-3 py-2 text-sm ${errors.ulname ? 'border-red-500' : ''}`}
                />
                {errors.ulname && <p className="text-red-500 text-sm mt-1">{errors.ulname}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleInputChange}
                  className={`mt-1 w-full border rounded px-3 py-2 text-sm ${errors.email ? 'border-red-500' : ''}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
