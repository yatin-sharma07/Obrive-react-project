"use client";

import FONTS from "@/assets/fonts";

export default function FinalPage() {
  return (
    <main
      className={`min-h-screen  flex flex-col items-center justify-center bg-white text-center px-6`}
    >
      {/* Main Content */}
      <section className="max-w-3xl">
        <h1 className={`text-2xl md:text-3xl ${FONTS.microgrammaBold.className} font-semibold text-[#074139] mb-6`}>
          Thank You for Interviewing with Obrive Industries
        </h1>

        <p
          className={`text-[#074139] ${FONTS.microgrammaBold.className} font-light leading-relaxed mb-4`}
        >
          We truly appreciate the time you took to meet with us and share your
          experiences, ideas, and vision. At Obrive, we believe every
          conversation is a step toward shaping the future of immersive
          technology, and we’re excited about the possibility of having you on
          this journey with us.
        </p>

        <p
          className={`text-[#074139] ${FONTS.microgrammaBold.className} font-light leading-relaxed mb-4`}
        >
          Our team will carefully review your interview and get back to you soon
          with next steps. In the meantime, thank you again for considering
          Obrive as the place to grow your career and make an impact in AR, VR,
          MR, 3D Design, and Spatial Computing.
        </p>

        <p className={`text-[#074139] ${FONTS.microgrammaBold.className} font-light mt-6`}>
          Together, let’s build the future of immersive experiences.
        </p>
      </section>
    </main>
  );
}
