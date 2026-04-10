import DetailsPage from "@/components/pages/apply/Details";
import React from "react";

const page = async ({ params }: { params: { slug: string } }) => {
  return (
    <div>
      <DetailsPage params={params} />
    </div>
  );
};

export default page;
