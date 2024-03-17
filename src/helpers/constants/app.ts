

type CORSOptionObject = Record<string, string | boolean | number | Array<string>>
export const CORSOption: CORSOptionObject = {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};