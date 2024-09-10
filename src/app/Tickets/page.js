'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Update for every show
const showInfo = {
  title: "Live Studio Recording - June 2023",
  date: "June 15, 2023",
  time: "7:00 PM",
  venue: "Studio 54, New York City",
  image: "/placeholder.svg?height=400&width=600",
  ticketPrice: 20,
}

export default function Component() {
  const [numTickets, setNumTickets] = useState(1)
  const [guests, setGuests] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("")
  const router = useRouter();

  const handleNumTicketsChange = (value) => {
    const num = parseInt(value, 10)
    setNumTickets(num)
    setGuests(Array(Math.max(0, num - 1)).fill({ firstName: '', lastName: '' }))
  }

  const handleGuestChange = (index, field, value) => {
    const newGuests = [...guests]
    newGuests[index] = { ...newGuests[index], [field]: value }
    setGuests(newGuests)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: send data to backend here (supabase?)
    console.log("Form submitted")
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl mx-auto bg-slate-200 text-card-foreground shadow-xl overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-6">
          <CardTitle className="text-2xl font-bold">{showInfo.title}</CardTitle>
          <CardDescription className="mt-2">
            Date: {showInfo.date} | Time: {showInfo.time} | Venue: {showInfo.venue}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="aspect-video overflow-hidden rounded-lg">
            <img
              alt="Studio Recording"
              className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-300"
              height="400"
              src={showInfo.image}
              style={{
                aspectRatio: "600/400",
                objectFit: "cover",
              }}
              width="600"
            />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</Label>
                <Input 
                  id="firstName" 
                  required 
                  className="bg-background border-input text-foreground" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</Label>
                <Input 
                  id="lastName" 
                  required 
                  className="bg-background border-input text-foreground" 
                />
              </div>
            </div>
            <div>
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                <Input 
                  id="email" 
                  required 
                  className="bg-background border-input text-foreground" 
                />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numTickets" className="text-sm font-medium text-foreground">Number of Tickets</Label>
              <Select onValueChange={handleNumTicketsChange}>
                <SelectTrigger id="numTickets" className="bg-background border-input text-foreground">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-background border-input text-foreground">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()} className="hover:bg-muted">
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {guests.map((guest, index) => (
              <div key={index} className="space-y-4 bg-muted p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-muted-foreground">Guest {index + 1}</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`guestFirstName${index}`} className="text-sm font-medium">First Name</Label>
                    <Input
                      id={`guestFirstName${index}`}
                      value={guest.firstName}
                      onChange={(e) => handleGuestChange(index, 'firstName', e.target.value)}
                      required
                      className="bg-input text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`guestLastName${index}`} className="text-sm font-medium">Last Name</Label>
                    <Input
                      id={`guestLastName${index}`}
                      value={guest.lastName}
                      onChange={(e) => handleGuestChange(index, 'lastName', e.target.value)}
                      required
                      className="bg-input text-foreground"
                    />
                  </div>
                </div>
              </div>
            ))}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Payment Method</Label>
              <RadioGroup onValueChange={setPaymentMethod} defaultValue='venmo' className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="venmo" id="venmo" />
                  <Label htmlFor="venmo">Venmo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cashapp" id="cashapp" />
                  <Label htmlFor="cashapp">Cash App</Label>
                </div>
              </RadioGroup>
            </div>
            {paymentMethod && (
              <div className="space-y-2">
                <Label htmlFor="paymentHandle" className="text-sm font-medium">
                  {paymentMethod === 'venmo' ? 'Venmo' : 'Cash App'} Handle
                </Label>
                <Input id="paymentHandle" required className="bg-background text-foreground" />
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter className="bg-secondary p-6">
          <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-2 px-4 rounded">
            Purchase Tickets (${showInfo.ticketPrice * numTickets})
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};