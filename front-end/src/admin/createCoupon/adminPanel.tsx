import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Trash2, Edit } from 'lucide-react'
import NavBar from '../navbar'

export default function AdminPanel() {
  const [prizes, setPrizes] = useState([])
  const [locations, setLocations] = useState([])
  const [currentLocation, setCurrentLocation] = useState({})
  const [isAddingLocation, setIsAddingLocation] = useState(false)
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false)

  const handleFileUpload = (event, setter) => {
    // Handle file upload logic here
  }

  const addPrize = () => {
    setPrizes([...prizes, { image: null, bias: 0 }])
  }

  const updatePrize = (index, field, value) => {
    const updatedPrizes = [...prizes]
    updatedPrizes[index][field] = value
    setPrizes(updatedPrizes)
  }

  const openAddLocationSheet = () => {
    setCurrentLocation({})
    setIsAddingLocation(true)
    setIsLocationSheetOpen(true)
  }

  const openEditLocationSheet = (location) => {
    setCurrentLocation(location)
    setIsAddingLocation(false)
    setIsLocationSheetOpen(true)
  }

  const saveLocation = () => {
    if (isAddingLocation) {
      setLocations([...locations, currentLocation])
    } else {
      const updatedLocations = locations.map(loc =>
        loc === currentLocation ? { ...currentLocation } : loc
      )
      setLocations(updatedLocations)
    }
    setIsLocationSheetOpen(false)
  }

  const updateCurrentLocation = (field, value) => {
    setCurrentLocation({ ...currentLocation, [field]: value })
  }

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4 min-h-screen">
        <Tabs defaultValue="logo-upload" className="space-y-4">
          <TabsList className="flex flex-col sm:flex-row h-auto">
            <TabsTrigger value="logo-upload" className="w-full sm:w-auto">Logo & Image</TabsTrigger>
            <TabsTrigger value="prizes" className="w-full sm:w-auto">Prizes</TabsTrigger>
            <TabsTrigger value="coupon-info" className="w-full sm:w-auto">Coupon Info</TabsTrigger>
            <TabsTrigger value="locations" className="w-full sm:w-auto">Locations</TabsTrigger>
            <TabsTrigger value="validation" className="w-full sm:w-auto">Validation</TabsTrigger>
          </TabsList>

          <TabsContent value="logo-upload">
            <Card>
              <CardHeader>
                <CardTitle>Logo & Scratch Image Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logo-upload">Company Logo</Label>
                  <Input id="logo-upload" type="file" onChange={(e) => handleFileUpload(e, 'setLogo')} />
                </div>
                <div>
                  <Label htmlFor="scratch-image-upload">Scratch Card Background</Label>
                  <Input id="scratch-image-upload" type="file" onChange={(e) => handleFileUpload(e, 'setScratchImage')} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prizes">
            <Card>
              <CardHeader>
                <CardTitle>Prize Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {prizes.map((prize, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <Input type="file" onChange={(e) => handleFileUpload(e, (file) => updatePrize(index, 'image', file))} />
                    <Input
                      type="number"
                      placeholder="Bias (0-100)"
                      value={prize.bias}
                      onChange={(e) => updatePrize(index, 'bias', e.target.value)}
                      min="0"
                      max="100"
                      className="w-full sm:w-auto"
                    />
                    <Button variant="destructive" size="icon" onClick={() => setPrizes(prizes.filter((_, i) => i !== index))}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={addPrize}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Prize
                </Button>
                <div>
                  <Label htmlFor="losing-image-upload">Losing Image</Label>
                  <Input id="losing-image-upload" type="file" onChange={(e) => handleFileUpload(e, 'setLosingImage')} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupon-info">
            <Card>
              <CardHeader>
                <CardTitle>Coupon Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="coupon-title">Coupon Title</Label>
                  <Input id="coupon-title" placeholder="Enter coupon title" />
                </div>
                <div>
                  <Label htmlFor="coupon-subtitle">Coupon Subtitle</Label>
                  <Input id="coupon-subtitle" placeholder="Enter coupon subtitle" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter description" />
                </div>
                <div>
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea id="terms" placeholder="Enter terms and conditions" />
                </div>
                <div>
                  <Label htmlFor="congrats">Congratulations Description</Label>
                  <Textarea id="congrats" placeholder="Enter congratulations text" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations">
            <Card>
              <CardHeader>
                <CardTitle>Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {locations.map((location, index) => (
                  <div key={index} className="p-4 border rounded flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                    <div>
                      <h3 className="font-bold">{location.companyName}</h3>
                      <p>{location.address}, {location.city}, {location.country}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => openEditLocationSheet(location)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => setLocations(locations.filter((_, i) => i !== index))}>
                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
                <Button onClick={openAddLocationSheet}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Location
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validation">
            <Card>
              <CardHeader>
                <CardTitle>Validation Page</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="validation-title">Title on Validation Page</Label>
                  <Input id="validation-title" placeholder="Enter title for validation page" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Sheet open={isLocationSheetOpen} onOpenChange={setIsLocationSheetOpen}>
          <SheetContent side="right" className="w-full sm:w-[540px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{isAddingLocation ? 'Add New Location' : 'Edit Location'}</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={currentLocation.companyName || ''}
                    onChange={(e) => updateCurrentLocation('companyName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Contact Name</Label>
                  <Input
                    id="contact-name"
                    value={currentLocation.contactName || ''}
                    onChange={(e) => updateCurrentLocation('contactName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={currentLocation.email || ''}
                    onChange={(e) => updateCurrentLocation('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={currentLocation.phone || ''}
                    onChange={(e) => updateCurrentLocation('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={currentLocation.website || ''}
                    onChange={(e) => updateCurrentLocation('website', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Opening Hours</Label>
                  <Input
                    id="hours"
                    value={currentLocation.openingHours || ''}
                    onChange={(e) => updateCurrentLocation('openingHours', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={currentLocation.address || ''}
                    onChange={(e) => updateCurrentLocation('address', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">Zip/Postal Code</Label>
                  <Input
                    id="zip"
                    value={currentLocation.zipCode || ''}
                    onChange={(e) => updateCurrentLocation('zipCode', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={currentLocation.city || ''}
                    onChange={(e) => updateCurrentLocation('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={currentLocation.country || ''}
                    onValueChange={(value) => updateCurrentLocation('country', value)}
                  >
                    <SelectTrigger>
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
                <div className="space-y-2">
                  <Label htmlFor="state">Province/State</Label>
                  <Input
                    id="state"
                    value={currentLocation.state || ''}
                    onChange={(e) => updateCurrentLocation('state', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    value={currentLocation.latitude || ''}
                    onChange={(e) => updateCurrentLocation('latitude', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    value={currentLocation.longitude || ''}
                    onChange={(e) => updateCurrentLocation('longitude', e.target.value)}
                  />
                </div>
              </div>
            </ScrollArea>
            <div className="mt-4 flex justify-end">
              <Button onClick={saveLocation}>
                {isAddingLocation ? 'Add Location' : 'Save Changes'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>

  )
}