import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Location {
  companyName: string
  contactName: string
  email: string
  phone: string
  website: string
  openingHours: string
  address: string
  zipCode: string
  city: string
  country: string
  province: string
  latitude: number
  longitude: number
}

export default function LocationSection() {
  const [locations, setLocations] = useState<Location[]>([])
  const [currentLocation, setCurrentLocation] = useState<Location>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    openingHours: '',
    address: '',
    zipCode: '',
    city: '',
    country: '',
    province: '',
    latitude: 0,
    longitude: 0,
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setCurrentLocation({ ...currentLocation, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setCurrentLocation({ ...currentLocation, [name]: value })
  }

  const handleAddLocation = () => {
    setLocations([...locations, currentLocation])
    setCurrentLocation({
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      website: '',
      openingHours: '',
      address: '',
      zipCode: '',
      city: '',
      country: '',
      province: '',
      latitude: 0,
      longitude: 0,
    })
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Location</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="companyName" className="text-right">
                Company Name
              </Label>
              <Input
                id="companyName"
                name="companyName"
                value={currentLocation.companyName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactName" className="text-right">
                Contact Name
              </Label>
              <Input
                id="contactName"
                name="contactName"
                value={currentLocation.contactName}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={currentLocation.email}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={currentLocation.phone}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                Website
              </Label>
              <Input
                id="website"
                name="website"
                value={currentLocation.website}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="openingHours" className="text-right">
                Opening Hours
              </Label>
              <Input
                id="openingHours"
                name="openingHours"
                value={currentLocation.openingHours}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={currentLocation.address}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zipCode" className="text-right">
                Zip/Postal Code
              </Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={currentLocation.zipCode}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">
                City
              </Label>
              <Input
                id="city"
                name="city"
                value={currentLocation.city}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="country" className="text-right">
                Country
              </Label>
              <Select onValueChange={(value) => handleSelectChange('country', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  {/* Add more countries as needed */}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="province" className="text-right">
                Province/State
              </Label>
              <Input
                id="province"
                name="province"
                value={currentLocation.province}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="latitude" className="text-right">
                Latitude
              </Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                value={currentLocation.latitude}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="longitude" className="text-right">
                Longitude
              </Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                value={currentLocation.longitude}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleAddLocation}>Add Location</Button>
        </DialogContent>
      </Dialog>
      {locations.map((location, index) => (
        <Card key={index} className="mt-4">
          <CardHeader>
            <CardTitle>{location.companyName}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{location.address}, {location.city}, {location.province}, {location.country}</p>
            <p>Contact: {location.contactName}</p>
            <p>Email: {location.email}</p>
            <p>Phone: {location.phone}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}