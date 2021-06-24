import { getFiscalYearsForSelect } from './getFiscalYearsForSelect';

const resources = {
  fiscalYears: {
    records: [{ code: 'code', id: 'id' }],
  },
};
const fiscalYearsOptions = [{ label: 'code', value: 'id' }];

test('Fiscal years are not passed', () => {
  const options = getFiscalYearsForSelect();

  expect(options).toStrictEqual([]);
});

test('Fiscal years options', () => {
  const options = getFiscalYearsForSelect(resources);

  expect(options).toStrictEqual(fiscalYearsOptions);
});
