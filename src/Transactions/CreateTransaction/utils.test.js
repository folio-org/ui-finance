import { filterGroupedFundOptions } from './utils';

const groupedOptions = [
  {
    label: 'Ledger A (LGRA)',
    options: [
      { label: 'Fund A (FNDA)', value: 'fund-a' },
      { label: 'Fund B (FNDB)', value: 'fund-b' },
    ],
  },
  {
    label: 'Ledger B (LGRB)',
    options: [
      { label: 'Fund C (FNDC)', value: 'fund-c' },
    ],
  },
];

describe('filterGroupedFundOptions', () => {
  it('should return all options unfiltered when no value is provided', () => {
    expect(filterGroupedFundOptions('', groupedOptions)).toEqual(groupedOptions);
  });

  it('should filter funds within a group by a case-insensitive substring match against the fund label, not the ledger label', () => {
    expect(filterGroupedFundOptions('fund b', groupedOptions)).toEqual([
      {
        label: 'Ledger A (LGRA)',
        options: [{ label: 'Fund B (FNDB)', value: 'fund-b' }],
      },
    ]);
  });

  it('should drop a group entirely when none of its funds match', () => {
    expect(filterGroupedFundOptions('FNDC', groupedOptions)).toEqual([
      {
        label: 'Ledger B (LGRB)',
        options: [{ label: 'Fund C (FNDC)', value: 'fund-c' }],
      },
    ]);
  });

  it('should return an empty array when nothing matches', () => {
    expect(filterGroupedFundOptions('nonexistent', groupedOptions)).toEqual([]);
  });

  it('should match ungrouped options by their own label', () => {
    const ungroupedOptions = [
      { label: 'Fund A (FNDA)', value: 'fund-a' },
      { label: 'Fund B (FNDB)', value: 'fund-b' },
    ];

    expect(filterGroupedFundOptions('FNDA', ungroupedOptions)).toEqual([
      { label: 'Fund A (FNDA)', value: 'fund-a' },
    ]);
  });
});
