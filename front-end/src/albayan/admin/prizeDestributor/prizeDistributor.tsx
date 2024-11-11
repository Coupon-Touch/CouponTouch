'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type CollectionLocation = {
  address: string
  city: string
  state: string
  zipCode: string
}

type PrizeDetails = {
  campaignCode: string
  collectionDate: string
  collectionLocation: CollectionLocation
  comments: string
}

type Person = {
  id: number
  name: string
  email: string
  phone: string
  isContacted: boolean
  isPaid: boolean
  prizesWon: PrizeDetails[]
}

// Sample data
const people: Person[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
    isContacted: true,
    isPaid: false,
    prizesWon: [
      {
        campaignCode: "SUMMER2023",
        collectionDate: "2023-07-15",
        collectionLocation: {
          address: "123 Main St",
          city: "Anytown",
          state: "CA",
          zipCode: "12345"
        },
        comments: "Prize collected successfully"
      }
    ]
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    isContacted: false,
    isPaid: true,
    prizesWon: [
      {
        campaignCode: "WINTER2023",
        collectionDate: "2023-12-20",
        collectionLocation: {
          address: "456 Elm St",
          city: "Other City",
          state: "NY",
          zipCode: "67890"
        },
        comments: "Pending collection"
      }
    ]
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    isContacted: false,
    isPaid: true,
    prizesWon: [
      {
        campaignCode: "WINTER2023",
        collectionDate: "2023-12-20",
        collectionLocation: {
          address: "456 Elm St",
          city: "Other City",
          state: "NY",
          zipCode: "67890"
        },
        comments: "Pending collection"
      }
    ]
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "987-654-3210",
    isContacted: false,
    isPaid: true,
    prizesWon: [
      {
        campaignCode: "WINTER2023",
        collectionDate: "2023-12-20",
        collectionLocation: {
          address: "456 Elm St",
          city: "Other City",
          state: "NY",
          zipCode: "67890"
        },
        comments: "Pending collection"
      }
    ]
  },
  // Add more sample data as needed
]

export default function PrizeDistributor() {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people)
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    email: true,
    phone: true,
    isContacted: true,
    isPaid: true,
    prizesWon: true,
  })
  const [itemsPerPage, setItemsPerPage] = useState(2);

  useEffect(() => {
    const filtered = people.filter(person =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.phone.includes(searchTerm)
    )
    setFilteredPeople(filtered)
    setCurrentPage(1)
  }, [searchTerm])

  const totalPages = Math.ceil(filteredPeople.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPeople = filteredPeople.slice(startIndex, endIndex)

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }))
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4 flex justify-between items-center">
        <Input
          placeholder="Search by name, email, or phone"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(visibleColumns).map(([key, value]) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={value}
                onCheckedChange={() => toggleColumn(key as keyof typeof visibleColumns)}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-white p-10">
        <Table className='bg-white'>
          <TableHeader>
            <TableRow>
              {visibleColumns.name && <TableHead>Name</TableHead>}
              {visibleColumns.email && <TableHead>Email</TableHead>}
              {visibleColumns.phone && <TableHead>Phone</TableHead>}
              {visibleColumns.isContacted && <TableHead>Contacted</TableHead>}
              {visibleColumns.isPaid && <TableHead>Paid</TableHead>}
              {visibleColumns.prizesWon && <TableHead>Prizes Won</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPeople.map((person) => (
              <TableRow key={person.id}>
                {visibleColumns.name && <TableCell>{person.name}</TableCell>}
                {visibleColumns.email && <TableCell>{person.email}</TableCell>}
                {visibleColumns.phone && <TableCell>{person.phone}</TableCell>}
                {visibleColumns.isContacted && (
                  <TableCell>
                    <Checkbox checked={person.isContacted} disabled />
                  </TableCell>
                )}
                {visibleColumns.isPaid && (
                  <TableCell>
                    <Checkbox checked={person.isPaid} disabled />
                  </TableCell>
                )}
                {visibleColumns.prizesWon && (
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" onClick={() => setSelectedPerson(person)}>
                          View Prizes ({person.prizesWon.length})
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl" aria-describedby={`prize won by ${selectedPerson?.name}`}>
                        <DialogHeader>
                          <DialogTitle>Prizes Won by {selectedPerson?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4">
                          {selectedPerson?.prizesWon.map((prize, index) => (
                            <div key={index} className="border p-4 rounded-lg">
                              <p><strong>Campaign Code:</strong> {prize.campaignCode}</p>
                              <p><strong>Collection Date:</strong> {prize.collectionDate}</p>
                              <Card className="mt-2">
                                <CardHeader>
                                  <CardTitle>Collection Location</CardTitle>
                                </CardHeader>
                                <CardContent aria-describedby={`Colelction Locatoin ${prize.collectionLocation.city}`}>
                                  <p>{prize.collectionLocation.address}</p>
                                  <p>{prize.collectionLocation.city}, {prize.collectionLocation.state} {prize.collectionLocation.zipCode}</p>
                                </CardContent>
                              </Card>
                              <p className="mt-2"><strong>Comments:</strong> {prize.comments}</p>
                            </div>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {currentPage} of {totalPages}
        </div>
        <Select onValueChange={(value) => setItemsPerPage(parseInt(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="10" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">10</SelectItem>
            <SelectItem value="dark">50</SelectItem>
            <SelectItem value="system">100</SelectItem>
          </SelectContent>
        </Select> 
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}