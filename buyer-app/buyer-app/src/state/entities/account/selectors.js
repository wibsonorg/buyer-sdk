const getAccount = state => state.account;
const getTokensBalance = state => state.account && state.account.balance;
const getTokensWib = state => state.account && state.account.wib;
const getTokensEther = state => state.account ? Number(state.account.ether) : undefined;

export { getAccount, getTokensBalance, getTokensEther, getTokensWib };
