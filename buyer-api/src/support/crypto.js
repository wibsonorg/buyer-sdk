import forge from 'node-forge';

const RSA_KEY_SIZE = 4096;

const generateKeyPair = () =>
  new Promise((resolve, reject) => {
    forge.pki.rsa.generateKeyPair({
      bits: RSA_KEY_SIZE,
      workers: -1,
    }, (error, keypair) => {
      if (error) {
        reject(error);
      } else {
        resolve({
          publicKey: forge.pki.publicKeyToPem(keypair.publicKey),
          privateKey: forge.pki.privateKeyToPem(keypair.privateKey),
        });
      }
    });
  });

export default generateKeyPair;
