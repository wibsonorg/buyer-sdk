import { expect } from 'chai';
import { coin } from '../../../src/utils/wibson-lib';

const { toWib, fromWib } = coin;

describe.only('Coin helper', () => {
  describe('toWib', () => {
    it('returns the correct amount of wibcoins', () => {
      expect(toWib('0')).to.equal('0');
      expect(toWib('1')).to.equal('0.000000001');
      expect(toWib('1000000000')).to.equal('1');
      expect(toWib('9000000000000000000')).to.equal('9000000000');
    });

    it('returns the correct amount of wibcoins when exponential notation is used', () => {
      expect(toWib('1e+9')).to.equal('1');
      expect(toWib('9e+18')).to.equal('9000000000');
    });

    it('returns NaN when an invalid number is specified', () => {
      expect(toWib('10WIB')).to.be.NaN;
      expect(toWib('10 WIB')).to.be.NaN;
      expect(toWib('')).to.be.NaN;
      expect(toWib(NaN)).to.be.NaN;
      expect(toWib(undefined)).to.be.NaN;
      expect(toWib(null)).to.be.NaN;
    });

    it('returns Infinity when number is out of range', () => {
      expect(toWib('1e+19')).to.equal(Infinity);
    });
  });

  describe('fromWib', () => {
    it('returns the correct big number representation', () => {
      expect(fromWib('0')).to.equal('0');
      expect(fromWib('0.000000001')).to.equal('1');
      expect(fromWib('1')).to.equal('1000000000');
      expect(fromWib('9000000000')).to.equal('9000000000000000000');
    });

    it('returns the correct big number representation amount of wibcoins when exponential notation is used', () => {
      expect(fromWib('1e+1')).to.equal('10000000000');
      expect(fromWib('9e+9')).to.equal('9000000000000000000');
    });

    it('returns NaN when an invalid number is specified', () => {
      expect(fromWib('10WIB')).to.be.NaN;
      expect(fromWib('10 WIB')).to.be.NaN;
      expect(fromWib('')).to.be.NaN;
      expect(fromWib(NaN)).to.be.NaN;
      expect(fromWib(undefined)).to.be.NaN;
      expect(fromWib(null)).to.be.NaN;
    });

    it('returns Infinity when number is out of range', () => {
      expect(fromWib('1e+10')).to.equal(Infinity);
    });
  });
});

