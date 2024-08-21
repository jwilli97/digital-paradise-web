'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <div className="flex h-screen w-full flex-col items-center px-4 py-6 relative">
        <div className="flex gap-2 py-2 px-2 mt-16"> 
          <Avatar className="w-24 h-24">
            <AvatarImage src="/logo.jpg" alt="Digital Paradise Media" />
            <AvatarFallback>DP</AvatarFallback>
          </Avatar>
        </div>
        <h1 className="text-xl text-white">DIGITAL PARADISE MEDIA</h1>
        <div className="flex gap-2 py-2 px-2">
          <div>
            <Button onClick={() => router.push("/Services")}>
              Services
            </Button>
          </div>
          <div>
            <Button onClick={() => router.push("/About")}>
              About
            </Button>
          </div>
          <div>
            <Button onClick={() => router.push("/Tickets")}>
              Tickets
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}