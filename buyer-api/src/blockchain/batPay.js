export const packPayData = payData => `0xff04${payData
  .sort((a, b) => a - b)
  .map((id, i, l) => id - (l[i - 1] || 0))
  .map(d => d % (256 ** 4))
  .map(d => d.toString(16).padStart(8, '0'))
  .join('')
}`;

export const unpackPayData = pack => pack
  .toString('hex')
  .slice(4)
  .match(/.{8}/img)
  .map(hex => parseInt(hex, 16))
  .reduce((arr, d) => [...arr, d + Number(arr.slice(-1))], []);
