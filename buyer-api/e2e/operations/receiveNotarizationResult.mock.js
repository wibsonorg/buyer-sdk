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

export const someNotarizationRequest = {
  orderId: 114,
  callbackUrl: 'http://api.wibson.org/notarization-result/0x87c2d362de99f75a4f2755cdaaad2d11bf6cc65dc71356593c445535ff28f43d',
  sellers: [
    {
      id: 78,
      address: '0x338fff484061da07323e994990c901d322b6927a',
      decryptionKeyHash: '0x32f2ab2ab2157408e0d8e8af2677f628ec82b5fc9329facb8fcc71cfb8f0b92e',
    },
    {
      id: 84,
      address: '0x2d419c641352e0baa7f54328ecabf58c5e4a56f1',
      decryptionKeyHash: '0x15e4d58cc37f15f2de3e688b4a21e5b5caa5263f9dd47db2011d8643cc59779f',
    },
  ],
};

export const someNotarizationResult = {
  sellers: [
    {
      id: 78,
      address: '0x338fff484061da07323e994990c901d322b6927a',
      result: 'ok',
      decryptionKeyEncryptedWithMasterKey: '0x912f8f484454e3a38f7535fbf6b7f0035a0fe27c028163348965eb9369fcca8c',
    },
    {
      id: 84,
      address: '0x2d419c641352e0baa7f54328ecabf58c5e4a56f1',
      result: 'not_audited',
      decryptionKeyEncryptedWithMasterKey: '0x912f8f484454e3a38f7535fbf6b7f0035a0fe27c028163348965eb9369fcca8c',
    },
  ],
  orderId: 114,
  notaryAddress: '0xfe174860ad53e45047BABbcf4aff735d650D9284',
  notarizationPercentage: 30,
  notarizationFee: 10000000000,
  payDataHash: '0x0bb68ec2b34b7b611727f7340d7c6e0ee5a580090583d92b7639861802b9e116',
  lock: '0xde916ce0390bd5408b7a0a52aae818fd973858c7e9b5d368ec1e6a9b0db44cf9',
};
