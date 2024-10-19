import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, Trash2, Edit } from 'lucide-react';
import { UploadButton } from '@/uploadThing/dropZone';
import { STORE_COUPONSETTINGS } from '@/graphQL/apiRequests';
import { GET_COUPONSETTINGS } from '@/graphQL/apiRequests';
import { useMutation } from '@apollo/client';
import { useQuery } from '@apollo/client';
import * as yup from 'yup';

const generator = (function* incrementingGenerator(
  start: number = 0
): Generator<number> {
  let counter = start;
  while (true) {
    yield counter++;
  }
})();

const prizeSchema = yup.object({
  id: yup.number(),
  image: yup.string().required(),
  bias: yup.number().required('Bias is required').min(0).max(100),
});

const locationSchema = yup.object({
  companyName: yup.string().required('Company Name is required'),
  contactName: yup.string().optional(),
  phone: yup
    .string()
    .optional()
    .matches(/^[0-9]+$/, 'Phone must be numeric'),
  email: yup.string().optional().email('Must be a valid email'),
  website: yup.string().optional().url('Must be a valid URL'),
  openingHours: yup.string().optional(),
  address: yup.string().optional(),
  zipCode: yup.number().optional().positive().integer(),
  city: yup.string().optional(),
  country: yup.string().optional(),
  state: yup.string().optional(),
  latitude: yup.string().optional(),
  longitude: yup.string().optional(),
});

const adminPanelStateSchema = yup.object({
  prizes: yup.array().of(prizeSchema).required(),
  locations: yup.array().of(locationSchema).required(),
  currentLocation: locationSchema.required(),
  isAddingLocation: yup.boolean().required(),
  isLocationSheetOpen: yup.boolean().required(),
  companyLogoUrl: yup
    .string()
    .required('Company Logo URL is required')
    .url('Must be a valid URL'),
  scratchCardBackground: yup
    .string()
    .required('Scratch Card Background is required')
    .url('Must be a valid URL'),
  losingPrizeUrl: yup
    .string()
    .required('Losing Prize URL is required')
    .url('Must be a valid URL'),
  couponTitle: yup.string().required('Coupon Title is required'),
  couponSubtitle: yup.string().required('Coupon Subtitle is required'),
  description: yup.string().required('Description is required'),
  terms: yup.string().required('Terms are required'),
  congrats: yup.string().required('Congrats message is required'),
  validationTitle: yup.string().required('Validation Title is required'),
});

type AdminPanelState = yup.InferType<typeof adminPanelStateSchema>;

type Prizes = yup.InferType<typeof prizeSchema>;
type Location = yup.InferType<typeof locationSchema>;

