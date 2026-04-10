import FONTS from "@/assets/fonts";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

const AboutYou = ({
  props,
}: {
  props: { setStage: React.Dispatch<React.SetStateAction<number>> };
}) => {
  const [loading, setLoading] = useState(false);

  const handleChange = async () => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500)); // 0.5 second delay

    setLoading(false); // stop loading
    props.setStage(3); // move to next stage
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <section className="max-w-2xl space-y-12">
        <div>
          <h2
            className={`text-2xl ${FONTS.microgrammaBold.className} text-[#074139]`}
          >
            A Few Things About You...
          </h2>
          <p className="mt-4 text-sm text-gray-700">
            Let’s begin by getting to know you better. For each statement,
            simply select how much you agree or disagree. Don’t worry—there are
            only 10!
          </p>
        </div>

        <div>
          <h3
            className={`text-xl ${FONTS.microgrammaBold.className} text-[#074139]`}
          >
            Why do I need to do this?
          </h3>
          <p className="mt-3 text-sm text-gray-700">
            At{" "}
            <span className={`${FONTS.microgrammaBold.className}`}>Obrive</span>{" "}
            Industries, we want to ensure you’ll feel at home in our culture and
            thrive as part of our team. This also helps us understand your
            strengths, passions, and working style so we can place you in a role
            where you’ll truly shine.
          </p>
        </div>

        <div className="pt-3">
          <Button
            onClick={() => handleChange()}
            size={"lg"}
            className={`${FONTS.microgrammaBold.className} cursor-pointer`}
          >
            I Am Ready
          </Button>
        </div>
      </section>
    </main>
  );
};

export default AboutYou;
