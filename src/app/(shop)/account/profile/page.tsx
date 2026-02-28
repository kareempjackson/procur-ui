import { Metadata } from "next";
import ProfileClient from "./ProfileClient";

export const metadata: Metadata = {
  title: "Profile Settings · Procur",
  description: "Manage your buyer profile and account settings.",
  openGraph: {
    title: "Profile Settings · Procur",
    description: "Manage your buyer profile and account settings.",
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
