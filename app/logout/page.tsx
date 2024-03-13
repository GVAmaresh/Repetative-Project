"use client";
import { RemoveAccount } from "@/lib/fetch";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    RemoveAccount()
      .then((data) => {
        if (data.success) {
          alert("Log out Successfully");
          router.push("/");
        } else {
          alert("Failed to log out. Please try again.");
        }
      })
      .catch((error) => {
        alert("An error occurred while logging out. Please try again later.");
      });
  }, [router]);

  return <>Logging out...</>;
}
