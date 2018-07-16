const getNotariesFromContract = async () => {
  return [];
  // return dataExchangeContractInstance
  //   .getAllowedNotaries()
  //   .then(allowedNotaries => {
  //     const notariesP = allowedNotaries.map((notaryAddress, idx) => {
  //       return dataExchangeContractInstance
  //         .getNotaryInfo(notaryAddress)
  //         .then(notaryInfo => ({
  //           value: notaryInfo[0],
  //           label: notaryInfo[1],
  //           publicKey: notaryInfo[2]
  //         }));
  //     });
  //
  //     return Promise.all(notariesP);
  //   });
};

export { getNotariesFromContract };
