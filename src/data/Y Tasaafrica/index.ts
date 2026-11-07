import tasaForCreativesData from "./tasaForCreatives.json";
import tasaForStudentsData from "./tasaForStudents.json";
import tasaForArtisansData from "./tasaForArtisans.json";
import { tasaForIndustries } from "./tasaForIndustries";
import type { WhyChooseTasaData } from "./types";

export const tasaForCreatives: WhyChooseTasaData = tasaForCreativesData as WhyChooseTasaData;
export const tasaForStudents: WhyChooseTasaData = tasaForStudentsData as WhyChooseTasaData;
export const tasaForArtisans: WhyChooseTasaData = tasaForArtisansData as WhyChooseTasaData;
export { tasaForIndustries };

export * from "./types";

