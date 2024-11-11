import { useEffect, useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { ToastAction } from '@/components/ui/toast';
import skeleton from './skeleton';
import Loader from '@/albayan/loader';
import PrizeDistributor from '../prizeDestributor/prizeDistributor';
import { useNavigate } from 'react-router-dom';

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
const prizesArraySchema = yup.array().of(prizeSchema).min(1, 'At least one prize is required');

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
  city: yup.string().optional(),
  country: yup.string().optional(),
  state: yup.string().optional(),
  latitude: yup.string().optional(),
  longitude: yup.string().optional(),
});

const adminPanelStateSchema = yup.object({
  prizes: yup.array().of(prizeSchema).required(),
  locations: yup.array().of(locationSchema).required(),
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
export type LocationInterface = yup.InferType<typeof locationSchema>;

export default function AdminPanel() {
  const { toast } = useToast()
  const [storeCouponSettings,
    { loading }
  ] =
    useMutation(STORE_COUPONSETTINGS);


  const {
    data: dataFetched,
    loading: loadingCoupon,
    error: errorCoupon,
    refetch: refetchCoupon,
  } = useQuery(GET_COUPONSETTINGS);


  const [currentLocation, setCurrentLocation] = useState<LocationInterface>({ companyName: '' })
  const [isAddingLocation, setIsAddingLocation] = useState(false);
  const [isLocationSheetOpen, setIsLocationSheetOpen] = useState(false);
  const [state, setState] = useState<AdminPanelState>({
    prizes: [{ image: '', bias: 0, id: generator.next().value }],
    locations: [],
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
  const navigate = useNavigate();

  useEffect(() => {
    if (window.localStorage.getItem("adminToken") === null) {
      navigate("../admin/login")
    }
  })

  useEffect(() => {
    if (dataFetched && Object.keys(dataFetched.getCouponSettingsAlbayan).length > 0) {
      setState(dataFetched.getCouponSettingsAlbayan);
    }

    if (errorCoupon) {
      toast({
        title: 'Error',
        description: 'Error fetching coupon settings',
        action: <ToastAction onClick={() => window.location.reload()} altText="Reload">Reload</ToastAction>,
        variant: "destructive",
        duration: 100000,
      })
    }
  }, [dataFetched, errorCoupon, refetchCoupon, toast]);

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
    setState((prev) => ({
      ...prev,
      prizes: [
        ...prev.prizes,
        { image: '', bias: 0, id: generator.next().value },
      ],
    }));
  };

  const updatePrize = <T extends 'image' | 'bias'>(
    id: number,
    field: T,
    value: T extends 'image' ? string : number
  ) => {
    setState((prev) => {
      const updatedPrizes = [...prev.prizes];
      updatedPrizes[id][field] = value as Prizes[T];
      return { ...prev, prizes: updatedPrizes }
    });
  };

  const openAddLocationSheet = () => {
    setIsAddingLocation(true);
    setIsLocationSheetOpen(true);

  };

  const openEditLocationSheet = (location: LocationInterface) => {
    setCurrentLocation(location);
    setIsAddingLocation(false);
    setIsLocationSheetOpen(true);

  };

  const saveLocation = () => {
    locationSchema
      .validate(currentLocation, { abortEarly: false })
      .then(() => {
        setLocationPanelErrors({});
        if (isAddingLocation && currentLocation) {
          setCurrentLocation({ companyName: '' });
          setIsLocationSheetOpen(false);
          setState((prev) => ({
            ...prev,
            locations: [...prev.locations, currentLocation],
          }));
        } else {

          setCurrentLocation({ companyName: '' });
          setIsLocationSheetOpen(false);
          setState((prev) => {
            const updatedLocations = prev.locations.map(loc =>
              loc === currentLocation ? { ...currentLocation } : loc
            );
            return {
              ...prev,
              locations: updatedLocations,
            }
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

  const updateCurrentLocation = <K extends keyof LocationInterface>(
    field: K,
    value: LocationInterface[K] extends number ? number : string
  ) => {
    setCurrentLocation({ ...currentLocation, [field]: value });
  };
  const getError = (fieldPath: string, error: Record<string, string>) => {
    return error[fieldPath]?.replace(/\[\d\]./g, '') || null;
  };
  const handleSubmit = async () => {
    // Log the entire state if all images are uploaded
    let prizeValidation = false;
    let adminValidation = false;
    try {
      await prizesArraySchema.validate(state.prizes, { abortEarly: false });
      prizeValidation = true;
      setPrizePanelErrors({})
    } catch (err: any) {
      const errors: Record<string, string> = {};
      err.inner.forEach((error: { path: string; message: string }) => {
        errors[error.path] = error.message; // error.path is the field, error.message is the error message
      });
      console.log(errors)
      setPrizePanelErrors(errors);
    }

    try {
      await adminPanelStateSchema.validate(state, { abortEarly: false });
      adminValidation = true;
      setAdminPanelErrors({})
    } catch (err: any) {
      const errors: Record<string, string> = {};
      err.inner.forEach((error: { path: string; message: string }) => {
        errors[error.path] = error.message; // error.path is the field, error.message is the error message
      });
      setAdminPanelErrors(errors);
    }

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
          toast({
            title: 'Success',
            description: 'Coupon settings saved successfully',
            variant: "default",
            duration: 5000,
          })
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

  type ErrorType = keyof AdminPanelState | keyof LocationInterface | keyof Prizes | `[${number}].image` | `[${number}].bias`;

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
    const hasFields = (fields: string[]) => {
      for (const field of fields) {
        if (adminPanelErrors[field]) return true;
      }

    }
    switch (tab) {
      case 'logo-upload':
        return hasFields(['companyLogoUrl', 'scratchCardBackground']);
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
      {loading && <Loader />}
      <div className="container mx-auto p-4 min-h-screen relative">

        <Tabs defaultValue="logo-upload" className="space-y-4">
          <TabsList className="flex flex-col sm:flex-row h-auto gap-2">
            <TabsTrigger value="logo-upload" className='w-full sm:w-auto relative'>
              {tabHasError('logo-upload') ? <span className='absolute bg-red-500 right-1 top-1 w-[6px] h-[6px]  rounded-full'></span> : null}
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
            <TabsTrigger value="prizeDistributor" className='w-full sm:w-auto relative'>
              {tabHasError('validation') ? <span className='absolute bg-red-500 right-1 top-1 w-[6px] h-[6px]  rounded-full'></span> : null}
              Prize Distribution
            </TabsTrigger>
          </TabsList>

          <TabsContent value="logo-upload" className='relative'>
            <Card>
              <CardHeader>
                <CardTitle>Logo & Scratch Image Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div >
                  {loadingCoupon ? skeleton.label("w-36") :
                    <Label htmlFor="logo-upload">Company Logo</Label>
                  }
                  {loadingCoupon ? skeleton.upload : <UploadButton
                    endpoint="logoUpload"
                    files={state.companyLogoUrl}
                    onComplete={file => {
                      if (file) {
                        setState((prev) => ({
                          ...prev,
                          companyLogoUrl: file[0].url,
                        }));
                      }
                      // file
                    }}
                    onDelete={() => {
                      setState((prev) => ({
                        ...prev,
                        companyLogoUrl: "",
                      }))
                    }}
                  />}

                  <ErrorMessage
                    field="companyLogoUrl"
                    error={adminPanelErrors}
                  />
                  {/* <Input id="logo-upload" type="file" onChange={(e) => handleFileUpload(e)} /> */}
                </div>
                <div>
                  {loadingCoupon ? skeleton.label("w-52") :
                    <Label htmlFor="scratch-image-upload">
                      Scratch Card Background
                    </Label>
                  }
                  {loadingCoupon ? skeleton.upload : <UploadButton
                    endpoint="logoUpload"
                    files={state.scratchCardBackground}
                    onComplete={file => {
                      if (file) {
                        setState((prev) => ({
                          ...prev,
                          scratchCardBackground: file[0].url,
                        }));
                      }
                      // file
                    }}
                    onDelete={() => setState((prev) => ({
                      ...prev,
                      scratchCardBackground: "",
                    }))}
                  />}
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
                {loadingCoupon ? skeleton.upload :
                  state.prizes.map((prize, index) => (
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
                          onDelete={() => setState((prev) => ({
                            ...prev,
                            prizes: prev.prizes.filter((_, i) => i !== index),
                          }))}
                        />

                        <ErrorMessage field={`[${index}].image`} error={prizePanelErrors} />
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
                          disabled={!(state.prizes.length > 1)}
                          variant="destructive"
                          size="icon"
                          onClick={() =>
                            setState((prev) => ({
                              ...prev,
                              prizes: prev.prizes.filter((_, i) => i !== index),
                            }))
                          }
                        >

                          <Trash2 className="h-4 w-4" />
                        </Button>


                      </div>
                    </div>
                  ))}
                {loadingCoupon ? skeleton.totalBias : state.prizes.length > 0 &&
                  <div>
                    Total Bias: {state.prizes.reduce((total, data) => {
                      return total + data.bias
                    }, 0)}
                    /100
                  </div>
                }
                {loadingCoupon ? skeleton.button : <Button onClick={addPrize}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Prize
                </Button>}


                <div>
                  {loadingCoupon ? skeleton.label("w-36") :
                    <Label htmlFor="losing-image-upload">Losing Image</Label>
                  }
                  {loadingCoupon ? skeleton.upload :
                    <UploadButton
                      endpoint="prizeImage"
                      files={state.losingPrizeUrl}
                      onComplete={file => {
                        if (file) {
                          setState((prev) => ({
                            ...prev,
                            losingPrizeUrl: file[0].url,
                          }));
                        }
                      }}
                      onDelete={() => setState((prev) => ({
                        ...prev,
                        losingPrizeUrl: "",
                      }))}
                    />
                  }

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
                  {loadingCoupon ? skeleton.label("w-32") :
                    <Label htmlFor="coupon-title">Coupon Title</Label>
                  }
                  {loadingCoupon ? skeleton.input : <Input
                    id="coupon-title"
                    placeholder="Enter coupon title"
                    value={state.couponTitle}
                    onChange={e =>
                      setState((prev) => ({ ...prev, couponTitle: e.target.value }))
                    }
                  />}

                  <ErrorMessage field="couponTitle" error={adminPanelErrors} />
                </div>
                <div>
                  {loadingCoupon ? skeleton.label("w-36") : <Label htmlFor="coupon-subtitle">Coupon Subtitle</Label>}
                  {loadingCoupon ? skeleton.input : <Input
                    id="coupon-subtitle"
                    placeholder="Enter coupon subtitle"
                    value={state.couponSubtitle}
                    onChange={e =>
                      setState((prev) => ({ ...prev, couponSubtitle: e.target.value }))
                    }
                  />}
                  <ErrorMessage
                    field="couponSubtitle"
                    error={adminPanelErrors}
                  />
                </div>
                <div>
                  {loadingCoupon ? skeleton.label("w-28") :
                    <Label htmlFor="description">Description</Label>}
                  {loadingCoupon ? skeleton.textArea : <Textarea
                    id="description"
                    placeholder="Enter description"
                    value={state.description}
                    onChange={e =>
                      setState((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />}
                  <ErrorMessage field="description" error={adminPanelErrors} />
                </div>
                <div>
                  {loadingCoupon ? skeleton.label("w-40") :
                    <Label htmlFor="terms">Terms & Conditions</Label>}
                  {loadingCoupon ? skeleton.textArea : <Textarea
                    id="terms"
                    placeholder="Enter terms and conditions"
                    value={state.terms}
                    onChange={e =>
                      setState((prev) => ({ ...prev, terms: e.target.value }))
                    }
                  />}
                  <ErrorMessage field="terms" error={adminPanelErrors} />
                </div>
                <div>
                  {loadingCoupon ? skeleton.label("w-52") :
                    <Label htmlFor="congrats">Congratulations Description</Label>}
                  {loadingCoupon ? skeleton.textArea : <Textarea
                    id="congrats"
                    placeholder="Enter congratulations text"
                    value={state.congrats}
                    onChange={e =>
                      setState((prev) => ({ ...prev, congrats: e.target.value }))
                    }
                  />}
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
                          setState((prev) => ({
                            ...prev,
                            locations: prev.locations.filter(
                              (_, i) => i !== index
                            ),
                          }))
                        }
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </div>
                  </div>
                ))}
                {loadingCoupon ? skeleton.button :
                  <Button onClick={openAddLocationSheet}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Location
                  </Button>
                }
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="validation">
            <Card>
              <CardHeader>
                <CardTitle>Validation Page</CardTitle>
              </CardHeader>
              <CardContent>
                <div className=''>
                  {loadingCoupon ? skeleton.label('w-52') :
                    <Label htmlFor="validation-title">
                      Title on Validation Page
                    </Label>}
                  {loadingCoupon ? skeleton.input :
                    <Input
                      id="validation-title"
                      placeholder="Enter title for validation page"
                      value={state.validationTitle}
                      onChange={e =>
                        setState((prev) => ({ ...prev, validationTitle: e.target.value }))
                      }
                    />}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="prizeDistributor">
            <PrizeDistributor />
          </TabsContent>
        </Tabs>

        <Sheet
          open={isLocationSheetOpen}
          onOpenChange={isOpen =>
            setIsLocationSheetOpen(isOpen)
          }
        >
          <SheetContent
            side="right"
            className="w-full sm:w-[540px] overflow-y-auto"
          >
            <SheetHeader>
              <SheetTitle>
                {isAddingLocation ? 'Add New Location' : 'Edit Location'}
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)]">
              <div className="grid gap-4 py-4 px-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={currentLocation.companyName || ''}
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
                    value={currentLocation.contactName || ''}
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
                    value={currentLocation.email || ''}
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
                    value={currentLocation.phone || ''}
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
                    value={currentLocation.website || ''}
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
                    value={currentLocation.openingHours || ''}
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
                    value={currentLocation.address || ''}
                    onChange={e =>
                      updateCurrentLocation('address', e.target.value)
                    }
                  />
                  <ErrorMessage field="address" error={locationPanelErrors} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={currentLocation.city || ''}
                    onChange={e =>
                      updateCurrentLocation('city', e.target.value)
                    }
                  />
                  <ErrorMessage field="city" error={locationPanelErrors} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={currentLocation.country || ''}
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
                    value={currentLocation.state || ''}
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
                    value={currentLocation.latitude || ''}
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
                    value={currentLocation.longitude || ''}
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
                {isAddingLocation ? 'Add Location' : 'Save Changes'}
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


