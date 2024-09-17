'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <div className="flex h-screen w-full flex-col items-center px-4 py-6 relative">
        <div className="flex gap-2 py-2 px-2 mt-16">
          <Avatar className="w-36 h-36">
            <AvatarImage src="/dpm_white_logo.png" alt="Digital Paradise Media" />
            <AvatarFallback>DP</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col space-y-12 py-2 px-2 mt-8">
          <div>
            <Button className="bg-transparent" onClick={() => router.push("/Services")}>
              <Image src="/services_button.jpeg" alt="Services" width={400} height={400} />
            </Button>
          </div>
          <div>
            <Button className="bg-transparent" onClick={() => router.push("/About")}>
            <Image src="/about_button.jpeg" alt="Services" width={400} height={400} />
            </Button>
          </div>
          <div>
            <Button className="bg-transparent" onClick={() => router.push("/Tickets")}>
            <Image src="/ticketing_button.jpeg" alt="Services" width={400} height={400} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}