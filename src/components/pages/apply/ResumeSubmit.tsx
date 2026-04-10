"use client";

import FONTS from "@/assets/fonts";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

const ResumeSubmit = ({
  props,
}: {
  props: { setStage: React.Dispatch<React.SetStateAction<number>> };
}) => {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    // check if files are selected
    if (!e.target.files || e.target.files.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1500)); // 1.5 seconds delay

    console.log("File uploaded:", e.target.files);

    setLoading(false); // stop loading
    props.setStage(2); // move to next stage
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-10 gap-10">
      <div className="max-w-[35rem] w-full text-center">
        <h2
          className={`text-3xl ${FONTS.microgrammaBold.className} text-[#074139] mb-8`}
        >
          Upload your resume...
        </h2>

        <label
          htmlFor="resume"
          className="w-full flex flex-col items-center justify-center border-2 border-dashed border-[#074139] rounded-lg p-12 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        >
          <svg
            width="101"
            height="100"
            viewBox="0 0 101 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mb-4"
          >
            <path
              d="M59.6094 11.4727V26.456C59.6094 28.4852 60.4177 30.4352 61.8594 31.8727C63.3047 33.3117 65.2615 34.1193 67.301 34.1185H84.4885"
              stroke="#B4B3B3"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M84.875 35.7009V71.4009C84.7923 73.736 84.2482 76.0317 83.2742 78.1556C82.3003 80.2795 80.9156 82.1896 79.2 83.7759C77.483 85.3696 75.4688 86.6093 73.2726 87.4244C71.0763 88.2394 68.741 88.6137 66.4 88.5259H34.775C32.4197 88.6336 30.0664 88.2753 27.8499 87.4716C25.6334 86.6679 23.5973 85.4347 21.8583 83.8426C20.1261 82.252 18.7273 80.333 17.743 78.1972C16.7588 76.0613 16.2088 73.7512 16.125 71.4009V28.5926C16.2077 26.2575 16.7518 23.9618 17.7257 21.8379C18.6997 19.714 20.0844 17.8039 21.8 16.2176C23.517 14.6239 25.5312 13.3842 27.7274 12.5692C29.9237 11.7541 32.259 11.3798 34.6 11.4676H58.4083C62.0428 11.4548 65.5511 12.7995 68.2458 15.2384L80.5792 26.5801C81.8952 27.7138 82.9579 29.1118 83.698 30.6832C84.4382 32.2546 84.8392 33.9643 84.875 35.7009Z"
              stroke="#B4B3B3"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M50.5 43.7461V71.9711"
              stroke="#B4B3B3"
              strokeWidth="2.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
            />
            <path
              d="M63.4419 55.6256L52.3378 44.5214C52.0975 44.2783 51.8114 44.0852 51.4959 43.9535C51.1805 43.8217 50.8421 43.7539 50.5003 43.7539C50.1584 43.7539 49.82 43.8217 49.5046 43.9535C49.1892 44.0852 48.903 44.2783 48.6628 44.5214L37.5586 55.6297"
              stroke="#B4B3B3"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="text-[#020303] text-sm">
            Drag and drop your{" "}
            <span className={`${FONTS.microgrammaBold.className}`}>resume</span>{" "}
            (PDF or Word document) into this box or click to select a file to
            upload.
          </p>
          <Input
            id="resume"
            type="file"
            className="hidden"
            onChange={(e) => handleChange(e)}
          />
        </label>
      </div>
    </div>
  );
};

export default ResumeSubmit;
