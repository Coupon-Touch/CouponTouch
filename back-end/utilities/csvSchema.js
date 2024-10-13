export const csvUserSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    emirateID: { type: 'string', pattern: '^[0-9]{15}$' },
    mobile: { type: 'string', pattern: '^[0-9]{1,15}$' },
    countryCode: {
      type: 'string',
      minLength: 2,
      maxLength: 5,
    },
    comment: { type: 'string' },
    isContacted: { type: 'boolean' },
    isPaid: { type: 'boolean' },
  },
  required: ['mobile', 'countryCode'],
  additionalProperties: false,
};
