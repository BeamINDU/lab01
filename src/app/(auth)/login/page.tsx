"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { signIn, useSession } from "next-auth/react";
import { Nunito } from "next/font/google";
import Image from "next/image";

const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function LoginPage() {
  // const { data: session } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid username or password");
    } else {
      router.push("/dashboard");
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const handleChangePassword = () => {
    router.push("/change-password");
  }

  return (
    <div className={`min-h-screen bg-white flex items-center justify-center px-4 ${nunito.className}`}>
      <div className="flex flex-col lg:flex-row bg-gray-100 shadow-lg rounded-lg overflow-hidden w-full max-w-5xl">
        {/* Left Panel */}
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
              <h1 className="text-2xl font-bold text-black">TAKUMI</h1>
              <p className="text-black text-sm font-semibold">(Product Inspection)</p>
            </div>
          </div>

          <p className="text-red-500 text-sm min-h-5 text-center mb-2">{error}</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-black text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-black text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end">
              {/* <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-500 hover:underline"
              >
                Forgot Password?
              </button> */}
            </div>
            <button
              type="submit"
              className="bg-[#0369A1] text-white py-2 px-4 rounded-lg w-full hover:bg-blue-600"
            >
              Login
            </button>
          </form>
        </div>

        {/* Right Panel */}
        <div className="hidden lg:block relative w-full lg:w-3/5">
          <Image
            src="/images/takumi-pic.png"
            alt="Login Background"
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-20 text-white p-4 rounded-lg shadow-lg max-w-md text-xs leading-5">
            {/* Content placeholder */}
            {/* <h1 className="text-lg font-bold mb-2">TAKUMI (RAG)</h1>
            <p>
              เหมาะสำหรับธุรกิจเกี่ยวกับการผลิต โลจิสติกส์ และการเงิน...
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
