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
import { LOGIN } from '@/graphQL/apiRequests';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useLazyQuery } from '@apollo/client';
import { useFormik } from 'formik';

import * as Yup from 'yup';

const countryCodes = [
  1, 7, 20, 21, 27, 29, 30, 31, 32, 33, 34, 36, 39, 40, 41, 43, 44, 45, 46, 47,
  48, 49, 51, 52, 53, 54, 55, 56, 57, 58, 60, 61, 62, 63, 64, 65, 66, 81, 86,
  90, 91, 92, 93, 95, 98, 212, 213, 216, 218, 220, 221, 222, 223, 224, 225, 226,
  227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 240, 241, 242,
  243, 244, 245, 246, 249, 250, 251, 252, 254, 255, 256, 257, 258, 260, 261,
  263, 264, 265, 267, 268, 297, 299, 350, 351, 352, 353, 354, 355, 356, 357,
  358, 359, 370, 371, 372, 373, 374, 375, 376, 377, 378, 380, 381, 382, 385,
  386, 387, 389, 420, 421, 423, 500, 501, 502, 503, 504, 505, 506, 507, 508,
  509, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 673, 687, 689, 852,
  870, 886, 961, 962, 963, 964, 965, 966, 967, 968, 971, 972, 973, 974, 975,
  976, 977, 992, 993, 994, 995, 996, 998, 1758, 1868,
];
export type SubscriberDetails = {
  jwtToken: string
  mobile: string
  countryCode: string
  isPaid: boolean
  lastScratchTime: number
  address: string
  email: string
  emirateID: string
  name: string

};
countryCodes.sort((a, b) => a - b);
const validationSchema = Yup.object({
  countryCode: Yup.string().required('Please select a country code.'),
  phoneNumber: Yup.string()
    .matches(/^[1-9]\d*$/, "Phone number must not start with '0'.")
    .length(9, 'Phone number must be exactly 9 digits.')
    .required('Phone number is required.'),
});
export default function PhoneForm({ successCallback }: {
  successCallback: (timeTillNextScratch: SubscriberDetails) => void;
}) {
  const { toast } = useToast()
  const formik = useFormik({
    initialValues: {
      countryCode: '971',
      phoneNumber: '',
    },
    validationSchema: validationSchema,
    onSubmit: async () => {
      const phone = formik.values.phoneNumber;
      const countryCode = formik.values.countryCode;
      const data: SubscriberDetails = await new Promise((resolve, reject) => {
        getSubscriber({
          variables: { phoneNumber: `${phone}`, countryCode: `${countryCode}` },
          onCompleted: (data) => {
            resolve(data.login)
          },
          onError: () => {
            toast({
              variant: 'destructive',
              description: 'An error occurred. Please try again later.',
            })
            reject()
          }
        })
      })
      if (data) {
        if (data.jwtToken) {
          window.localStorage.setItem("token", data.jwtToken); // TODO: store in JWT Token
        }
        successCallback(data);
      }
    },
  });
  const [getSubscriber, { loading }] = useLazyQuery(LOGIN)

  return (
    <>
      <Card className="w-full max-w-md h-max mx-auto m-4 p-2">
        <CardHeader>
          <CardTitle className="w-full text-center">
            Verify your phone number
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone-number">
                  Enter your phone number to get started
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
                        <SelectItem key={`${idx}`} value={`${code}`}>
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
                    onChange={formik.handleChange}
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Checking...' : 'Get Coupon'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
