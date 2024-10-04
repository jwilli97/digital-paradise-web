'use client';

import { CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default function Component() {
    const router = useRouter();

  return (
    <div className="flex justify-center mt-24">
      <div 
        className="relative w-full max-w-2xl h-[800px] bg-cover bg-center"
        style={{ backgroundImage: "url('/cuero_confirmation.jpeg')" }}
      >
        <div className="absolute inset-0"></div>
        <Card className="absolute inset-0 bg-transparent shadow-none flex flex-col mt-52">
          <CardHeader className="relative z-10 flex flex-col items-center text-white">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-400" />
            </div>
            <h1 className="text-black font-bold mb-4 text-center">Thank You for Your Purchase!</h1>
            <p className="text-black text-center">
              You will receive an email containing your <br></br>tickets once we&apos;ve confirmed your payment.
            </p>
            <p className="text-blue-500 mt-3">Venmo - <Link href={'https://venmo.com/u/digitalparadisemedia'}>@digitalparadisemedia</Link></p>
            <p className="text-blue-500">CashApp - <Link href={'https://cash.app/$digitalparadisemedia'}>$digitalparadisemedia</Link></p>
          </CardHeader>
          <CardFooter className="relative z-10 flex justify-center pb-10">
            <Button variant="outline" onClick={() => router.push('/')} className="bg-black bg-opacity-20 text-black border-white hover:bg-white hover:text-black transition-colors">
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};