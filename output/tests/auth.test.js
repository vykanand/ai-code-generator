import { expect } from 'chai';
import auth from '../../../src/services/auth';

describe('Auth Service', () => {
  describe('getToken()', () => {
    it('should return a token', async () => {
      const token = await auth.getToken();
      expect(token).to.be.a('string');
    });
  });

  describe('verifyToken()', () => {
    it('should return true if the token is valid', async () => {
      const token = await auth.getToken();
      const isValid = await auth.verifyToken(token);
      expect(isValid).to.be.true;
    });

    it('should return false if the token is invalid', async () => {
      const invalidToken = 'invalid-token';
      const isValid = await auth.verifyToken(invalidToken);
      expect(isValid).to.be.false;
    });
  });
});