export default function AdminPanel() {

  const [storeCouponSettings,
    // { data, loading, error }
  ] =
    useMutation(STORE_COUPONSETTINGS);

  const {
    data: dataFetched,
    loading: loadingCoupon,
    error: errorCoupon,
  } = useQuery(GET_COUPONSETTINGS);

  const getExistingSettings = () => {
    if (loadingCoupon) {
      return;
    }

    if (errorCoupon) {
      console.error('Error fetching coupon settings:', errorCoupon);
      return;
    }

    if (dataFetched) {
      // TODO Existing coupon settings
      // console.log(
      //   'Fetched coupon settings:',
      //   dataFetched.getCouponSettingsAlbayan
      // );
    }
  };

  getExistingSettings();

  const [state, setState] = useState<AdminPanelState>({
    prizes: [],
    locations: [],
    currentLocation: { companyName: '' },
    isAddingLocation: false,
    isLocationSheetOpen: false,
    companyLogoUrl: '',
    scratchCardBackground: '',
    losingPrizeUrl: '',
    couponTitle: '',
    couponSubtitle: '',
    description: '',
    terms: '',
    congrats: '',
    validationTitle: '',
  });

  const [adminPanelErrors, setAdminPanelErrors] = useState<
    Record<string, string>
  >({});
  const [locationPanelErrors, setLocationPanelErrors] = useState<
    Record<string, string>
  >({});
  const [prizePanelErrors, setPrizePanelErrors] = useState<
    Record<string, string>
  >({});

  const addPrize = () => {
    setState({
      ...state,
      prizes: [
        ...state.prizes,
        { image: '', bias: 0, id: generator.next().value },
      ],
    });
  };

  const updatePrize = <T extends 'image' | 'bias'>(
    id: number,
    field: T,
    value: T extends 'image' ? string : number
  ) => {
    const updatedPrizes = [...state.prizes];
    updatedPrizes[id][field] = value as Prizes[T];
    setState({ ...state, prizes: updatedPrizes });
  };

  const openAddLocationSheet = () => {
    setState({
      ...state,
      isAddingLocation: true,
      isLocationSheetOpen: true,
    });
  };

  const openEditLocationSheet = (location: Location) => {
    setState({
      ...state,
      currentLocation: location,
      isAddingLocation: false,
      isLocationSheetOpen: true,
    });
  };

  const saveLocation = () => {
    locationSchema
      .validate(state.currentLocation, { abortEarly: false })
      .then(() => {
        setLocationPanelErrors({});
        if (state.isAddingLocation && state.currentLocation) {
          setState({
            ...state,
            currentLocation: { companyName: '' },
            locations: [...state.locations, state.currentLocation],
            isLocationSheetOpen: false,
          });
        } else {
          const updatedLocations = state.locations.map(loc =>
            loc === state.currentLocation ? { ...state.currentLocation } : loc
          );
          setState({
            ...state,
            currentLocation: { companyName: '' },
            locations: updatedLocations,
            isLocationSheetOpen: false,
          });
        }
      })
      .catch(err => {
        const errors: Record<string, string> = {};
        err.inner.forEach((error: { path: string; message: string }) => {
          errors[error.path] = error.message; // error.path is the field, error.message is the error message
        });
        setLocationPanelErrors(errors);
      });
  };

  const updateCurrentLocation = <K extends keyof Location>(
    field: K,
    value: Location[K] extends number ? number : string
  ) => {
    setState({
      ...state,
      currentLocation: { ...state.currentLocation, [field]: value },
    });
  };
  const getError = (fieldPath: string, error: Record<string, string>) => {
    return error[fieldPath] || null;
  };
  const handleSubmit = async () => {
    // Log the entire state if all images are uploaded
    let prizeValidation = false;
    let adminValidation = false;
    prizeSchema
      .validate(state, { abortEarly: false })
      .then(() => {
        prizeValidation = true;
      })
      .catch(err => {
        const errors: Record<string, string> = {};
        err.inner.forEach((error: { path: string; message: string }) => {
          errors[error.path] = error.message; // error.path is the field, error.message is the error message
        });
        setPrizePanelErrors(errors);
      });

    adminPanelStateSchema
      .validate(state, { abortEarly: false })
      .then(() => {
        adminValidation = true;
      })
      .catch(err => {
        const errors: Record<string, string> = {};
        err.inner.forEach((error: { path: string; message: string }) => {
          errors[error.path] = error.message; // error.path is the field, error.message is the error message
        });
        setAdminPanelErrors(errors);
      });
    if (!prizeValidation || !adminValidation) return;
    if (state.companyLogoUrl === '' || state.scratchCardBackground === '') {
      // TODO Show this bro
    }

    // TODO check all fields set bro then only let him hit the backend
    try {
      const response = await storeCouponSettings({
        variables: {
          input: state,
        },
      });

      // TODO Show this bro
      if (response && response.data) {
        const { isSuccessful } = response.data.storeCouponSettings;

        if (isSuccessful) {
          // TODO success message bro
          // console.log(message);
        } else {
          // TODO error message bro
          // console.log(message);
        }
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Error in storing coupon settings:', error);
    }
  };

  type ErrorType = keyof AdminPanelState | keyof Location | keyof Prizes;

  const ErrorMessage = ({
    field,
    error,
  }: {
    field: ErrorType;
    error: Record<string, string>;
  }) =>
    getError(field, error) && (
      <span className="text-red-600">{getError(field, error)}</span>
    );
  const tabHasError = (tab: string) => {
    // console.log(tab, adminPanelErrors)
    const hasFields = (fields: string[]) => {
      for (const field of fields) {
        if (adminPanelErrors[field]) return true;
      }

    }
    switch (tab) {
      case 'logo-upload':
        return Object.keys(adminPanelErrors).length > 0;
      case 'prizes':
        return Object.keys(prizePanelErrors).length > 0;
      case 'coupon-info':
        return hasFields(['couponTitle', 'couponSubtitle', 'description', 'terms', 'congrats']);
      case 'locations':
        return Object.keys(locationPanelErrors).length > 0;
      case 'validation':
        return Object.keys(adminPanelErrors).length > 0;
      default:
        return false;
    }
  };
  return (
    <>
      <div className="container mx-auto p-4 min-h-screen">
        <Tabs defaultValue="logo-upload" className="space-y-4">
          <TabsList className="flex flex-col sm:flex-row h-auto gap-2">
            <TabsTrigger value="logo-upload" className='w-full sm:w-auto relative'>
              {tabHasError('prizes') ? <span className='absolute bg-red-500 right-1 top-1 w-[6px] h-[6px]  rounded-full'></span> : null}
              Logo & Image
            </TabsTrigger>
            <TabsTrigger value="prizes" className='w-full sm:w-auto relative'>
              {tabHasError('prizes') ? <span className='absolute bg-red-500 right-1 top-1 w-[6px] h-[6px]  rounded-full'></span> : null}
              Prizes
            </TabsTrigger>
            <TabsTrigger value="coupon-info" className='w-full sm:w-auto relative'>
              {tabHasError('coupon-info') ? <span className='absolute bg-red-500 right-1 top-1 w-[6px] h-[6px]  rounded-full'></span> : null}
              Coupon Info
            </TabsTrigger>
            <TabsTrigger value="locations" className='w-full sm:w-auto relative'>
              {tabHasError('locations') ? <span className='absolute bg-red-500 right-1 top-1 w-[6px] h-[6px]  rounded-full'></span> : null}
              Locations
            </TabsTrigger>
            <TabsTrigger value="validation" className='w-full sm:w-auto relative'>
              {tabHasError('validation') ? <span className='absolute bg-red-500 right-1 top-1 w-[6px] h-[6px]  rounded-full'></span> : null}
              Validation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logo-upload">
            <Card>
              <CardHeader>
                <CardTitle>Logo & Scratch Image Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="logo-upload">Company Logo</Label>
                  <UploadButton
                    endpoint="logoUpload"
                    files={state.companyLogoUrl}
                    onComplete={file => {
                      if (file) {
                        setState({
                          ...state,
                          companyLogoUrl: file[0].url,
                        });
                      }
                      // file
                    }}
                  />
                  <ErrorMessage
                    field="companyLogoUrl"
                    error={adminPanelErrors}
                  />
                  {/* <Input id="logo-upload" type="file" onChange={(e) => handleFileUpload(e)} /> */}
                </div>
                <div>
                  <Label htmlFor="scratch-image-upload">
                    Scratch Card Background
                  </Label>
                  <UploadButton
                    endpoint="scratchCardBackground"
                    files={state.scratchCardBackground}
                    onComplete={file => {
                      if (file) {
                        setState({
                          ...state,
                          scratchCardBackground: file[0].url,
                        });
                      }
                      // file
                    }}
                  />
                  <ErrorMessage
                    field="scratchCardBackground"
                    error={adminPanelErrors}
                  />
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
                {state.prizes.map((prize, index) => (
                  <div
                    key={index}
                    className="flex sm:flex-row items-end h-full sm:items-center space-y-2 sm:space-y-0 sm:space-x-2"
                  >
                    <div className="h-full">
                      <Label htmlFor={'prizeImage' + index}>Prize Image</Label>
                      <UploadButton
                        endpoint="prizeImage"
                        files={state.prizes[index].image}
                        onComplete={file => {
                          updatePrize(index, 'image', file[0].url);
                        }}
                      />
                      <ErrorMessage field="image" error={prizePanelErrors} />
                    </div>
                    <div className="h-full">
                      <Label htmlFor={'prizeBias' + index}>Prize Bias</Label>
                      <Input
                        id={'prizeBias' + index}
                        type="number"
                        placeholder="Bias (0-100)"
                        value={prize.bias}
                        onChange={e =>
                          updatePrize(index, 'bias', parseInt(e.target.value))
                        }
                        min="0"
                        max="100"
                        className="w-full sm:w-auto"
                      />
                    </div>
                    <div className="flex h-full justify-end items-end">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() =>
                          setState({
                            ...state,
                            prizes: state.prizes.filter((_, i) => i !== index),
                          })
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {state.prizes.length > 0 &&
                  <div>
                    Total Bias: {state.prizes.reduce((total, data) => {
                      return total + data.bias
                    }, 0)}
                    /100
                  </div>
                }
                <Button onClick={addPrize}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Prize
                </Button>
                <div>
                  <Label htmlFor="losing-image-upload">Losing Image</Label>
                  <UploadButton
                    endpoint="prizeImage"
                    files={state.losingPrizeUrl}
                    onComplete={file => {
                      if (file) {
                        setState({
                          ...state,
                          losingPrizeUrl: file[0].url,
                        });
                      }
                    }}
                  />
                  <ErrorMessage
                    field="losingPrizeUrl"
                    error={adminPanelErrors}
                  />
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
                  <Input
                    id="coupon-title"
                    placeholder="Enter coupon title"
                    value={state.couponTitle}
                    onChange={e =>
                      setState({ ...state, couponTitle: e.target.value })
                    }
                  />
                  <ErrorMessage field="couponTitle" error={adminPanelErrors} />
                </div>
                <div>
                  <Label htmlFor="coupon-subtitle">Coupon Subtitle</Label>
                  <Input
                    id="coupon-subtitle"
                    placeholder="Enter coupon subtitle"
                    value={state.couponSubtitle}
                    onChange={e =>
                      setState({ ...state, couponSubtitle: e.target.value })
                    }
                  />
                  <ErrorMessage
                    field="couponSubtitle"
                    error={adminPanelErrors}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter description"
                    value={state.description}
                    onChange={e =>
                      setState({ ...state, description: e.target.value })
                    }
                  />
                  <ErrorMessage field="description" error={adminPanelErrors} />
                </div>
                <div>
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    placeholder="Enter terms and conditions"
                    value={state.terms}
                    onChange={e =>
                      setState({ ...state, terms: e.target.value })
                    }
                  />
                  <ErrorMessage field="terms" error={adminPanelErrors} />
                </div>
                <div>
                  <Label htmlFor="congrats">Congratulations Description</Label>
                  <Textarea
                    id="congrats"
                    placeholder="Enter congratulations text"
                    value={state.congrats}
                    onChange={e =>
                      setState({ ...state, congrats: e.target.value })
                    }
                  />
                  <ErrorMessage field="congrats" error={adminPanelErrors} />
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
                {state.locations.map((location, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0"
                  >
                    <div>
                      <h3 className="font-bold">{location.companyName}</h3>
                      <p>
                        {location.address}, {location.city}, {location.country}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditLocationSheet(location)}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          setState({
                            ...state,
                            locations: state.locations.filter(
                              (_, i) => i !== index
                            ),
                          })
                        }
                      >
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
                  <Label htmlFor="validation-title">
                    Title on Validation Page
                  </Label>
                  <Input
                    id="validation-title"
                    placeholder="Enter title for validation page"
                    value={state.validationTitle}
                    onChange={e =>
                      setState({ ...state, validationTitle: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Sheet
          open={state.isLocationSheetOpen}
          onOpenChange={isOpen =>
            setState({ ...state, isLocationSheetOpen: isOpen })
          }
        >
          <SheetContent
            side="right"
            className="w-full sm:w-[540px] overflow-y-auto"
          >
            <SheetHeader>
              <SheetTitle>
                {state.isAddingLocation ? 'Add New Location' : 'Edit Location'}
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="grid gap-4 py-4 px-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={state.currentLocation.companyName || ''}
                    onChange={e =>
                      updateCurrentLocation('companyName', e.target.value)
                    }
                  />
                  <ErrorMessage
                    field="companyName"
                    error={locationPanelErrors}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Contact Name</Label>
                  <Input
                    id="contact-name"
                    value={state.currentLocation.contactName || ''}
                    onChange={e =>
                      updateCurrentLocation('contactName', e.target.value)
                    }
                  />
                  <ErrorMessage
                    field="contactName"
                    error={locationPanelErrors}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={state.currentLocation.email || ''}
                    onChange={e =>
                      updateCurrentLocation('email', e.target.value)
                    }
                  />
                  <ErrorMessage field="email" error={locationPanelErrors} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={state.currentLocation.phone || ''}
                    onChange={e =>
                      updateCurrentLocation('phone', e.target.value)
                    }
                  />
                  <ErrorMessage field="phone" error={locationPanelErrors} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={state.currentLocation.website || ''}
                    onChange={e =>
                      updateCurrentLocation('website', e.target.value)
                    }
                  />
                  <ErrorMessage field="website" error={locationPanelErrors} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hours">Opening Hours</Label>
                  <Input
                    id="hours"
                    value={state.currentLocation.openingHours || ''}
                    onChange={e =>
                      updateCurrentLocation('openingHours', e.target.value)
                    }
                  />
                  <ErrorMessage
                    field="openingHours"
                    error={locationPanelErrors}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={state.currentLocation.address || ''}
                    onChange={e =>
                      updateCurrentLocation('address', e.target.value)
                    }
                  />
                  <ErrorMessage field="address" error={locationPanelErrors} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">Zip/Postal Code</Label>
                  <Input
                    id="zip"
                    value={state.currentLocation.zipCode || ''}
                    onChange={e =>
                      updateCurrentLocation('zipCode', e.target.value)
                    }
                  />
                  <ErrorMessage field="zipCode" error={locationPanelErrors} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={state.currentLocation.city || ''}
                    onChange={e =>
                      updateCurrentLocation('city', e.target.value)
                    }
                  />
                  <ErrorMessage field="city" error={locationPanelErrors} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={state.currentLocation.country || ''}
                    onValueChange={value =>
                      updateCurrentLocation('country', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">UAE</SelectItem>
                    </SelectContent>
                  </Select>
                  <ErrorMessage field="country" error={locationPanelErrors} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Province/State</Label>
                  <Input
                    id="state"
                    value={state.currentLocation.state || ''}
                    onChange={e =>
                      updateCurrentLocation('state', e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    value={state.currentLocation.latitude || ''}
                    onChange={e =>
                      updateCurrentLocation('latitude', e.target.value)
                    }
                  />
                  <ErrorMessage field="latitude" error={locationPanelErrors} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    value={state.currentLocation.longitude || ''}
                    onChange={e =>
                      updateCurrentLocation('longitude', e.target.value)
                    }
                  />
                  <ErrorMessage field="longitude" error={locationPanelErrors} />
                </div>
              </div>
            </ScrollArea>
            <div className="mt-4 flex justify-end">
              <Button onClick={saveLocation}>
                {state.isAddingLocation ? 'Add Location' : 'Save Changes'}
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex justify-end mt-10">
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </>
  );
}
