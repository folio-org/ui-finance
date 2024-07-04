import user from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import GroupInformation from './GroupInformation';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  AcqUnitsView: () => <span>stripes-acq-components.label.acqUnits</span>,
}));

const MESSAGES = {
  'ui-finance.groups.item.information.name': 'name',
  'ui-finance.groups.item.information.code': 'code',
  'ui-finance.groups.item.information.fiscalYear': 'fiscalYear',
  'ui-finance.groups.item.information.status': 'status',
  'ui-finance.groups.status.active': 'active',
  'ui-finance.groups.item.information.allocated': 'allocated',
  'ui-finance.groups.item.information.unavailable': 'unavailable',
  'ui-finance.groups.item.information.available': 'available',
  'ui-finance.groups.item.information.description': 'description',
  'stripes-acq-components.label.acqUnits': 'stripes-acq-components.label.acqUnits',
  'stripes-components.selection.filterOptionsLabel': 'Label',
  'stripes-components.selection.emptyList': 'The list is empty',
  'stripes-components.selection.noMatches': 'No any matches',
  'stripes-components.tableEmpty': 'stripes-components.tableEmpty',
  'stripes-components.noValue.noValueSet': 'noValueSet',
};

const FY = {
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

const DEFAULT_GROUP = {
  id: '0a8dd71c-f1cd-4486-bbdc-dd0fa5035e3a',
  acqUnitIds: [],
  code: 'test',
  name: 'Test',
  status: 'Active',
  metadata: {
    createdDate: '2020-09-10T10:07:45.816+0000',
    createdByUserId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
    updatedDate: '2020-09-10T10:07:45.816+0000',
    updatedByUserId: 'b1add99d-530b-5912-94f3-4091b4d87e2c',
  },
};

const renderComponent = ({
  group = DEFAULT_GROUP,
  groupSummary = {},
  selectedFY = FY,
  ...props
} = {}) => (render(
  <IntlProvider locale="en" messages={MESSAGES}>
    <GroupInformation
      metadata={group.metadata}
      name={group.name}
      code={group.code}
      status={group.status}
      description={group.description}
      acqUnitIds={group.acqUnitIds}
      allocated={groupSummary.allocated}
      unavailable={groupSummary.unavailable}
      available={groupSummary.available}
      selectedFiscalYearId={selectedFY.id}
      onSelectFY={() => { }}
      fiscalYearCurrency={selectedFY.currency}
      {...props}
    />
  </IntlProvider>,
));

describe('GroupInformation component', () => {
  it('should display NoValue', () => {
    renderComponent();
    const description = screen.getByTestId('description').querySelector('[data-test-kv-value]');

    expect(description).toHaveTextContent('-');
  });

  it('should display selected FY', () => {
    renderComponent({
      fiscalYears: {
        current: [FY],
      },
    });

    expect(screen.getByText(FY.code));
  });

  it('should call "onSelectFY" when a FY was selected', async () => {
    const onSelectFY = jest.fn();
    const newFY = { ...FY, id: 'testFYId', code: 'TST2019' };

    renderComponent({
      fiscalYears: {
        current: [FY, newFY],
      },
      onSelectFY,
    });

    await user.selectOptions(screen.getByRole('combobox'), [newFY.id]);

    expect(onSelectFY).toHaveBeenCalled();
  });
});
