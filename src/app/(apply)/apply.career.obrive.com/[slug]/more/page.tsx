"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResumeSubmit from "@/components/pages/apply/ResumeSubmit";
import AboutYou from "@/components/pages/apply/AboutYou";
import MoreDetails from "@/components/pages/apply/MoreDetails";
import VideoRecord from "@/components/pages/apply/Video_record";
import FinalPage from "@/components/pages/apply/FinalPage";

const page = () => {
  const [stage, setStage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    if (stage > 14) {
      alert(
        "Thank you for completing the application! We will be in touch soon."
      );
      router.push("/");
    }
  }, [stage, router]);

  return (
    <div>
      {stage === 1 && <ResumeSubmit props={{ setStage }} />}
      {stage === 2 && <AboutYou props={{ setStage }} />}
      {stage === 3 && (
        <MoreDetails
          setStage={setStage}
          props={{ title: "I prefer working alone in a quiet environment." }}
        />
      )}
      {stage === 4 && (
        <MoreDetails
          setStage={setStage}
          props={{
            title: "I love going to happy hour with my colleagues after work.",
          }}
        />
      )}
      {stage === 5 && (
        <MoreDetails
          setStage={setStage}
          props={{ title: "I can easily find where others made mistakes." }}
        />
      )}
      {stage === 6 && (
        <MoreDetails
          setStage={setStage}
          props={{ title: "I find it easy to trust those around me." }}
        />
      )}
      {stage === 7 && (
        <MoreDetails
          setStage={setStage}
          props={{
            title: "I plan everything I do. I like following clear steps.",
          }}
        />
      )}
      {stage === 8 && (
        <MoreDetails
          setStage={setStage}
          props={{ title: "I jump on an opportunity as soon as I see one." }}
        />
      )}
      {stage === 9 && (
        <MoreDetails
          setStage={setStage}
          props={{ title: "I have a very strong and active imagination." }}
        />
      )}
      {stage === 10 && (
        <MoreDetails
          setStage={setStage}
          props={{ title: "I like sticking to a consistent routine." }}
        />
      )}
      {stage === 11 && (
        <MoreDetails
          setStage={setStage}
          props={{
            title: "I can get anxious when things don't go according to plan.",
          }}
        />
      )}
      {stage === 12 && (
        <MoreDetails
          setStage={setStage}
          props={{
            title: "I have a very calm and relaxed attitude towards life.",
          }}
        />
      )}
      {stage === 13 && <VideoRecord props={{ setStage }} />}
      {stage === 14 && <FinalPage />}
    </div>
  );
};

export default page;
