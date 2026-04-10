import FONTS from "@/assets/fonts";
import FullWidthSection from "@/components/shared/layout/FullWidthSection";

const BlogsHero = () => {
  return (
    <section>
      <FullWidthSection backgroundColor="none" className="py-10 pt-30">
        <div className="text-center flex flex-col items-center gap-8">
          <h1
            className={`${FONTS.microgrammaBold.className} text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-secondary`}
          >
            OB Resource Library
          </h1>
          <p className="text-sm sm:text-base text-center max-w-3xl px-4 font-medium">
            Stay ahead in the world of AR, VR, MR, and Spatial Computin with
            Obrive’s knowledge hub. Explore insightful blogs, industry updates,
            and expert resources designed to help you innovate, adapt, and lead
            with confidence in the immersive technology landscape.
          </p>
        </div>
      </FullWidthSection>
    </section>
  );
};

export default BlogsHero;
