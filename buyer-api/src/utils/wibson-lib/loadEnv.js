import fs from 'fs';
import dotenv from 'dotenv';
import read from 'read';

const openpgp = require('openpgp');

const getPassphrase = () =>
  new Promise((resolve, reject) => {
    read({ prompt: 'Passphrase: ', silent: true }, (err, passphrase) => {
      if (err) {
        reject(err);
      } else {
        resolve(passphrase);
      }
    });
  });

const decryptFile = async (gpgKeyPath, envFile) => {
  const privkey = fs.readFileSync(gpgKeyPath, 'utf8');
  const privKeyObj = openpgp.key.readArmored(privkey).keys[0];

  const passphrase = await getPassphrase();
  await privKeyObj.decrypt(passphrase);

  const decrypted = await openpgp.decrypt({
    message: openpgp.message.readArmored(envFile),
    privateKeys: [privKeyObj],
  });
  return decrypted.data;
};

const loadEnv = async () => {
  // Defined by command line, not .env file
  const gpgKeyPath = process.env.GPG_KEY_PATH;
  const envPath = process.env.ENV_PATH || '.env';

  const envFile = fs.readFileSync(envPath, 'utf8');
  const configuration = gpgKeyPath ? await decryptFile(gpgKeyPath, envFile) : envFile;

  const buf = Buffer.from(configuration);
  const env = dotenv.parse(buf);

  process.env = {
    ...env,
    ...process.env,
  };
};

export default loadEnv;
