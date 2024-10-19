import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { useFormik } from 'formik';
import { Formik, Field, Form, ErrorMessage } from 'formik';

import { FormEvent, useState } from 'react';
import * as Yup from 'yup';

const countryCodes = [
  1, 7, 20, 21, 27, 27, 29, 30, 31, 32, 33, 34, 36, 39, 40, 41, 43, 44, 45, 46,
  47, 48, 49, 51, 52, 53, 54, 55, 56, 57, 58, 60, 61, 62, 63, 64, 65, 66, 81,
  86, 90, 91, 92, 93, 95, 98, 212, 213, 216, 218, 220, 221, 222, 223, 224, 225,
  226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 240, 241,
  242, 243, 244, 245, 246, 249, 250, 251, 252, 254, 255, 256, 257, 258, 260,
  261, 263, 264, 265, 267, 268, 297, 299, 350, 351, 352, 353, 354, 355, 356,
  357, 358, 359, 370, 371, 372, 373, 374, 375, 376, 377, 378, 380, 381, 382,
  385, 386, 387, 389, 420, 421, 423, 500, 501, 502, 503, 504, 505, 506, 507,
  508, 509, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 673, 687, 689,
  852, 870, 886, 961, 962, 963, 964, 965, 966, 967, 968, 971, 972, 973, 974,
  975, 976, 977, 992, 993, 994, 995, 996, 998, 1758, 1868,
];
countryCodes.sort((a, b) => a - b);
const validationSchema = Yup.object({
  countryCode: Yup.string().required('Please select a country code.'),
  phoneNumber: Yup.string()
    .matches(/^[1-9]\d*$/, "Phone number must not start with '0'.") // Custom regex
    .min(7, 'Phone number must be at least 7 characters long.')
    .max(12, 'Phone number must be at most 12 characters long.')
    .required('Phone number is required.'),

  name: Yup.string()
    .min(3, 'Name cannot be less than 3 character')
    .required('Name is required'),

  emiratesId: Yup.string()
    .matches(/^\d{15}$/, 'Emirates ID must be exactly 15 digits long')
    .required('Emirates ID is required'),

  address: Yup.string().required('Address is required'),

  pincode: Yup.string()
    .matches(/^\d{5,6}$/, 'Pincode must be 5 or 6 digits long')
    .required('Pincode is required'),
});

export default function SubscriberInfo({
  successCallback,
}: {
  successCallback: () => void;
}) {
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      countryCode: countryCodes.indexOf(971).toString(),
      phoneNumber: '',
      emiratesId: '',
      name: '',
      address: '',
      pincode: '',
    },
    validationSchema: validationSchema,
    onSubmit: values => {},
  });

  const handleSubmit = values => {
    console.log(values);
    // TODO: Make API call to save the subscriber info

    successCallback(); // call this if the API call is successful
    setIsLoading(false);
  };

  const checkPhoneNumber = (event: FormEvent) => {
    event.preventDefault();
    if (formik.errors.phoneNumber || formik.errors.countryCode) return;
    setIsLoading(true);
    const phone = formik.values.phoneNumber;
    const countryCode = formik.values.countryCode;

    // TODO: check phone number for existing subscriber, make API call here

    const exists = phone.toString().startsWith('1'); // just for testing replace it with API response
    if (exists) {
      successCallback();
    } else {
      setShowAdditionalFields(true);
    }
    setIsLoading(false);
  };

  return (
    <Card className="w-full max-w-md h-max mx-auto m-4 p-2">
      <CardHeader>
        <CardTitle className="w-full text-center">
          {!showAdditionalFields ? (
            'Verify your phone number'
          ) : (
            <>
              <div className="border-2 text-center text-lg font-extralight p-2 bg-[#863a4d]/30 rounded-xl">
                Oops! Looks like you're not subscribed yet.
              </div>
              <div className="text-[#772639] mt-6">Sign up now!</div>
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        ></Formik>
        <form
          onSubmit={
            showAdditionalFields ? formik.handleSubmit : checkPhoneNumber
          }
        >
          <div className="space-y-4">
            {!showAdditionalFields && (
              <div className="space-y-2">
                <Label htmlFor="phone-number">
                  Enter a valid phone number to get started
                </Label>
                <div className="flex">
                  <Select
                    onValueChange={value =>
                      formik.setFieldValue('countryCode', value)
                    }
                    value={formik.values.countryCode}
                  >
                    <SelectTrigger
                      className={cn(
                        'w-[130px] rounded-r-none',
                        !formik.values.countryCode && 'text-muted-foreground'
                      )}
                    >
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent>
                      {countryCodes.map((code, idx) => (
                        <SelectItem key={`${idx}`} value={`${idx}`}>
                          {`+${code}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="phone-number"
                    type="number"
                    className="rounded-l-none"
                    placeholder="Phone Number Here..."
                    value={formik.values.phoneNumber}
                    onChange={e => {
                      setShowAdditionalFields(false);
                      return formik.handleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                    name="phoneNumber"
                  />
                </div>
                {formik.touched.countryCode && formik.errors.countryCode && (
                  <p className="text-sm text-red-500">
                    {formik.errors.countryCode}
                  </p>
                )}
                {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                  <p className="text-sm text-red-500">
                    {formik.errors.phoneNumber}
                  </p>
                )}
              </div>
            )}

            {showAdditionalFields && (
              <>
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
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Your Address Here..."
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="address"
                    required
                  />
                  {formik.touched.address && formik.errors.address && (
                    <p className="text-sm text-red-500">
                      {formik.errors.address}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pin Code</Label>
                  <Input
                    id="pincode"
                    type="text"
                    placeholder="Your Pin Code Here..."
                    value={formik.values.pincode}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="pincode"
                    required
                  />
                  {formik.touched.pincode && formik.errors.pincode && (
                    <p className="text-sm text-red-500">
                      {formik.errors.pincode}
                    </p>
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
              </>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading
                ? 'Checking...'
                : showAdditionalFields
                  ? 'Submit'
                  : 'Scratch Coupon'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
