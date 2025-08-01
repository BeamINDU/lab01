"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Nunito } from "next/font/google";
import Image from "next/image";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      // Simulated API call
      setMessage("Password reset link has been sent to your email.");
      setError(null);
    } catch (error) {
      setError("Failed to send password reset link. Please try again.");
      setMessage(null);
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
              <h1 className="text-2xl font-bold text-black">Forgot Password</h1>
            </div>
          </div>

          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-black text-sm font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="bg-[#0369A1] text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600"
            >
              Send Reset Link
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

        {/* Right section (image) */}
        <div className="hidden lg:block relative w-full lg:w-3/5">
          <Image
            src="/images/takumi-pic.png"
            alt="Forgot Password Background"
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
