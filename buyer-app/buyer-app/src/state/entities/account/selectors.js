const getAccount = state => state.account;
const getTokensBalance = state => state.account && state.account.balance;
const getTokensEther = state => state.account && state.account.ether;

export { getAccount, getTokensBalance, getTokensEther };
