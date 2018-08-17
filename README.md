# buyer-sdk
Wibson Buyer Official SDK

This repository contains three applications

* Buyer APP: Frontend App for the Buyer
* Buyer API: Service consumed by the Buyer APP
* Buyer Signing Service: Service used to sign the transactions sent to the Ethereum Network, consumed by Buyer API

## Getting Started
TODO

## Secrets Management

### Encrypting .env file
```
gpg -e -a .env
```

### Editing .env file securely
```
mv .vimrc.example ~/.vimrc
vi .env.asc
```

### Exporting GnuPG private key
```
gpg --export-secret-keys -a -o private-key.asc <key-id>
```

### Running app with encrypted .env
```
GPG_KEY_PATH="private-key.asc" ENV_PATH=".env.asc" npm run start
```