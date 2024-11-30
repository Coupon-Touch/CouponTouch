import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_WINNERS, UPDATE_WIN_STATUS } from '@/graphQL/apiRequests';
import { useEffect, useMemo, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"


function formatPhoneNumber(input: string, separator = '-') {
  const groups = [];
  const number = input.split('');
  while (number.length > 0) {
    groups.push(number.splice(Math.max(0, number.length - 3)).join(''));
  }
  groups.reverse();
  return groups.join(separator);
}
const statusOptions = [
  'Unassigned',
  'Assigned',
  'Prize Dispatched',
  'Customer Claimed',
] as const;
type Status = (typeof statusOptions)[number];
export interface GetAllWinnerDetailsResponse {
  getAllWinnerDetails: WinnerDetail[];
}

export interface CollectionLocationInterface {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  openingHours: string;
  website: string;
}

export interface WinnerDetail {
  _id: string;
  campaignCode: string;
  collectionDate: string;
  collectionLocation: CollectionLocationInterface | string;
  status: Status;
  comments: string;
  subscriber: Subscriber | null;
  collectionLocationSearch: string;
}

export interface Subscriber {
  _id: string;
  mobile: string;
  countryCode: string;
  isPaid: boolean;
  lastScratchTime: Date;
  address: string;
  email: string;
  name: string;
}
const statusColorMap = {
  Unassigned: 'bg-gray-200 text-gray-600',
  Assigned: 'bg-yellow-200 text-yellow-600',
  'Prize Dispatched': 'bg-blue-200 text-blue-600',
  'Customer Claimed': 'bg-green-200 text-green-600',
};
const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 75, 100];

