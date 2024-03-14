"use client";
import { useEffect } from "react";
import Comparator from "./comparator/page";
import { RemoveAccount } from "@/lib/fetch";

export default function Home() {
  useEffect(() => {
    RemoveAccount().then((data) => {
      console.log(data);
    });
  }, []);
  return (
    <>
      <Comparator />
    </>
  );
}
