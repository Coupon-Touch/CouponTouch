import { useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import background from "@/assets/albanian/bg.png"
import NavBar from './navbar'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

export default function Login() {
  useEffect(() => {
    const body = document.body;

    const computedStyle = window.getComputedStyle(body);

    const oldBackgroundImage = computedStyle.backgroundImage;
    const oldBackgroundRepeat = computedStyle.backgroundRepeat;

    body.style.backgroundImage = `url('${background}')`;
    body.style.backgroundRepeat = "repeat";

    return () => {
      body.style.backgroundImage = oldBackgroundImage
      body.style.backgroundRepeat = oldBackgroundRepeat
    }
  }, [])

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters')
      .required('Username is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  })

  const handleSubmit = (values: { username: string, password: string }) => {
    console.log('Login attempted with:', values)
  }

  return (
    <div className="min-h-screen bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover">
      <NavBar />
      <div className="container mx-auto mt-20 max-w-md">
        <div className="bg-white/80 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
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
                  <ErrorMessage name="username" component="div" className="text-red-600 text-sm mt-1" />
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
                  <ErrorMessage name="password" component="div" className="text-red-600 text-sm mt-1" />
                </div>
                <Button type="submit" className="w-full bg-[#772639]" disabled={isSubmitting}>
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