export default function DataTable() {
  const [winnerData, setWinnerData] = useState<WinnerDetail[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentSelectedLocation, setCurrentSelectedLocation] = useState<CollectionLocationInterface | null>(null);
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    mobile: true,
    email: true,
    address: true,
    collectionDate: true,
    collectionLocation: true,
    status: true,
    comments: true,
  });

  const totalPages = Math.ceil(winnerData.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = winnerData.slice(startIndex, endIndex);

  const {
    loading: dataLoading,
    data: data,
    refetch: refetchData,
  } = useQuery<GetAllWinnerDetailsResponse>(GET_ALL_WINNERS);

  // Set up the mutation
  const [updateWinStatus] =
    useMutation(UPDATE_WIN_STATUS);

  useEffect(() => {
    if (data) {
      setWinnerData(data.getAllWinnerDetails.map((item) => {
        return {
          ...item,
          collectionLocationSearch: String(item.collectionLocation),
          collectionLocation: item.collectionLocation ? JSON.parse(String(item.collectionLocation)) : 'Not Provided',
          collectionDate: new Date(item.collectionDate).toDateString()
        }
      }));
    }
  }, [data]);

  const filteredData = useMemo(() => {
    return currentData.filter(
      item => {
        const subsriberSearchResult = item.subscriber ? Object.values(item.subscriber).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchTerm.toLowerCase())
          } else if (typeof value === 'number') {
            return value.toString().includes(searchTerm)
          }
          return false
        }) : true;
        const dateSearchResult = new Date(item.collectionDate).toDateString().toLowerCase().includes(searchTerm.toLowerCase())
        const locationSearchResult = item.collectionLocationSearch
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        const statusSearchResult = item.status.toLowerCase().includes(searchTerm.toLowerCase())
        const commentSearchResult = item.comments.toLowerCase().includes(searchTerm.toLowerCase())


        return subsriberSearchResult || dateSearchResult || locationSearchResult || statusSearchResult || commentSearchResult
      }

    );
  }, [winnerData, searchTerm]);
  const handleColumnToggle = (columnKey: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({ ...prev, [columnKey]: !prev[columnKey] }));
  };

  // Handler for updating the status
  const handleStatusChange = (winnerId: string, newStatus: Status) => {
    setWinnerData(prev => {
      return prev.map(winner => {
        if (winner._id === winnerId) {
          return {
            ...winner,
            status: newStatus,
          };
        }
        return winner;
      });
    });
    updateWinStatus({ variables: { winnerId, newStatus } })
      .then(response => {
        if (response.data.updateStatusofWinByWinnerID.isSuccessful) {
        } else {
          console.error('Failed to update status.');
        }
      })
      .catch(err => console.error('Error updating status:', err))
      .finally(() => {
        refetchData();
      });
  };

  return (
    <>
    <Card className="w-full max-w-[95vw] mx-auto">
      <CardHeader>
        <CardTitle>Winner Details</CardTitle>
        <CardDescription>
          A list of all winners and their collection details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Search className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Columns</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.entries(visibleColumns).map(([key, value]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={value}
                    onCheckedChange={() =>
                      handleColumnToggle(key as keyof typeof visibleColumns)
                    }
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={value => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select items per page" />
              </SelectTrigger>
              <SelectContent>
                {ITEMS_PER_PAGE_OPTIONS.map(option => (
                  <SelectItem key={option} value={option.toString()}>
                    {option} items per page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <ScrollArea className="w-full">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">S.No</TableHead>
                  {visibleColumns.name && (
                    <TableHead className="w-[150px]">Name</TableHead>
                  )}
                  {visibleColumns.mobile && (
                    <TableHead className="min-w-[200px]">Mobile</TableHead>
                  )}
                  {visibleColumns.email && <TableHead>Email</TableHead>}

                  {visibleColumns.address && (
                    <TableHead className="min-w-[200px]">Address</TableHead>
                  )}
                  {visibleColumns.collectionDate && (
                    <TableHead>Collection Date</TableHead>
                  )}
                  {visibleColumns.collectionLocation && (
                    <TableHead>Collection Location</TableHead>
                  )}
                  {visibleColumns.status && <TableHead>Status</TableHead>}
                  {visibleColumns.comments && (
                    <TableHead className="min-w-[150px]">Comments</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataLoading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                      Loading data...
                    </TableCell>
                  </TableRow>
                ) : (
                      filteredData.map((winData, idx) => (
                        <TableRow key={winData._id} className={!winData.subscriber ? 'bg-red-100 hover:bg-red-100' : ""}>

                      <TableCell className="">
                        {startIndex + idx + 1}
                      </TableCell>
                          {winData.subscriber ? <>
                            {visibleColumns.name && (
                              <TableCell className="font-medium">
                                {winData.subscriber.name}
                              </TableCell>
                            )}
                            {visibleColumns.mobile && (
                              <TableCell>
                                {`+(${winData.subscriber.countryCode})${formatPhoneNumber(winData.subscriber.mobile)}`}
                              </TableCell>
                            )}
                            {visibleColumns.email && (
                              <TableCell>{winData.subscriber.email}</TableCell>
                            )}

                            {visibleColumns.address && (
                              <TableCell>{winData.subscriber.address}</TableCell>
                            )}</> : <>
                            {visibleColumns.name && (
                              <TableCell className="font-medium">
                              </TableCell>
                            )}
                            {visibleColumns.mobile && (
                              <TableCell>
                                Data did not match
                              </TableCell>
                            )}
                            {visibleColumns.email && (
                              <TableCell>{ }</TableCell>
                              )}

                            {visibleColumns.address && (
                              <TableCell>{ }</TableCell>
                            )}</>}

                      {visibleColumns.collectionDate && (
                        <TableCell>
                          {new Date(winData.collectionDate).toDateString()}
                        </TableCell>
                      )}
                          <TableCell onClick={() => { typeof winData.collectionLocation !== 'string' && setCurrentSelectedLocation(winData.collectionLocation) }} className='cursor-pointer hover:bg-white rounded-md transition-all'>
                            {typeof winData.collectionLocation !== 'string' && visibleColumns.collectionLocation ? (
                              <div className="space-y-1">
                                <div className="font-semibold">{winData.collectionLocation.companyName}</div>
                                <div className="text-sm text-muted-foreground">{winData.collectionLocation.address}</div>
                                <div className="text-sm text-muted-foreground">{winData.collectionLocation.city}, {winData.collectionLocation.state}, {winData.collectionLocation.country}</div>
                                <div className="text-sm text-muted-foreground">{formatPhoneNumber(winData.collectionLocation.phone)}</div>
                              </div>
                            ) : <>{winData.collectionLocation}</>}
                          </TableCell>
                      {visibleColumns.status && (
                        <TableCell>
                          <Select
                            value={winData.status}
                            onValueChange={value =>
                              handleStatusChange(winData._id, value as Status)
                            }
                          >
                            <SelectTrigger
                              className={`w-[130px] ${statusColorMap[winData.status]}`}
                            >
                              <SelectValue>{winData.status}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(status => (
                                <SelectItem key={status} value={status}>
                                  {status}
                                </SelectItem>
                          ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      )}
                      {visibleColumns.comments && (
                        <TableCell>{winData.comments}</TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground py-4">
            Showing {startIndex + 1} to{' '}
            {Math.min(endIndex, filteredData.length)} of {filteredData.length}{' '}
            entries
          </div>
          {!dataLoading && totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>

      <Dialog open={currentSelectedLocation !== null} onOpenChange={(value) => !value && setCurrentSelectedLocation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Collection Location Details</DialogTitle>
            <DialogDescription>
              Detailed information about the collection location.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh]">
            {currentSelectedLocation && (
              <div className="space-y-4">
                <div>
                  <Label>Company Name</Label>
                  <p>{currentSelectedLocation.companyName}</p>
                </div>
                <div>
                  <Label>Contact Name</Label>
                  <p>{currentSelectedLocation.contactName}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p>{currentSelectedLocation.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p>{formatPhoneNumber(currentSelectedLocation.phone)}</p>
                </div>
                <div>
                  <Label>Address</Label>
                  <p>{currentSelectedLocation.address}</p>
                </div>
                <div>
                  <Label>City</Label>
                  <p>{currentSelectedLocation.city}</p>
                </div>
                <div>
                  <Label>State</Label>
                  <p>{currentSelectedLocation.state}</p>
                </div>
                <div>
                  <Label>Country</Label>
                  <p>{currentSelectedLocation.country}</p>
                </div>
                <div>
                  <Label>Opening Hours</Label>
                  <p>{currentSelectedLocation.openingHours}</p>
                </div>
                <div>
                  <Label>Website</Label>
                  <p>{currentSelectedLocation.website}</p>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>

  );
}
