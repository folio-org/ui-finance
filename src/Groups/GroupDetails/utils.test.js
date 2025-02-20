import { LEDGERS_API } from '../../common/const';
import {
  filterPreviousGroupFiscalYears,
  getGroupSummary,
  getGroupLedgers,
  getLedgersCurrentFiscalYears,
  sortGroupFiscalYears,
} from './utils';

const mutator = { GET: jest.fn() };

const getMock = (result = {}) => ({
  get: jest.fn(() => ({
    json: () => Promise.resolve(result),
  })),
});

const GROUP_ID = 'testGroupId';

test('getGroupSummary - should call API', () => {
  mutator.GET.mockClear().mockReturnValue(Promise.resolve([{}]));

  getGroupSummary(mutator, 'groupId', 'fiscalYearId');

  expect(mutator.GET).toHaveBeenCalled();
});

test('getGroupSummary - should not call API', () => {
  mutator.GET.mockClear();

  getGroupSummary(mutator, 'groupId');

  expect(mutator.GET).not.toHaveBeenCalled();
});

test('getGroupLedgers - should fetch group related ledgers ', async () => {
  const ky = getMock({ ledgers: [] });

  await getGroupLedgers(ky)(GROUP_ID);

  expect(ky.get).toHaveBeenCalledWith(
    LEDGERS_API,
    expect.objectContaining({
      searchParams: expect.objectContaining({
        query: `groupFundFY.groupId=="${GROUP_ID}"`,
      }),
    }),
  );
});

test('getLedgersCurrentFiscalYears - should fetch current fiscal year for each ledger in the group', async () => {
  const ledgerIds = new Array(10).fill(null).map((_, i) => `ledger-${i}`);

  const ky = getMock();

  await getLedgersCurrentFiscalYears(ky)(ledgerIds);

  expect(ky.get).toHaveBeenCalledTimes(ledgerIds.length);
  expect(ky.get).toHaveBeenLastCalledWith(`${LEDGERS_API}/${ledgerIds[ledgerIds.length - 1]}/current-fiscal-year`);
});

test('sortGroupFiscalYears - should sort FYs by periodStart and series', () => {
  const fiscalYears = [
    { periodStart: '2023-01-01T00:00:00.000+00:00', series: 'FYA' },
    { periodStart: '2022-01-01T00:00:00.000+00:00', series: 'FYB' },
    { periodStart: '2023-01-01T00:00:00.000+00:00', series: 'FYB' },
    { periodStart: '2023-01-01T00:00:00.000+00:00', series: 'FYC' },
  ];

  const sortedArr = sortGroupFiscalYears(fiscalYears);

  expect(sortedArr.map(({ series }) => series)).toEqual([
    fiscalYears[0].series,
    fiscalYears[2].series,
    fiscalYears[3].series,
    fiscalYears[1].series,
  ]);
});

describe('filterPreviousGroupFiscalYears', () => {
  it('should filter out previous fiscal years', () => {
    expect(
      filterPreviousGroupFiscalYears(
        [
          { id: '1', series: 'FY1', periodEnd: '2022-12-31T00:00:00.000+00:00' },
          { id: '2', series: 'FY2', periodEnd: '2023-12-31T00:00:00.000+00:00' },
          { id: '3', series: 'FY1', periodEnd: '2021-12-31T00:00:00.000+00:00' },
        ],
        [
          { id: '4', series: 'FY1', periodStart: '2022-01-01T00:00:00.000+00:00' },
          { id: '5', series: 'FY2', periodStart: '2024-01-01T00:00:00.000+00:00' },
        ],
      ),
    ).toEqual(
      [
        { id: '2', series: 'FY2', periodEnd: '2023-12-31T00:00:00.000+00:00' },
        { id: '3', series: 'FY1', periodEnd: '2021-12-31T00:00:00.000+00:00' },
      ],
    );

    expect(
      filterPreviousGroupFiscalYears(
        [
          { id: '1', series: 'FY1', periodEnd: '2022-12-31T00:00:00.000+00:00' },
          { id: '2', series: 'FY2', periodEnd: '2023-12-31T00:00:00.000+00:00' },
          { id: '3', series: 'FY1', periodEnd: '2021-12-31T00:00:00.000+00:00' },
        ],
        [
          { id: '4', series: 'FY1', periodStart: '2021-01-01T00:00:00.000+00:00' },
        ],
      ),
    ).toEqual(
      [
        { id: '2', series: 'FY2', periodEnd: '2023-12-31T00:00:00.000+00:00' },
      ],
    );

    expect(
      filterPreviousGroupFiscalYears(
        [
          { id: '1', series: 'FY1', periodEnd: '2022-12-31T00:00:00.000+00:00' },
          { id: '2', series: 'FY2', periodEnd: '2023-12-31T00:00:00.000+00:00' },
          { id: '3', series: 'FY1', periodEnd: '2021-12-31T00:00:00.000+00:00' },
        ],
        [
          { id: '4', series: 'FY3', periodStart: '2022-01-01T00:00:00.000+00:00' },
        ],
      ),
    ).toEqual(
      [
        { id: '1', series: 'FY1', periodEnd: '2022-12-31T00:00:00.000+00:00' },
        { id: '2', series: 'FY2', periodEnd: '2023-12-31T00:00:00.000+00:00' },
        { id: '3', series: 'FY1', periodEnd: '2021-12-31T00:00:00.000+00:00' },
      ],
    );
  });

  it('should return empty array if no previous fiscal years', () => {
    const fiscalYears = [
      { id: '1', series: 'FY1', periodEnd: '2023-12-31T00:00:00.000+00:00' },
    ];

    const currentFiscalYears = [
      { id: '2', series: 'FY1', periodStart: '2023-01-01T00:00:00.000+00:00' },
    ];

    const filteredFiscalYears = filterPreviousGroupFiscalYears(fiscalYears, currentFiscalYears);

    expect(filteredFiscalYears).toEqual([]);
  });

  it('should handle empty fiscal years array', () => {
    const fiscalYears = [];

    const currentFiscalYears = [
      { id: '1', series: 'FY1', periodStart: '2023-01-01T00:00:00.000+00:00' },
    ];

    const filteredFiscalYears = filterPreviousGroupFiscalYears(fiscalYears, currentFiscalYears);

    expect(filteredFiscalYears).toEqual([]);
  });

  it('should handle empty current fiscal years array', () => {
    const fiscalYears = [
      { id: '1', series: 'FY1', periodEnd: '2022-12-31T00:00:00.000+00:00' },
      { id: '2', series: 'FY2', periodEnd: '2023-12-31T00:00:00.000+00:00' },
    ];

    const currentFiscalYears = [];

    const filteredFiscalYears = filterPreviousGroupFiscalYears(fiscalYears, currentFiscalYears);

    expect(filteredFiscalYears).toEqual(fiscalYears);
  });

  it('should handle fiscal years with no matching series in current fiscal years', () => {
    const fiscalYears = [
      { id: '1', series: 'FY1', periodEnd: '2022-12-31T00:00:00.000+00:00' },
      { id: '2', series: 'FY2', periodEnd: '2023-12-31T00:00:00.000+00:00' },
    ];

    const currentFiscalYears = [
      { id: '3', series: 'FY3', periodStart: '2023-01-01T00:00:00.000+00:00' },
    ];

    const filteredFiscalYears = filterPreviousGroupFiscalYears(fiscalYears, currentFiscalYears);

    expect(filteredFiscalYears).toEqual(fiscalYears);
  });
});
