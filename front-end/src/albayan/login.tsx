import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { ADMIN_LOGIN } from '@/graphQL/apiRequests';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Loader from './loader';

export default function Login() {
  const navigate = useNavigate();
  const [login,
    { loading }
  ] = useMutation(ADMIN_LOGIN);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('../couponSettings');
    }
  }, []);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required.'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required.'),
  });
  const { toast } = useToast();
  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const { username, password } = values;
      const response = await login({ variables: { username, password } });

      if (response && response.data) {
        const { adminLogin } = response.data;

        if (adminLogin && adminLogin.isSuccessful) {
          navigate('../couponSettings');
          localStorage.setItem('token', adminLogin.jwtToken);
          console.log(adminLogin.message);
        } else {

          toast({
            title: 'Invalid Credentials',
            description: adminLogin?.message || 'Unknown error',
            variant: "destructive",
            duration: 5000,
          })
          console.error(
            'Login failed:',
            adminLogin?.message || 'Unknown error'
          );
        }
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };

  return (
    <div className="flex flex-col w-full h-full items-center justify-center bg-cover">
      {loading && <Loader />}
      <div className="container mx-auto max-w-sm lg:max-w-md">
        <div className="bg-white/80 p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-start">Sign-in</h1>
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div>
                  <Label htmlFor="username" className="text-lg">
                    Username
                  </Label>
                  <Field
                    id="username"
                    name="username"
                    type="text"
                    className="w-full mt-2"
                    as={Input}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-lg">
                    Password
                  </Label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="w-full mt-2"
                    autoComplete="off"
                    as={Input}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#772639] hover:bg-[#772639]/80 text-lg h-12 mt-2 hover:scale-105 transition-all"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1.5em"
                    height="1.5em"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M11.98 20v-1h6.405q.23 0 .423-.192t.192-.424V5.616q0-.231-.192-.424T18.384 5h-6.403V4h6.404q.69 0 1.152.463T20 5.616v12.769q0 .69-.463 1.153T18.385 20zm-.71-4.461l-.703-.72l2.32-2.319H4v-1h8.887l-2.32-2.32l.702-.718L14.808 12z"
                    />
                  </svg>
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
