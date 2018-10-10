const getAccount = state => state.account;
const getTokensBalance = state => state.account && state.account.balance;
const getTokensWib = state => state.account && state.account.wib;
const getTokensEther = state => state.account && state.account.ether;

export { getAccount, getTokensBalance, getTokensEther, getTokensWib };
