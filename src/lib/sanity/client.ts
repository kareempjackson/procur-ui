import { createClient } from "next-sanity";
import {
  apiVersion,
  dataset,
  projectId,
  useCdn,
  assertSanityEnv,
} from "./config";

export const sanityClient = createClient({
  projectId: projectId || "placeholder",
  dataset: dataset || "production",
  apiVersion,
  useCdn,
  perspective: "published",
  stega: false,
  // token only needed for private datasets or draft previews
});
