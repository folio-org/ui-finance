import { getInitialRoute } from './utils';

const stripesMock = { hasPerm: jest.fn().mockReturnValue(true) };

test('getInitialRoute', () => {
  getInitialRoute(stripesMock);

  expect(stripesMock.hasPerm).toHaveBeenCalled();
});