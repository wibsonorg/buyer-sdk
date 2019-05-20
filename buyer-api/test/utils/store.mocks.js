import sinon from 'sinon';

export const mockUpdate = defaultValue => sinon.stub()
  .callsFake(async (key, mutation, d = defaultValue) =>
    (typeof mutation === 'function' ? mutation(d) : mutation));
