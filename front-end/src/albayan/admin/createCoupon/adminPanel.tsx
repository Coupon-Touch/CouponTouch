import { useState } from 'react'
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
import { UploadButton } from '@/uploadThing/dropZone'

const generator = (function* incrementingGenerator(start: number = 0): Generator<number> {
  let counter = start;
  while (true) {
    yield counter++;
  }
})()


interface Prizes {
  id: number,
  image: string | null,
  bias: number,
}


interface Location {
  companyName: string;
  contactName?: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  address?: string;
  zipCode?: number;
  city?: string;
  country?: string;
  state?: string;
  latitude?: string;
  longitude?: string;
}



export default function AdminPanel() {
  const [prizes, setPrizes] = useState<Prizes[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [currentLocation, setCurrentLocation] = useState<Location>({ companyName: '', })
  const [isAddingLocation, setIsAddingLocation] = useState(false)
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false)

  const addPrize = () => {
    setPrizes([...prizes, { image: null, bias: 0, id: generator.next().value }])
  }

  const updatePrize = <T extends 'image' | 'bias'>(
    id: number,
    field: T,
    value: T extends 'image' ? string : number
  ) => {
    const updatedPrizes = [...prizes]
    updatedPrizes[id][field] = value as Prizes[T];
    setPrizes(updatedPrizes)
  }

  const openAddLocationSheet = () => {
    setCurrentLocation({ companyName: '' })
    setIsAddingLocation(true)
    setIsLocationSheetOpen(true)
  }

  const openEditLocationSheet = (location: Location) => {
    setCurrentLocation(location)
    setIsAddingLocation(false)
    setIsLocationSheetOpen(true)
  }

  const saveLocation = () => {
    if (isAddingLocation && currentLocation) {
      setLocations([...locations, currentLocation])
    } else {
      const updatedLocations = locations.map(loc =>
        loc === currentLocation ? { ...currentLocation } : loc
      )
      setLocations(updatedLocations)
    }
    setIsLocationSheetOpen(false)
  }

  const updateCurrentLocation = <K extends keyof Location>(field: K, value: Location[K] extends number ? number : string) => {
    if (currentLocation)
      setCurrentLocation({ ...currentLocation, [field]: value })
  }

  return (
    <>
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
                  <UploadButton endpoint='logoUpload' onComplete={(file) => {
                    // file 
                  }} />
                  {/* <Input id="logo-upload" type="file" onChange={(e) => handleFileUpload(e)} /> */}
                </div>
                <div>
                  <Label htmlFor="scratch-image-upload">Scratch Card Background</Label>
                  <UploadButton endpoint='scratchCardBackground' onComplete={(file) => {
                    // file 
                  }} />
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
                  <div key={index} className="flex  sm:flex-row items-end h-full sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className='h-full'>
                      <Label htmlFor={'prizeImage' + index}>Prize Image</Label>
                      <UploadButton endpoint='prizeImage' onComplete={(file) => {
                        updatePrize(index, 'image', file[0].url)
                      }} />
                    </div>
                    <div className='h-full'>

                      <Label htmlFor={'prizeBias' + index}>Prize Bias</Label>
                      <Input
                        id={'prizeBias' + index}
                        type="number"
                        placeholder="Bias (0-100)"
                        value={prize.bias}
                        onChange={(e) => updatePrize(index, 'bias', parseInt(e.target.value))}
                        min="0"
                        max="100"
                        className="w-full sm:w-auto"
                      />
                    </div>
                    <div className=' flex h-full justify-end items-end'>
                      <Button variant="destructive" size="icon" className="" onClick={() => setPrizes(prizes.filter((_, i) => i !== index))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button onClick={addPrize}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Prize
                </Button>
                <div>
                  <Label htmlFor="losing-image-upload">Losing Image</Label>
                  <UploadButton endpoint='prizeImage' onComplete={(file) => {
                    // file
                  }} />
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
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="grid gap-4 py-4 px-4">
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
        <div className='flex justify-end mt-10'>
          <Button>Submit</Button>
        </div>
      </div>
    </>

  )
}