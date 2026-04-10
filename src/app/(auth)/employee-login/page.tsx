import FONTS from "@/assets/fonts";
import RightArrowIcon from "@/components/shared/icons/RightArrowIcon";
import WhiteLogo from "@/components/shared/logo/WhiteLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmployeeLogin() {
  return (
    <div className="grid grid-cols-[2.5fr_2fr] w-full h-screen">
      <div className="bg-primary flex items-center justify-center">
        <div className="text-white text-center flex items-center gap-6 flex-col justify-center">
          <div className="mb-10">
            <WhiteLogo />
          </div>
          <h1 className={`${FONTS.microgrammaBold.className} text-4xl`}>
            Obrive Employee Portal
          </h1>
          <p className="text-xl w-3xl">
            Your secure gateway to company resources, project updates, and
            collaboration tools. Please log in with your authorised employee
            credentials.
          </p>
        </div>
      </div>

      <div className="bg-accent flex flex-col items-center justify-center gap-30">
        <div>
          <h1
            className={`${FONTS.microgrammaBold.className} text-4xl uppercase`}
          >
            WELCOME OTTERS{" "}
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
          <div className="text-left mt-20">
            <p>
              Don't have an account? <br /> yet email?
            </p>
            <span
              className={`${FONTS.microgrammaBold.className} text-primary uppercase flex items-center gap-2`}
            >
              Hr@obrive.com <RightArrowIcon />{" "}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
