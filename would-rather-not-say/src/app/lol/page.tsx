"use client";

import MenuScreen from "@/components/menu-screen";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const LolPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const message = searchParams.get("message"); // Retrieve the message

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/"); // Redirect to main page after 5 seconds
    }, 5000);

    return () => clearTimeout(timer); // Cleanup in case component unmounts
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <MenuScreen buttonTitle={`Good job player ${message}`} />

      {/* <h1 className="text-2xl font-bold">Le gagnant c'est</h1>
      <p className="mt-2">Good job player {message}</p>
      <p className="mt-4 text-sm text-gray-500">Redirection en 5 secondes...</p> */}
    </div>
  );
};

export default LolPage;
