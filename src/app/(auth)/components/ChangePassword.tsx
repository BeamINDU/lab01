"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Nunito } from "next/font/google";
import Image from "next/image";
import { z } from "zod";
import { changePassword } from "@/app/libs/services/user-permissions";
import { Session } from "inspector/promises";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmNewPassword?: string;
  }>({});

  const passwordSchema = z
    .object({
      currentPassword: z.string().min(1, "Current password is required."),
      newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters long.")
        .regex(/[A-Z]/, "New password must contain at least one uppercase letter.")
        .regex(/[0-9]/, "New password must contain at least one number.")
        .regex(/[^a-zA-Z0-9]/, "New password must contain at least one special character."),
      confirmNewPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Passwords do not match.",
      path: ["confirmNewPassword"],
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setMessage(null);
    setFieldErrors({}); // reset field errors

    const formData = {
      currentPassword,
      newPassword,
      confirmNewPassword,
    };

    try {
      passwordSchema.parse(formData);
      // ถ้า validate ผ่าน
      setMessage("Password changed successfully.");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: { [key: string]: string } = {};
        err.errors.forEach((e) => {
          const field = e.path[0];
          if (typeof field === "string") {
            errors[field] = e.message;
          }
        });
        setFieldErrors(errors);
      } else {
        setError("Failed to change password. Please try again.");
      }
    }
  };

  const handleBackToLogin = () => {
    router.push("/login");
  };

  return (
    <div className={`min-h-screen bg-white flex items-center justify-center px-4 ${nunito.className}`}>
      <div className="flex flex-col lg:flex-row bg-gray-100 shadow-lg rounded-lg overflow-hidden w-full max-w-5xl">
        {/* Left section */}
        <div className="w-full lg:w-2/5 p-6 sm:p-10">
          <div className="flex items-center mb-10">
            <Image
              src="/images/logo-login.png"
              alt="Logo"
              width={70}
              height={70}
              className="object-contain"
            />
            <div className="ml-2">
              <h1 className="text-2xl font-bold text-black">Change Password</h1>
            </div>
          </div>

          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-black text-sm font-medium mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {fieldErrors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.currentPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-black text-sm font-medium mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {fieldErrors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.newPassword}</p>
              )}
            </div>

            <div>
              <label className="block text-black text-sm font-medium mb-1">Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {fieldErrors.confirmNewPassword && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmNewPassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#0369A1] text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600"
            >
              Change Password
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleBackToLogin}
              className="text-sm text-blue-500 hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>

        {/* Right image section */}
        <div className="hidden lg:block relative w-full lg:w-3/5">
          <Image
            src="/images/takumi-pic.png"
            alt="Change Password Background"
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-20 text-white p-4 rounded-lg shadow-lg max-w-md text-xs leading-5">
            {/* <h1 className="text-lg font-bold mb-2">TAKUMI <span className="text-sm font-normal">(RAG)</span></h1> */}
            <p className="text-justify">
              {/* &emsp;เหมาะสำหรับธุรกิจเกี่ยวกับการผลิต โลจิสติกส์ และการเงิน <br />
              ด้วยความสามารถในการเลือกโมดูลตามความต้องการสำหรับอุตสาหกรรมการผลิต <br />
              ได้แก่ฟีเจอร์การตรวจจับความผิดพลาด แจ้งเตือนการบำรุงรักษา <br />
              การตรวจสอบคุณภาพโดยภาพและเสียง สำหรับธุรกิจโลจิสติกส์ ได้แก่ <br />
              การแนะนำการจัดวางสินค้าในพาเลท <br />
              และฟังก์ชันการพยากรณ์การขายและการวางบิลสำหรับธุรกิจการเงิน */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
