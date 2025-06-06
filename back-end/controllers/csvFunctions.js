import { parse } from 'fast-csv';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { csvUserSchema } from '../utilities/csvSchema.js';
import { Subscriber } from '../models/subscriber.js';

const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(csvUserSchema);

export async function csvUploadController(file) {
  console.log(file);
  const { createReadStream, mimetype } = await file;

  if (mimetype !== 'text/csv') {
    return {
      isSuccessful: false,
      message: 'File must be a CSV',
    };
  }

  const stream = createReadStream();
  const subscribers = [];
  const validationErrors = [];

  return new Promise(resolve => {
    parse({ headers: false })
      .on('error', error => {
        resolve({
          isSuccessful: false,
          message: 'Error reading CSV file: ' + error.message,
        });
      })
      .on('data', row => {
        const isValid = validate(row);
        if (isValid) {
          subscribers.push(row);
        } else {
          validationErrors.push({ row, errors: validate.errors });
        }
      })
      .on('end', async () => {
        if (validationErrors.length > 0) {
          return resolve({
            isSuccessful: false,
            message:
              'CSV contains invalid data: ' + JSON.stringify(validationErrors),
          });
        }

        try {
          await Subscriber.insertMany(subscribers);
          resolve({
            isSuccessful: true,
            message: 'CSV uploaded and data stored successfully',
          });
        } catch (dbError) {
          resolve({
            isSuccessful: false,
            message: 'Failed to store data. Please retry after sometime!',
          });
        }
      })
      .pipe(stream);
  });
}

export const addSubscriberController = async (
  subscriberInput,
  fromEntryPoint = false
) => {
  try {
    const existingSubscriber = await Subscriber.findOne({
      mobile: subscriberInput.mobile,
      countryCode: subscriberInput.countryCode,
    });

    if (existingSubscriber) {
      return {
        isSuccessful: false,
        message: 'Subscriber with this phone number already exists',
      };
    }

    let newSubscriber;
    if (fromEntryPoint) {
      newSubscriber = new Subscriber({
        mobile: subscriberInput.mobile,
        countryCode: subscriberInput.countryCode,
        countryCodeMobileNumber:
          subscriberInput.countryCode + subscriberInput.mobile,
      });
    } else {
      newSubscriber = new Subscriber({
        name: subscriberInput.name,
        email: subscriberInput.email,
        emirateID: subscriberInput.emirateID,
        mobile: subscriberInput.mobile,
        countryCode: subscriberInput.countryCode,
        countryCodeMobileNumber:
          subscriberInput.countryCode + subscriberInput.mobile,
        address: subscriberInput.address,
      });
    }

    await newSubscriber.save();

    return {
      isSuccessful: true,
      message: 'Subscriber successfully added',
    };
  } catch (error) {
    console.log('Error in addSubscriberController:', error);

    return {
      isSuccessful: false,
      message: 'Failed to add subscriber',
    };
  }
};
