import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';

import {
  useLedgerCurrentFiscalYear,
  useLedgerPreviousFiscalYears,
} from '../../common/hooks';
import LedgerInformation from './LedgerInformation';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ViewMetaData: jest.fn(() => 'ViewMetaData'),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AcqUnitsView: jest.fn(() => 'AcqUnitsView'),
}))

jest.mock('../../common/hooks', () => ({
  useLedgerCurrentFiscalYear: jest.fn(),
  useLedgerPreviousFiscalYears: jest.fn(),
}));

const DEFAULT_FY = {
  id: 'd83adc1c-8e52-4e67-b798-9c16f5908960',
  acqUnitIds: [],
  name: 'Test fiscal year 2019',
  code: 'TY2019',
  currency: 'USD',
  periodStart: '2019-01-02T00:00:00.000+0000',
  periodEnd: '2019-09-18T00:00:00.000+0000',
  series: 'TY',
  metadata: {
    createdDate: '2020-09-10T09:14:23.121+0000',
    createdByUserId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
    updatedDate: '2020-09-10T09:14:23.121+0000',
    updatedByUserId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
  },
};

const DEFAULT_LEDGER = {
  acqUnitIds: [],
  code: 'test',
  fiscalYearOneId: 'd83adc1c-8e52-4e67-b798-9c16f5908960',
  id: 'af6735ef-a4a3-4e9a-a709-b5022d1a750f',
  ledgerStatus: 'Active',
  metadata: {
    createdDate: '2020-09-10T10:16:25.938+0000',
    createdByUserId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
    updatedByUserId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
    updatedDate: '2020-09-10T10:16:25.938+0000',
  },
  createdByUserId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
  createdDate: '2020-09-10T10:16:25.938+0000',
  updatedByUserId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
  updatedDate: '2020-09-10T10:16:25.938+0000',
  name: 'test',
  netTransfers: 0,
  restrictEncumbrance: true,
  restrictExpenditures: true,
};

const defaultProps = {
  ledger: {
    acqUnitIds: DEFAULT_LEDGER.acqUnitIds,
    code: DEFAULT_LEDGER.code,
    description: DEFAULT_LEDGER.description,
    fiscalYearCode: DEFAULT_FY.code,
    metadata: DEFAULT_LEDGER.metadata,
    name: DEFAULT_LEDGER.name,
    status: DEFAULT_LEDGER.ledgerStatus,
  },
  onSelectFiscalYear: jest.fn(),
  selectedFiscalYear: DEFAULT_FY.id,
};

const renderComponent = (props = {}) => (render(
  <LedgerInformation
    {...defaultProps}
    {...props}
  />,
));

describe('LedgerInformation component', () => {
  beforeEach(() => {
    useLedgerCurrentFiscalYear.mockReturnValue(DEFAULT_FY);
    useLedgerPreviousFiscalYears.mockReturnValue([DEFAULT_FY]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display NoValue', () => {
    renderComponent();
    const description = screen.getByTestId('description').querySelector('[data-test-kv-value]');

    expect(description).toHaveTextContent('-');
  });
});
