"use client";
import { useEffect, useState } from "react";
import Comparator from "./comparator/page";
import { CheckLoginAPI, RemoveAccount } from "@/lib/fetch";

export default function Home() {
  useEffect(() => {
    RemoveAccount().then((data) => {
      console.log(data);
      console.log("this is running");
    });
    // CheckLoginAPI().then((data) => {
    //   console.log(data);
    //   setLogin(data?.data)
    // });
  }, []);
  const [isLogin, setLogin] = useState(false);
  return (
    <>
    <Comparator/>
    </>
  );
}
