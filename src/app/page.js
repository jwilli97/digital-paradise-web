'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle, } from "@/components/ui/alert"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Update for every show
const showInfo = {
  title: "Curevo @ Electric Lounge",
  date: "October 18, 2024",
  time: "6:00 PM",
  image: "/Cuervo_Long.jpg",
  ticketPrice: 20,
};

export default function Tickets() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [paymentHandle, setPaymentHandle] = useState('');
  const [numTickets, setNumTickets] = useState(1);
  const [guests, setGuests] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isSubmitting, setIsSubmitting] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors ] = useState('');
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    if (!paymentMethod) newErrors.paymentMethod = "Payment method is required";
    if (paymentMethod && !paymentHandle) newErrors.paymentHandle = "Payment handle is required";
    if (!acceptTerms) newErrors.terms = "Please read and check this box to continue";
    
    guests.forEach((guest, index) => {
      if (!guest.firstName) newErrors[`guest${index}FirstName`] = "Guest first name is required";
      if (!guest.lastName) newErrors[`guest${index}LastName`] = "Guest last name is required";
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      // Main ticket information
      const { data: ticketData, error: ticketError } = await supabase
        .from('Cuervo')
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            email: email,
            payment_method: paymentMethod,
            payment_handle: paymentHandle,
            num_tickets: numTickets,
            created_at: new Date()
          }
        ])
        .select();

      if (ticketError) {
        console.error('Error adding ticket:', ticketError);
        // Handle error (e.g., show error message to user)
        return;
      }

      // Guest information if there are guests
      if (guests.length > 0 && ticketData && ticketData.length > 0) {
        const ticketId = ticketData[0].id;
        const guestInserts = guests.map(guest => ({
          ticket_id: ticketId,
          first_name: guest.firstName,
          last_name: guest.lastName,
          created_at: new Date()
        }));

        const { error: guestError } = await supabase
          .from('Cuervo_Guests')
          .insert(guestInserts);

        if (guestError) {
          console.error('Error adding guests:', guestError);
          // Handle error (e.g., show error message to user)
        }
      }

      // If everything is successful, redirect to the confirmation page
      router.push('/TicketConfirmation');
    } catch (error) {
      console.error('Unexpected error:', error);
      setErrors({ submit: "An unexpected error occurred. Please try again." })
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl mx-auto bg-slate-200 text-card-foreground shadow-xl overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground p-6">
          <CardTitle className="text-2xl text-center font-bold">{showInfo.title}</CardTitle>
          <CardDescription className="mt-2 text-center">
            Date: {showInfo.date} | Doors: {showInfo.time}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="aspect-video overflow-hidden rounded-lg">
            <Image
              alt="Studio Recording"
              className="object-cover w-full h-full"
              height="600"
              src={showInfo.image}
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              width="800"
              priority
            />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</Label>
                <Input 
                  id="firstName" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required 
                  className={`bg-background border-input text-foreground ${errors.firstName ? 'border-red-500' : ''}`}
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</Label>
                <Input 
                  id="lastName" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required 
                  className={`bg-background border-input text-foreground ${errors.lastName ? 'border-red-500' : ''}`}
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
              <Input 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className={`bg-background border-input text-foreground ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
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
              <RadioGroup 
                onValueChange={setPaymentMethod} 
                value={paymentMethod} 
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="venmo" id="venmo" />
                  <Label className='flex items-center' htmlFor="venmo">
                    Venmo - <span className='text-blue-500 ml-1'>
                      <Link href={'https://venmo.com/u/digitalparadisemedia'}>@digitalparadisemedia</Link>
                    </span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cashapp" id="cashapp" />
                  <Label className='flex items-center' htmlFor="cashapp">
                    Cash App - <span className='text-blue-500 ml-1'>
                      <Link href={'https://cash.app/$digitalparadisemedia'}>$digitalparadisemedia</Link>
                    </span>
                  </Label>
                </div>
              </RadioGroup>
              {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod}</p>}
            </div>
            {paymentMethod && (
              <div className="space-y-2">
                <Label htmlFor="paymentHandle" className="text-sm font-medium">
                  {paymentMethod === 'venmo' ? 'Venmo' : 'Cash App'} Handle
                </Label>
                <Input 
                  id="paymentHandle" 
                  value={paymentHandle}
                  onChange={(e) => setPaymentHandle(e.target.value)}
                  required 
                  className={`bg-background text-foreground ${errors.paymentHandle ? 'border-red-500' : ''}`}
                />
                {errors.paymentHandle && <p className="text-red-500 text-sm">{errors.paymentHandle}</p>}
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={acceptTerms}
                onCheckedChange={setAcceptTerms}
                className="border-2 border-gray-300 rounded-sm w-4 h-4"
              />
              <Label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Please bring your ID to the show!!!
              </Label>
            </div>
            {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
            {errors.submit && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errors.submit}</AlertDescription>
              </Alert>
            )}
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-2 px-4 rounded"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : `Purchase Tickets ($${showInfo.ticketPrice * numTickets})`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};