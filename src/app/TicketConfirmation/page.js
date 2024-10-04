'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { CheckCircle, Mail } from "lucide-react";

export default function TicketConfirmation() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <Card className="w-full max-w-2xl overflow-hidden">
                <div 
                    className="relative bg-cover bg-center h-96" 
                    style={{ backgroundImage: "url('/cuero_confirmation.jpeg')" }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    <CardHeader className="relative z-10 h-full flex flex-col justify-center items-center text-white">
                        <div className="flex justify-center mb-6">
                            <CheckCircle className="h-16 w-16 text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4 text-center">Thank You for Your Purchase!</h1>
                        <p className="text-xl mb-6 text-center">
                            You will receive an email containing your tickets once we have confirmed your payment.
                        </p>
                    </CardHeader>
                </div>
                <CardContent className="bg-white p-6">
                    <div className="flex justify-center items-center">
                        <Mail className="h-6 w-6 text-blue-500 mr-2" />
                        <p className="text-sm text-gray-600">Check your inbox soon</p>
                    </div>
                </CardContent>
                <CardFooter className="bg-white flex justify-center p-6">
                    <Button variant="outline">Return to Home</Button>
                </CardFooter>
            </Card>
        </div>
    );
};