async function getTokenBalance() {
  // TODO: call ABI
  const balance = await dataTokenContractInstance.balanceOf.call(
    currentAccount
  );

  return balance.toNumber();
}

export { getTokenBalance };
