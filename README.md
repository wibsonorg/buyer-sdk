# <img src="logo.png" alt="Wibson" width="400px">

[Wibson](https://wibson.org/) is a blockchain-based, decentralized data marketplace that provides individuals a way to securely and anonymously sell validated private information in a trusted environment.

**buyer-sdk** is the implementation of the official SDK to play as a Buyer in Wibson Protocol.

This repository contains three applications:

* Buyer APP: Front-end App for the Buyer.
* Buyer API: Service consumed by the Buyer APP.
* Buyer Signing Service: Service used to sign the transactions sent to the Ethereum Network, consumed by Buyer API.

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

## Reporting Security Vulnerabilities
If you think that you have found a security issue in Wibson, please **DO NOT** post it as a Github issue and don't publish it publicly. Instead, all security issues must be sent to developers@wibson.org.
Although we are working on setting up a bug bounty program to improve this, we appreciate your discretion and will give the corresponding credit to the reporter(s).

## Contribute
Thank you for thinking about contributing to Wibson Buyer SDK. There are many ways you can participate and help build high quality software. Check out the [contribution guide]!

## License
Wibson Buyer SDK is released under the [LGPL-3.0](LICENSE).

[contribution guide]: CONTRIBUTING.md
