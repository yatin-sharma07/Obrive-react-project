"use server";

import { getCareerBySlug } from "@/lib/mdx";

export async function callFunction(slug: string) {
  const career = await getCareerBySlug(slug);
  return career;
}
