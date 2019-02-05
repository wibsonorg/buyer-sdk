import { create } from 'axios';

export const api = create({
  baseURL: 'http://localhost:9100/',
  transformResponse: (data = 'null') => JSON.parse(data),
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});
api.interceptors.response.use(res => res.data);
api.setToken = (token) => { api.defaults.headers.common.Authorization = `Bearer ${token}`; };

export const wibsonBuyer = {
  id: 'wibson-buyer',
  label: 'Wibson Buyer',
  description: 'Wibson is excited to collaborate with Professor [Esteban Moro Egido](http://estebanmoro.org), an associate professor at Universidad Carlos III de Madrid and a visiting professor at the MIT Media Lab, for an academic research project to study how temperature change impacts human social behavior and community interaction./n/n/nMore about the project here: https://medium.com/p/70429fee77ae',
  terms: '# WIBSON ALPHA TERMS OF USE\n\nTHESE TERMS OF USE (THE “TERMS”) ARE A LEGAL CONTRACT BETWEEN YOU AND WIBSON LTD. (THE “COMPANY”, “WE” OR “US”). THE TERMS EXPLAIN HOW YOU ARE PERMITTED TO USE THE WIBSON ALPHA MOBILE APPLICATION (THE “MOBILE APPLICATION”). UNLESS OTHERWISE SPECIFIED, ALL REFERENCES TO “MOBILE APPLICATION” INCLUDE THE CONTENT, SERVICES AVAILABLE THROUGH THIS MOBILE APPLICATION (THE “SERVICES”). BY USING THIS MOBILE APPLICATION, YOU ARE AGREEING TO ALL THE TERMS; IF YOU DO NOT AGREE WITH ANY OF THESE TERMS, DO NOT ACCESS OR OTHERWISE USE THIS MOBILE APPLICATION OR ANY INFORMATION CONTAINED ON THIS MOBILE APPLICATION.\n\n## Changes\n\nCompany may make changes to the content and Services offered on the Mobile Application at any time. Company can change, update, or add or remove provisions of these Terms, at any time by posting the updated Terms on this Mobile Application. By using this Mobile Application after Company has updated the Terms, you are agreeing to all the updated Terms; if you do not agree with any of the updated Terms, you must stop using the Mobile Application.\n\n## Contact Us\n\nIf you have any questions about these Terms or otherwise need to contact Company for any reason, you can reach us at info@wibson.org.\n',
  category: {
    id: 'research-social-good',
    label: 'Social Good & Research',
    description: 'The data shared within this contract will be used by Wibson and/or Professor Moro with Carlos III University to conduct the research explained in brief in the project description and in detail [here](https://medium.com/p/70429fee77ae).',
  },
};

export const dataOrder = {
  audience: { age: 20 },
  price: 42,
  requestedData: ['some-data-type'],
  notariesAddresses: ['0xcccf90140fcc2d260186637d59f541e94ff9288f'],
  buyerInfoId: 'wibson-buyer',
  buyerUrl: 'https://api.buyer.com',
};
