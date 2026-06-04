"use client"; // Required in Next.js App Router for states and scroll events

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { API_BASE_URL } from "@/lib/api";
import { useCurrentUser } from "@/hooks/useCurrentUser";

import Image from "next/image";

const CommunityPage = () => {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const { me, loading: userLoading, refetch } = useCurrentUser();

// avatars

// Initialize with an empty array to match server-side rendering
const [avatarData, setAvatarData] = useState<any[]>([]);

useEffect(() => {
  setAvatarData(
    Array.from({ length: 30 }, (_, index) => ({
      id      : index,
      image   : `https://randomuser.me/api/portraits/${ index % 2 === 0 ? "men" : "women" }/${(index % 50) + 1}.jpg`,
      x       : Math.random() * 100,
      y       : Math.random() * 100,
      size    : 40 + Math.random() * 80,
      blur    : Math.random() * 4,
      opacity : 0.3 + Math.random() * 0.7,
      z       : Math.floor(Math.random() * 20),
      rotation: -25 + Math.random() * 50,
      duration: 15 + Math.random() * 20,
      delay   : Math.random() * 5, // Shorter delay so they bounce in quickly
    }))
  );
}, []);

// Handle login form if not logged in and trying to access rooms page -----------------------------------

  const handleLogin = async () => {
    try {
      setSubmitting(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST", 
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Login failed");
      }

      if (data?.data?.accessToken) {
        localStorage.setItem("token", data.data.accessToken);
        localStorage.setItem("accessToken", data.data.accessToken);
      }

      if (data?.data?.user) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      // refresh client user cache so other hooks/pages read the up-to-date user
      try {
        await refetch();
      } catch (e) {
        // ignore errors refreshing user cache
      }

      router.push("/community/rooms");
    } catch (loginError: any) {
      setError(loginError?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };


// Scroll event listener to trigger animations -------------------------------------------------------

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      
      // Permanently lock the trigger if scrolled past 400px
      if (currentScroll > 400) {
        setHasTriggered(true);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



// Component -------------------------------------------------------------------------------------------


  return (
    <div className="font-sans text-gray-950 min-h-screen relative w-full">


<div className="fixed inset-0 z-10 pointer-events-none">
  {avatarData.map((avatar, index) => (
    <div
      key={index}
      className="absolute animate-bounce-in"
      style={{
        left: `${avatar.x}vw`,
        top: `${avatar.y}vh`,
        zIndex: avatar.z,
        // Stagger the bounce-in entry based on their random delay
        animationDelay: `${avatar.delay * 0.2}s`, 
        animationFillMode: "both",
      }}
    >
      <Image
        src={avatar.image}
        alt=""
        width={50}
        height={50}
        className="rounded-full object-cover border-2 border-amber-100 shadow-xl"
        style={{
          width: `${avatar.size}px`,
          height: `${avatar.size}px`,
          filter: `blur(${avatar.blur}px)`,
          opacity: avatar.opacity,
          transform: `rotate(${avatar.rotation}deg)`,
          animation: `floatAvatar ${avatar.duration}s ease-in-out ${avatar.delay}s infinite`,
        }}
      />
    </div>
  ))}
</div>

      <header className="fixed top-0 left-0 w-full z-50 px-15 py-8 flex justify-between items-center bg-transparent pointer-events-auto">
        <div className="font-black tracking-tight text-xl">obrive.</div>
        <nav className="flex gap-6 text-sm font-medium">
          <a href="#" className="border-2 border-black px-5 py-3 rounded-full  hover:text-white hover:bg-black">explore</a>
        </nav>
      </header>
      
      {/* 1. FIXED SWAPPING TEXT CONTAINER */}
      <div className="fixed top-0 left-0 z-50 pointer-events-none flex h-screen w-screen flex-col items-center justify-center text-center overflow-hidden">
        <h1 className="text-4xl md:text-6xl font-black lowercase tracking-tight relative h-20 w-full flex items-center justify-center">
          
          {/* "community" - Staggered exit animation */}
          <span className="absolute flex">
            {"Community".split("").map((char, index) => (
              <span
                key={`comm-${index}`}
                style={{ transitionDelay: `${index * 30}ms` }}
                className={`inline-block text-8xl transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  hasTriggered
                    ? "opacity-0 -translate-y-16 rotate-12 blur-sm scale-75"
                    : "opacity-100 translate-y-0 rotate-0 scale-100"
                }`}
              >
                {char}
              </span>
            ))}
          </span>

          {/* "hi" - Staggered entry animation */}
          <span className="absolute flex">
            {"hi, join us in our journey".split("").map((char, index) => (
              <span
                key={`hi-${index}`}
                style={{ transitionDelay: `${index * 15}ms` }}
                className={`inline-block transition-all duration-600 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${ hasTriggered ? "opacity-100 translate-y-0 rotate-0 scale-100" : "opacity-0 translate-y-16 -rotate-12 blur-sm scale-75"}`}>
                {char === " " ? "\u00A0" : char}
              </span>
            ))}

          </span>

        </h1>
        

        <div style={{ transitionDelay: '300ms' }} className={`mt-4 pointer-events-auto transition-all duration-750 ease-out ${ hasTriggered  ? "opacity-100 translate-y-0 blur-none scale-100"  : "opacity-0 translate-y-8 blur-sm scale-95"  }`}>
            <button
              type="button"
              className="px-6 py-3 bg-white hover:text-white hover:bg-black text-[#076d47] font-bold rounded-full shadow-lg hover:bg-opacity-90 active:scale-95 transition-transform cursor-pointer"
              onClick={() => {
                if (me) {
                  router.push("/community/rooms");
                  return;
                }

                if (userLoading) {
                  // still resolving; show dialog to allow login
                  setShowLoginDialog(true);
                  return;
                }

                setShowLoginDialog(true);
              }}
            >
              get started
            </button>
        </div>

        {showLoginDialog ? (
          <div className="pointer-events-auto fixed inset-0 z-60 flex items-center justify-center bg-black/55 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] border border-black/10 bg-white p-6 text-left shadow-[0_30px_80px_rgba(0,0,0,0.22)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex rounded-full border border-[#076d47]/15 bg-[#076d47]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#076d47]">
                    Login required
                  </div>
                  <h2 className="mt-4 text-2xl font-black tracking-tight text-gray-950">
                    Sign in to continue
                  </h2>
                  <p className="mt-2 text-sm font-medium leading-6 text-gray-600">
                    Enter your email and password to 
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Close login dialog"
                  onClick={() => setShowLoginDialog(false)}
                  className="rounded-full border border-black/10 px-3 py-1 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 hover:text-gray-950"
                >
                  ×
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">Email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-gray-950 outline-none transition focus:border-[#076d47]"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-gray-700">Password</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleLogin();
                      }
                    }}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-gray-950 outline-none transition focus:border-[#076d47]"
                  />
                </label>

                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <div className="flex items-center gap-3 pt-1">
                  <button
                    type="button"
                    onClick={handleLogin}
                    disabled={submitting}
                    className="inline-flex flex-1 items-center justify-center rounded-full bg-[#076d47] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#055c3c] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting ? "Logging in..." : "Login and continue"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowLoginDialog(false)}
                    className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        
      </div>

      {/* 2. SCREEN 1: First Screen (Eggshell White Background) */}
      <div className="h-screen w-full bg-[#effbf0] flex flex-col justify-center items-center fixed top-0 left-0 z-0">
        <p className="text-sm mt-32 text-gray-400 animate-bounce">
          scroll down ↓
        </p>
      </div>

      {/* 3. SCROLL SPACER: Creates physical layout space so the page can scroll */}
      <div className="h-screen w-full pointer-events-none invisible"></div>

      {/* 4. SCREEN 2: Second Screen (Green Background) */}
      <div className="h-screen w-full bg-[#076d47] z-10 flex flex-col justify-center items-center relative">
        {/* <h1 className="text-4xl md:text-6xl font-black lowercase tracking-tight text-center px-4 text-white">
          join live voice chats
        </h1> */}
      </div>



        <footer className="items-center flex justify-between bottom-0 left-0 text-[10px] text-black font-bold flex-row bg-transparent  border-black fixed z-100 h-16  w-full px-10 py-10  sm:flex-row gap-4  pointer-events-auto">

          <div className="flex gap-6 right-0">
            <a href="#" className="hover:text-gray-700 transition-colors text-black text-[12px] font-bold ">terms</a>
            <a href="#" className="hover:text-gray-700 transition-colors text-black text-[12px] font-bold">privacy policy</a>
            <a href="#" className="hover:text-gray-700 transition-colors text-black text-[12px] font-bold">contact</a>
          </div>

          <div  className="flex gap-6 left-0">© 2026 obrive inc. all rights reserved.</div>


        </footer>

    </div>
  );
};

export default CommunityPage;