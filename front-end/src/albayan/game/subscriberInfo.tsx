import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';
import { UPDATE_SUBSCRIBER } from '@/graphQL/apiRequests';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@apollo/client';
import { useFormik } from 'formik';

import * as Yup from 'yup';
import { SubscriberDetails } from './phoneForm';
import { decodeJWT } from '@/jwtUtils';



const validationSchema = Yup.object({
  name: Yup.string()
    .min(3, 'Name cannot be less than 3 character')
    .required('Name is required'),

  emiratesId: Yup.string()
    .matches(/^\d{15}$/, 'Emirates ID must be exactly 15 digits long')
    .required('Emirates ID is required'),

  address: Yup.string().required('Address is required'),

  email: Yup.string().email('Invalid email format').required('Email is required')
});
interface SubscriberInfoProps {
  subscriber: SubscriberDetails;
  successCallback: (data: SubscriberUpdate) => void;
}
export type SubscriberUpdate = {
  isSuccessful: boolean
  message: string
  jwtToken: string

}
export default function SubscriberInfo({ subscriber, successCallback }: SubscriberInfoProps) {

  const { toast } = useToast()
  const formik = useFormik({
    initialValues: {
      countryCode: subscriber.countryCode,
      phoneNumber: subscriber.mobile,
      emiratesId: subscriber.emirateID,
      name: subscriber.name,
      address: subscriber.address,
      email: subscriber.email,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await new Promise((resolve, reject) => {
        updateSubscriber({
          variables: {
            countryCode: subscriber.countryCode,
            mobile: subscriber.mobile,
            emirateId: values.emiratesId,
            email: values.email,
            name: values.name,
            address: values.address,
          },
          onCompleted(data) {
            toast({ description: 'Successfully updated subscriber info' })
            window.localStorage.setItem("subscriberToken", data.updateSubscriber.jwtToken);
            data = data.updateSubscriber
            successCallback(data)
            resolve(data)
          },
          onError(error) {
            toast({
              variant: 'destructive',
              description: 'An error occurred. Please try again later.'
            })
            reject(error)
          }
        });
      })

    },
  });

  const [updateSubscriber, { data, loading, error }] = useMutation(UPDATE_SUBSCRIBER);


  return (
    <Card className="w-full max-w-md h-max mx-auto m-4 p-2">
      <CardHeader>
        <CardTitle className="w-full text-center">
          <div className="border-2 text-center text-lg font-extralight p-2 bg-[#863a4d]/30 rounded-xl">
            Oops! Looks like you're not subscribed yet.
          </div>
          <div className="text-[#772639] mt-6">Sign up now!</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <div className="space-y-4">
            <div className=" text-red-400 -mt-4"></div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Full Name Here..."
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="name"
                required
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-red-500">{formik.errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email Address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="email"
                required
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-sm text-red-500">{formik.errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                placeholder="Your Address Here..."
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="address"
                required
              />
              {formik.touched.address && formik.errors.address && (
                <p className="text-sm text-red-500">{formik.errors.address}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Emirates ID</Label>
              <Input
                id="emiratesId"
                type="text"
                placeholder="Your Emirates ID Here..."
                value={formik.values.emiratesId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="emiratesId"
                required
              />
              {formik.touched.emiratesId && formik.errors.emiratesId && (
                <p className="text-sm text-red-500">
                  {formik.errors.emiratesId}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading
                ? 'Checking...'
                  : 'Scratch Coupon'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
