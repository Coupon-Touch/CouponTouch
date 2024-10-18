import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@apollo/client';
import { ADMIN_LOGIN } from '@/graphQL/apiRequests';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [login, { data, loading, error }] = useMutation(ADMIN_LOGIN);

  useEffect(() => {}, []);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

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
          navigate('../bulkupload');
          localStorage.setItem('token', adminLogin.jwtToken);
          console.log(adminLogin.message);
        } else {
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
    <div className="bg-cover">
      <div className="container mx-auto mt-20 max-w-md">
        <div className="bg-white/80 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, validateForm }) => (
              <Form className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Field
                    id="username"
                    name="username"
                    type="text"
                    className="w-full"
                    as={Input}
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-600 text-sm mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    className="w-full"
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
                  className="w-full bg-[#772639] hover:bg-[#772639]/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
