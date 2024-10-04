'use client';

import { CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Component() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "/cuero_confirmation.jpg" }}>
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white p-8 max-w-md">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
        <p className="text-xl mb-6">
          You will receive an email containing your tickets once we've confirmed your payment.
        </p>
        <div className="flex justify-center items-center mb-8">
          <Mail className="h-6 w-6 text-blue-300 mr-2" />
          <p className="text-sm">Check your inbox soon</p>
        </div>
        <Button variant="outline" className="text-black border-white hover:bg-white hover:text-black transition-colors">
          Return to Home
        </Button>
      </div>
    </div>
  );
};