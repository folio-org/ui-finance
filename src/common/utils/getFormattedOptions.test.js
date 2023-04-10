import { getFormattedOptions } from './getFormattedOptions';

const intlMock = {
  formatMessage: jest.fn(({ id }) => id),
};

const optionsMock = [
  { labelId: 'ui-finance.test.foo', value: 'foo' },
  { labelId: 'ui-finance.test.bar', value: 'bar' },
];

describe('getFormattedOptions', () => {
  it('should return options with formatted labels', () => {
    const options = getFormattedOptions(intlMock, optionsMock);

    expect(options).toEqual(optionsMock.map(({ labelId, value }) => ({
      label: labelId,
      value,
    })));
    optionsMock.forEach(({ labelId }) => {
      expect(intlMock.formatMessage).toHaveBeenCalledWith({ id: labelId });
    });
  });
});
