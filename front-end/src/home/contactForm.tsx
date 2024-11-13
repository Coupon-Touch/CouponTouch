import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import emailjs from '@emailjs/browser';
import React from 'react';

const EmailJs = {
  SERVICE_ID: 'service_m4qup47',
  YOUR_TEMPLATE_ID: 'template_contact_us',
  PUBLIC_KEY: '0ziY7CTyu91KA82BP',
};

export default function ContactForm() {
  const contactForm = React.useRef<HTMLFormElement>(null);
  const [emailError, setEmailError] = React.useState(false);
  // Form validation schema
  const validationSchema = Yup.object({
    customer_name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    company: Yup.string().nullable(),
    website: Yup.string().url('Invalid URL').nullable(),
    message: Yup.string().nullable(),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      customer_name: '',
      email: '',
      company: '',
      website: '',
      message: '',
    },
    validationSchema,
    onSubmit: () => {
      if (!contactForm.current) return;
      emailjs
        .sendForm(
          EmailJs.SERVICE_ID,
          EmailJs.YOUR_TEMPLATE_ID,
          contactForm.current,
          EmailJs.PUBLIC_KEY
        )
        .then(
          () => {
            alert('Thanks For Contacting Us. We will get back to you soon.');
            formik.resetForm();
            setEmailError(false);
          },
          () => {
            setEmailError(true);
          }
        );
    },
  });

  return (
    <Card
      id="contactUs"
      className="mt-12 w-full md:w-auto bg-gray-900/70 backdrop-blur-lg border-gray-800 text-white"
    >
      <CardContent className="p-6">
        <h4 className="text-2xl font-semibold text-center mb-6">Contact Us</h4>
        {emailError && (
          <h4 className="text-red-500 text-wrap max-w-96">
            <span className="pr-1">
              Something went wrong please contact us by sending a mail to
            </span>
            <a
              className="text-blue-500 underline"
              href="mailto:hello@coupontools.net"
            >
              hello@coupontools.net
            </a>
          </h4>
        )}
        <form
          onSubmit={formik.handleSubmit}
          className="space-y-4 text-black"
          ref={contactForm}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="customer_name"
                className="text-sm font-medium text-gray-300"
              >
                Name
              </label>
              <Input
                id="customer_name"
                name="customer_name"
                placeholder="Your name"
                value={formik.values.customer_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.customer_name && formik.errors.customer_name && (
                <p className="text-red-500 text-sm">
                  {formik.errors.customer_name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="company"
                className="text-sm font-medium text-gray-300"
              >
                Company Name
              </label>
              <Input
                id="company"
                name="company"
                placeholder="Your company"
                value={formik.values.company}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="website"
                className="text-sm font-medium text-gray-300"
              >
                Company Website
              </label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://yourcompany.com"
                value={formik.values.website}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.website && formik.errors.website && (
                <p className="text-red-500 text-sm">{formik.errors.website}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="message"
              className="text-sm font-medium text-gray-300"
            >
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder="Your message here"
              rows={4}
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
