import { handleRemoveErrorResponse } from './utils';

const showCallout = jest.fn();

test('handleRemoveErrorResponse', () => {
  handleRemoveErrorResponse({ formatMessage: jest.fn() }, showCallout, { errors: [{ code: 'code' }] });

  expect(showCallout).toHaveBeenCalled();
});
