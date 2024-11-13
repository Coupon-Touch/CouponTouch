'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { addDays, format } from 'date-fns';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_LOCATION,
  UPDATE_COLLECTION_DETAILS,
} from '@/graphQL/apiRequests';
import { LocationInterface } from '../admin/createCoupon/adminPanel';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function AfterGame({ successCallback }: { successCallback: () => void }) {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false); // Managing the popover open state

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    setOpen(false); // Close popover after selecting a date
  };
  const [comments, setComments] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationInterface>({
    id: 0,
    companyName: '',
    contactName: '',
    phone: '',
    email: '',
    website: '',
    openingHours: '',
    address: '',
    city: '',
    country: '',
    state: '',
    latitude: '0',
    longitude: '0',
  });

  const [updateCollectionData, { loading: collectionLoading, error: collectionError }] =
    useMutation(UPDATE_COLLECTION_DETAILS);
  const {
    data: couponSettings,
    loading: couponLoading,
  } = useQuery(GET_LOCATION);

  const dateRange = { fromDate: new Date(), toDate: addDays(new Date(), 5) };
  const handleLocationSelect = (location: LocationInterface) => {
    setIsDialogOpen(false);
    setSelectedLocation(location);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCollectionData({
      variables: {
        collectionDate: date,
        collectionLocation: JSON.stringify(selectedLocation),
        comments: comments,
      },
      onCompleted(data) {
        data = data.updateCollectionDetails;
        window.localStorage.setItem('token', data.jwtToken);
        successCallback()
      },
    });
    // Handle form submission here
  };
  const isDateHasError = collectionError && date === undefined
  const isLocationHasError = collectionError && selectedLocation.contactName === ''
  return (
    <Card className='w-96 '>
      <CardHeader>
        <CardTitle>Info</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-w-md mx-auto p-6"
        >
          <div className={cn("space-y-2", isDateHasError && "text-red-500")}>
            <Label htmlFor="collection-date">Collection Date {isDateHasError && "(required)"}</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={'outline'}
                  className={cn(`w-full justify-start text-left font-normal`, isDateHasError && 'border-red-500')}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleSelect} // Call handleSelect on date selection
                  initialFocus
                  disabled={(date) => date < dateRange.fromDate || date > dateRange.toDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            {couponLoading ? <Skeleton className='w-36 h-5 mb-2' /> :
              <div className={cn("space-y-2", isLocationHasError && "text-red-500")}>
                <Label htmlFor="collection-location">Collection Location {isLocationHasError && "(required)"}</Label>
              </div>
            }
            <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
              {couponLoading ?
                <Skeleton className='w-full h-10' onClick={(e) => e.stopPropagation()}></Skeleton>
                :
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", isLocationHasError && 'border-red-500')}
                  >
                    {selectedLocation.companyName ? (
                      <div className='overflow-hidden text-ellipsis whitespace-nowrap'>
                        <span>{selectedLocation.companyName}, </span>
                        <span>{selectedLocation.country}</span>
                      </div>
                    ) : (
                      'Select a location'
                    )}
                  </Button>
                </DialogTrigger>
              }

              <DialogContent className="max-w-3xl" aria-describedby="Collection location">
                <DialogHeader>
                  <DialogTitle>Select a Collection Location</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                  {couponSettings &&
                    couponSettings.getLocation.map(
                      (location: LocationInterface, index: number) => (
                        <Card
                          key={index}
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handleLocationSelect(location)}
                        >
                          <CardContent className="p-4">
                            <h3 className="font-semibold">
                              {location.companyName}
                            </h3>
                            <p>{location.contactName}</p>
                            <p>{location.phone}</p>
                            <p className="text-sm text-gray-500">
                              {location.address}
                            </p>
                            <p className="text-sm text-gray-500">
                              Lat: {location.latitude}, Long:{' '}
                              {location.longitude}
                            </p>
                          </CardContent>
                        </Card>
                      )
                    )}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment</Label>
            <Textarea
              id="comment"
              placeholder="Enter any additional comments"
              value={comments}
              onChange={e => setComments(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            {collectionLoading ? 'Loading...' : 'Submit'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
