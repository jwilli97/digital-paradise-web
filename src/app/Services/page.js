'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Services() {
    const router = useRouter();
    // link to youtube
    return (
        <div className="flex h-screen w-full flex-col items-center px-4 py-6 relative">
            <h1 className="text-xl text-white">SERVICES IN DEVELOPMENT</h1> 
            <Button onClick={() => router.push("/")}>
                Back
            </Button>
        </div>
    );
};