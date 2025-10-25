import { createClient } from "next-sanity";
import {
  apiVersion,
  dataset,
  projectId,
  useCdn,
  assertSanityEnv,
} from "./config";

assertSanityEnv();

export const sanityClient = createClient({
  projectId: projectId!,
  dataset: dataset!,
  apiVersion,
  useCdn,
  perspective: "published",
  stega: false,
  token: process.env.SANITY_READ_TOKEN, // optional, only needed for draft/private content
});
