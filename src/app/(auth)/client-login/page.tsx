import FONTS from "@/assets/fonts";
import RightArrowIcon from "@/components/shared/icons/RightArrowIcon";
import WhiteLogo from "@/components/shared/logo/WhiteLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ClientLogin() {
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
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                placeholder="Type your Email Address"
                className="border mt-2 py-6 border-primary outline-none"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
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
            >
              Log-In
            </Button>
          </form>
        </div>
        </div>
      </div>
  );
}
