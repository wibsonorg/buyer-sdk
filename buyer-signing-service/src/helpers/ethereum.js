import EthUtil from 'ethereumjs-util';
import EthCrypto from 'eth-crypto';

// TODO Remove this
// export const wibsonMobileGenData = (fSign, fArgs) => {
//   const func = EthUtil.keccak256(fSign).slice(0, 4).toString('hex');
//   const args = fArgs.map(arg => EthUtil.setLengthLeft(arg, 32).toString('hex'));
//   const argsStr = args.reduce((x, y) => `${x}${y}`, '');
//   return `0x${func}${argsStr}`;
// };

export const generateData = (
  functionSignature,
  parameterNames,
  transactionParameters,
) => {
  const func = EthUtil.keccak256(functionSignature).slice(0, 4).toString('hex');
  const args = parameterNames.map((parameterName) => {
    const value = transactionParameters[parameterName];

    return EthUtil.setLengthLeft(value, 32).toString('hex');
  });
  const argsStr = args.join('');

  // TODO Remove this
  // const d = wibsonMobileGenData(
  //   functionSignature,
  //   parameterNames.map(parameterName => transactionParameters[parameterName]),
  // );
  // console.log(d);
  // console.log(d === `0x${func}${argsStr}`);

  return `0x${func}${argsStr}`;
};

export const signTransaction = (rawTransaction, privateKey) =>
  EthCrypto.signTransaction(rawTransaction, privateKey);
