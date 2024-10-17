"use client"

import { useState, useEffect } from "react"
import { createClient } from '@supabase/supabase-js'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Save, Trash2 } from "lucide-react"

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
      // Fetch Cuervo data
      const { data: cuervoData, error: cuervoError } = await supabase
        .from('Cuervo')
        .select('id, first_name, last_name')

      if (cuervoError) throw cuervoError
      console.log('Cuervo data:', cuervoData)

      // Fetch Cuervo_Guests data with specific columns
      const { data: guestsData, error: guestsError } = await supabase
        .from('Cuervo_Guests')
        .select(`
          id,
          first_name, last_name,
          first_name_2, last_name_2,
          first_name_3, last_name_3,
          first_name_4, last_name_4,
          first_name_5, last_name_5
        `)

      if (guestsError) throw guestsError
      console.log('Cuervo_Guests data:', guestsData)

      // Combine and format the data
      const cuervoAttendees = cuervoData.map(user => ({
        id: `cuervo_${user.id}`,
        name: `${user.first_name} ${user.last_name}`,
        present: false,
        notes: ""
      }))
      console.log('Formatted Cuervo attendees:', cuervoAttendees)

      const guestAttendees = guestsData.flatMap(guest => {
        const attendees = []
        for (let i = 1; i <= 5; i++) {
          const firstName = guest[`first_name${i === 1 ? '' : '_' + i}`]
          const lastName = guest[`last_name${i === 1 ? '' : '_' + i}`]
          if (firstName && lastName) {
            attendees.push({
              id: `guest_${guest.id}_${i}`,
              name: `${firstName} ${lastName}`,
              present: false,
              notes: ""
            })
          }
        }
        return attendees
      })
      console.log('Formatted guest attendees:', guestAttendees)

      const combinedAttendees = [...cuervoAttendees, ...guestAttendees]
      console.log('Combined attendees:', combinedAttendees)

      setAttendees(combinedAttendees)
    } catch (error) {
      console.error('Error fetching attendees:', error)
    }
  }

  const toggleAttendance = (id) => {
    setAttendees(
      attendees.map((attendee) =>
        attendee.id === id ? { ...attendee, present: !attendee.present } : attendee
      )
    )
  }

  const addAttendee = () => {
    if (newAttendeeName.trim() !== "") {
      setAttendees([
        ...attendees,
        { id: attendees.length + 1, name: newAttendeeName.trim(), present: false, notes: "" },
      ])
      setNewAttendeeName("")
    }
  }

  const updateName = (id, newName) => {
    setAttendees(
      attendees.map((attendee) =>
        attendee.id === id ? { ...attendee, name: newName } : attendee
      )
    )
  }

  const updateNotes = (id, newNotes) => {
    setAttendees(
      attendees.map((attendee) =>
        attendee.id === id ? { ...attendee, notes: newNotes } : attendee
      )
    )
  }

  const deleteAttendee = (id) => {
    setAttendees(attendees.filter(attendee => attendee.id !== id))
  }

  return (
    <div className="container bg-white mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cuervo Guest List</h1>
      <div className="mb-4 flex gap-2">
        <Input
          type="text"
          placeholder="New attendee name"
          value={newAttendeeName}
          onChange={(e) => setNewAttendeeName(e.target.value)}
          className="max-w-sm border border-gray-300"
        />
        <Button onClick={addAttendee}>Add Attendee</Button>
      </div>
      <Table className="border-collapse border border-gray-300">
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3 text-center border border-gray-300">Name</TableHead>
            <TableHead className="w-1/6 text-center border border-gray-300">Present</TableHead>
            <TableHead className="w-1/2 text-center border border-gray-300">Notes</TableHead>
            <TableHead className="w-1/12 text-center border border-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendees.map((attendee) => (
            <TableRow key={attendee.id}>
              <TableCell className="w-1/3 border border-gray-300">
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
              <TableCell className="w-1/6 text-center border border-gray-300">
                <Checkbox
                  checked={attendee.present}
                  onCheckedChange={() => toggleAttendance(attendee.id)}
                  className="border-2 border-gray-400 rounded-sm"
                />
              </TableCell>
              <TableCell className="w-1/2 border border-gray-300">
                <Textarea
                  value={attendee.notes}
                  onChange={(e) => updateNotes(attendee.id, e.target.value)}
                  placeholder="Add notes here..."
                  className="w-full min-h-[60px] border border-gray-300"
                />
              </TableCell>
              <TableCell className="w-1/12 text-center border border-gray-300">
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
  );
};
