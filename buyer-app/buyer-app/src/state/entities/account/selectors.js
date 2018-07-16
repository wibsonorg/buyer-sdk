const getAccount = state => state.account;
const getTokensBalance = state => state.account && state.account.balance;

export { getAccount, getTokensBalance };
