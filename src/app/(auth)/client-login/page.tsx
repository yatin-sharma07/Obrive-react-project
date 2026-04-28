"use client";
import FONTS from "@/assets/fonts";
import CustomToast from "@/components/pages/resources/components/Toast";

import WhiteLogo from "@/components/shared/logo/WhiteLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import React from "react";

export default function ClientLogin() {
  const [loading , setLoading] = React.useState(false);
 const [clientId, setClientId] = React.useState(""); 
 const[showToast, setShowToast] = React.useState(false);

const handleLogin = async () => {
  try {
    setLoading(true);

    const res = await apiFetch("/auth/client/login", {
      method: "POST",
      body: JSON.stringify({ clientId }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    // Save client info for the dashboard
    if (data?.data?.client) {
      localStorage.setItem('user', JSON.stringify({
        ...data.data.client,
        role: 'client'
      }));
    }
    if (data?.data?.accessToken) {
      localStorage.setItem('token', data.data.accessToken);
    }

    setShowToast(true);

   

     setTimeout(() => {
      window.location.href = "/client/dashboard";
    }, 1500);

  } catch (err: any) {
    console.error(err.message);
    alert(err.message);
  } finally {
    setLoading(false);
    
  }
};
  return (
    <div className="grid grid-cols-[2.5fr_2fr] w-full h-screen">
      <div className="bg-primary flex items-center justify-center">
        <div className="text-white text-center flex items-center gap-6 flex-col justify-center">
          <div className="mb-10">
            <WhiteLogo />
          </div>
          <h1 className={`${FONTS.microgrammaBold.className} text-4xl`}>
            Welcome to the Obrive Client Portal
          </h1>
          <p className="text-xl w-3xl">
            Access your projects, reports, and collaboration tools in one secure
            place. Please log in with your authorised client credentials to
            continue.
          </p>
        </div>
      </div>

      <div className="bg-accent flex flex-col items-center justify-center gap-30">
        <div>
          <h1
            className={`${FONTS.microgrammaBold.className} text-4xl uppercase`}
          >
            WELCOME !
          </h1>
        </div>

        <div className="w-sm">
          <form className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">Unique Client Id</Label>
              <Input
                type="clientId"
                id="clientId"
                placeholder="Type your client Id "
                className="border mt-2 py-6 border-primary outline-none"
                value={clientId}
  onChange={(e) => setClientId(e.target.value)}
              />
            </div>
            

            <Button
              size="lg"
              type="button"
              className="cursor-pointer uppercase mt-6 w-fit text-accent text-xs px-10"
              onClick={handleLogin}
            >
             {loading?"Logging in...":"Log-in"}
            </Button>
          </form>
        </div>
        </div>
       {showToast && <CustomToast show={showToast} message={"Login successful!"} />}
      </div>
  );
}
