"use client";
import FONTS from "@/assets/fonts";
import CustomToast from "@/components/pages/resources/components/Toast";
import { useRouter } from "next/navigation";
import WhiteLogo from "@/components/shared/logo/WhiteLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiFetch } from "@/lib/api";
import React from "react";

export default function ClientLogin() {
 const [loading , setLoading] = React.useState(false);
 const [clientId, setClientId] = React.useState(""); //client email can be considerd as clientId for login
 const router = useRouter(); 
 const[showToast, setShowToast] = React.useState(false);
 const [password, setPassword] = React.useState("");
 const [error, setError] = React.useState("");

const handleLogin = async () => {
  try {
    setLoading(true);
    setError("");

    // Add validation before sending
    // if (!clientId.trim()) {
    //   setError("Please enter your Client ID");
    //   setLoading(false);
    //   return;
    // }

    // if (!password.trim()) {
    //   setError("Please enter your password");
    //   setLoading(false);
    //   return;
    // }

    console.log('Sending:', { clientId, password });

    const res = await apiFetch("/auth/client/login", { 
      method: "POST",
      body: JSON.stringify({
        clientId: clientId.trim(),
        password: password.trim(),
        // clientId,
        // password,
      }),
    });

    const data = await res.json();
    console.log('Response:', data);

    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data?.data?.accessToken) {
      localStorage.setItem('token', data.data.accessToken);
    }

    if (data?.data?.client) {
      localStorage.setItem('user', JSON.stringify(data.data.client));
      router.push('/dashboard/client');
    }

    setShowToast(true);
  } catch (err: any) {
    setError(err.message || 'Login failed');
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

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                placeholder="Type your Password"
                className="border mt-2 py-6 border-primary outline-none"
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

{error && (
  <div className="text-red-600 text-sm mt-2">{error}</div>
)}

          </form>
        </div>
        </div>
       {showToast && <CustomToast show={showToast} message={"Login successful!"} />}
      </div>
  );
}




