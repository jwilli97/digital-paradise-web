"use client"

import { useState, useEffect } from "react"
import { createClient } from '@supabase/supabase-js'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Save, Trash2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function AttendanceTable() {
  const [attendees, setAttendees] = useState([])
  const [newAttendeeName, setNewAttendeeName] = useState("")
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchAttendees()
  }, [])

  const fetchAttendees = async () => {
    try {
      // Fetch Cuervo data (updated to include payment_method)
      const { data: cuervoData, error: cuervoError } = await supabase
        .from('Cuervo')
        .select('id, first_name, last_name, attended, notes, status, payment_method')

      if (cuervoError) throw cuervoError
      console.log('Cuervo data:', cuervoData)

      // Fetch Cuervo_Guests data (updated)
      const { data: guestsData, error: guestsError } = await supabase
        .from('Cuervo_Guests')
        .select('id, first_name, last_name, attended, notes, status')

      if (guestsError) throw guestsError
      console.log('Cuervo_Guests data:', guestsData)

      // Combine and format the data
      const cuervoAttendees = cuervoData.map(user => ({
        id: `cuervo_${user.id}`,
        name: `${user.first_name} ${user.last_name}`,
        attended: user.attended || false,
        notes: user.notes || "",
        status: user.status || "GA",
        payment_method: user.payment_method || "Select..."
      }))

      const guestAttendees = guestsData.map(guest => ({
        id: `guest_${guest.id}_1`,
        name: `${guest.first_name} ${guest.last_name}`,
        attended: guest.attended || false,
        notes: guest.notes || "",
        status: guest.status || "GA",
        payment_method: "Guest" // Guests don't have payment method
      }))

      const combinedAttendees = [...cuervoAttendees, ...guestAttendees]
      console.log('Combined attendees:', combinedAttendees)

      // Sort the combined attendees array alphabetically by first name
      const sortedAttendees = combinedAttendees.sort((a, b) => {
        const firstNameA = a.name.split(' ')[0];
        const firstNameB = b.name.split(' ')[0];
        return firstNameA.localeCompare(firstNameB);
      });

      setAttendees(sortedAttendees)
    } catch (error) {
      console.error('Error fetching attendees:', error)
    }
  };

  const toggleAttendance = async (id) => {
    const updatedAttendees = attendees.map((attendee) =>
      attendee.id === id ? { ...attendee, attended: !attendee.attended } : attendee
    );
    setAttendees(updatedAttendees);

    const attendee = updatedAttendees.find((a) => a.id === id);
    const [table, dbId] = id.split('_');
    
    try {
      await supabase
        .from(table === 'cuervo' ? 'Cuervo' : 'Cuervo_Guests')
        .update({ attended: attendee.attended })
        .eq('id', dbId);
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const addAttendee = async () => {
    if (newAttendeeName.trim() !== "") {
      try {
        // Split the full name into first and last name
        const [firstName, ...lastNameParts] = newAttendeeName.trim().split(' ');
        const lastName = lastNameParts.join(' ');

        // Prepare the data to be inserted
        const newAttendeeData = { 
          first_name: firstName, 
          last_name: lastName, 
          attended: true,
          notes: "",
          status: "GA",
          payment_method: "Select..."
        };

        console.log('Attempting to insert:', newAttendeeData);

        // Insert the new attendee into the Cuervo table
        const { data, error } = await supabase
          .from('Cuervo')
          .insert(newAttendeeData)
          .select();

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        };

        if (!data || data.length === 0) {
          console.error('No data returned from insert operation');
          throw new Error('No data returned from insert operation');
        };

        const newAttendee = {
          id: `cuervo_${data[0].id}`,
          name: newAttendeeName.trim(),
          attended: true,
          notes: "",
          status: "GA",
          payment_method: "Select..."
        };

        // Insert the new attendee and sort the array by first name
        const updatedAttendees = [...attendees, newAttendee].sort((a, b) => {
          const firstNameA = a.name.split(' ')[0];
          const firstNameB = b.name.split(' ')[0];
          return firstNameA.localeCompare(firstNameB);
        });

        setAttendees(updatedAttendees);
        setNewAttendeeName("");

        console.log('New attendee added:', newAttendee);
      } catch (error) {
        console.error('Error adding new attendee:', error);
      }
    }
  };

  const updateName = (id, newName) => {
    setAttendees(
      attendees.map((attendee) =>
        attendee.id === id ? { ...attendee, name: newName } : attendee
      )
    )
  };

  const updateNotes = async (id, newNotes) => {
    const updatedAttendees = attendees.map((attendee) =>
      attendee.id === id ? { ...attendee, notes: newNotes } : attendee
    );
    setAttendees(updatedAttendees);

    const [table, dbId] = id.split('_');
    
    try {
      await supabase
        .from(table === 'cuervo' ? 'Cuervo' : 'Cuervo_Guests')
        .update({ notes: newNotes })
        .eq('id', dbId);
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const deleteAttendee = async (id) => {
    try {
      const [table, dbId] = id.split('_');
      const tableName = table === 'cuervo' ? 'Cuervo' : 'Cuervo_Guests';
  
      console.log(`Attempting to delete from ${tableName} table, with id: ${dbId}`);
  
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', dbId);
  
      if (error) {
        throw error;
      }
  
      console.log(`Successfully deleted entry with id: ${id}`);
  
      // Re-fetch the updated attendees list from Supabase to ensure data is accurate
      await fetchAttendees();
    } catch (error) {
      console.error('Error deleting attendee:', error);
      // Optionally, add user feedback here (e.g., toast notification)
    }
  };

  const updateStatus = async (id, newStatus) => {
    const updatedAttendees = attendees.map((attendee) =>
      attendee.id === id ? { ...attendee, status: newStatus } : attendee
    );
    setAttendees(updatedAttendees);

    const [table, dbId] = id.split('_');
    
    try {
      await supabase
        .from(table === 'cuervo' ? 'Cuervo' : 'Cuervo_Guests')
        .update({ status: newStatus })
        .eq('id', dbId);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const updatePaymentMethod = async (id, newPaymentMethod) => {
    const updatedAttendees = attendees.map((attendee) =>
      attendee.id === id ? { ...attendee, payment_method: newPaymentMethod } : attendee
    );
    setAttendees(updatedAttendees);

    const [table, dbId] = id.split('_');
    
    if (table === 'cuervo') {
      try {
        await supabase
          .from('Cuervo')
          .update({ payment_method: newPaymentMethod })
          .eq('id', dbId);
      } catch (error) {
        console.error('Error updating payment method:', error);
      }
    }
  };

  const updateAttendees = async () => {
    try {
      const cuervoUpdates = attendees
        .filter(attendee => attendee.id.startsWith('cuervo_'))
        .map(attendee => ({
          id: attendee.id.split('_')[1],
          first_name: attendee.name.split(' ')[0],
          last_name: attendee.name.split(' ').slice(1).join(' '),
          attended: attendee.attended,
          notes: attendee.notes,
          status: attendee.status,
          payment_method: attendee.payment_method
        }));

      const guestUpdates = attendees
        .filter(attendee => attendee.id.startsWith('guest_'))
        .reduce((acc, attendee) => {
          const [_, guestId, index] = attendee.id.split('_');
          if (!acc[guestId]) {
            acc[guestId] = {
              id: guestId,
              attended: attendee.attended,
              notes: attendee.notes,
              status: attendee.status,
              guests: []
            };
          }
          acc[guestId].guests.push({
            first_name: attendee.name.split(' ')[0],
            last_name: attendee.name.split(' ').slice(1).join(' ')
          });
          return acc;
        }, {});

      // Update Cuervo table
      if (cuervoUpdates.length > 0) {
        const { error: cuervoError } = await supabase
          .from('Cuervo')
          .upsert(cuervoUpdates);
        if (cuervoError) throw cuervoError;
      }

      // Update Cuervo_Guests table
      if (Object.keys(guestUpdates).length > 0) {
        for (const guestId in guestUpdates) {
          const guest = guestUpdates[guestId];
          const { error: guestError } = await supabase
            .from('Cuervo_Guests')
            .upsert({
              id: guest.id,
              attended: guest.attended,
              notes: guest.notes,
              status: guest.status,
              first_name: guest.guests[0]?.first_name || '',
              last_name: guest.guests[0]?.last_name || '',
              payment_method: "Guest"
              // Add more guest fields if needed
            });
          if (guestError) throw guestError;
        }
      }

      console.log('All attendees updated successfully');
    } catch (error) { 
      console.error('Error updating attendees:', error);
    }
  };

  return (
    <div className="container mx-auto bg-white p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Cuervo Guest List</h1>
      <div className="mb-6 flex justify-center gap-2">
        <Input
          type="text"
          placeholder="New attendee name"
          value={newAttendeeName}
          onChange={(e) => setNewAttendeeName(e.target.value)}
          className="max-w-sm border border-gray-300"
        />
        <Button onClick={addAttendee}>Add Attendee</Button>
        <Button className="ml-24 bg-pink-400" onClick={updateAttendees}>Save All Changes</Button>
      </div>
      <div className="overflow-x-auto">
        <Table className="w-full border-collapse border border-gray-300">
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/5 text-center border border-gray-300">Name</TableHead>
              <TableHead className="w-1/10 text-center border border-gray-300">Attended</TableHead>
              <TableHead className="w-1/10 text-center border border-gray-300">Status</TableHead>
              <TableHead className="w-1/10 text-center border border-gray-300">Payment</TableHead>
              <TableHead className="w-1/4 text-center border border-gray-300">Notes</TableHead>
              <TableHead className="w-1/12 text-center border border-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendees.map((attendee) => (
              <TableRow key={attendee.id}>
                <TableCell className="border border-gray-300">
                  {editingId === attendee.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <Input
                        value={attendee.name}
                        onChange={(e) => updateName(attendee.id, e.target.value)}
                        className="max-w-[200px] border border-gray-300"
                      />
                      <Button size="sm" onClick={() => setEditingId(null)}>
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      {attendee.name}
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(attendee.id)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center border border-gray-300">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={attendee.attended}
                      onCheckedChange={() => toggleAttendance(attendee.id)}
                      className="border-2 border-gray-400 rounded-sm"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center border border-gray-300">
                  <div className="flex justify-center">
                    <Select
                      value={attendee.status}
                      onValueChange={(value) => updateStatus(attendee.id, value)}
                    >
                      <SelectTrigger className="justify-between">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GA" className="bg-green-600 w-[100px] text-white hover:bg-green-700 hover:text-white">GA</SelectItem>
                        <SelectItem value="VIP" className="bg-pink-500 w-[100px] text-white hover:bg-pink-600 hover:text-white">VIP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell className="text-center border border-gray-300">
                  <div className="flex justify-center">
                    <Select
                      value={attendee.payment_method}
                      onValueChange={(value) => updatePaymentMethod(attendee.id, value)}
                      disabled={attendee.id.startsWith('guest_')}
                    >
                      <SelectTrigger className="justify-between">
                        <SelectValue placeholder="Select payment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cashapp">CashApp</SelectItem>
                        <SelectItem value="venmo">Venmo</SelectItem>
                        <SelectItem value="vip">VIP</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
                <TableCell className="border border-gray-300">
                  <Textarea
                    value={attendee.notes}
                    onChange={(e) => updateNotes(attendee.id, e.target.value)}
                    placeholder="Add notes here..."
                    className="w-full min-h-[60px] border border-gray-300"
                  />
                </TableCell>
                <TableCell className="text-center border border-gray-300">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteAttendee(attendee.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
