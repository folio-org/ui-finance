import React from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useHistory } from 'react-router';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import { GROUPS_ROUTE } from '../../common/const';
import GroupDetails from './GroupDetails';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useAcqRestrictions: jest.fn().mockReturnValue({ restrictions: {} }),
}));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));
jest.mock('./GroupInformation', () => jest.fn().mockReturnValue('GroupInformation'));
jest.mock('../../common/FinancialSummary', () => jest.fn().mockReturnValue('FinancialSummary'));

const defaultProps = {
  group: { name: 'group', status: 'Active' },
  onClose: jest.fn(),
  editGroup: jest.fn(),
  removeGroup: jest.fn(),
  groupSummary: {},
  fiscalYearsRecords: [],
  funds: [],
  selectedFY: {},
  onSelectFY: jest.fn(),
};

const renderGroupDetails = (props = defaultProps) => (render(
  <GroupDetails
    {...props}
  />,
  { wrapper: MemoryRouter },
));

describe('GroupDetails component', () => {
  it('should display group details', () => {
    const { getByText } = renderGroupDetails();

    expect(getByText('ui-finance.groups.item.information')).toBeDefined();
    expect(getByText('ui-finance.groups.item.financialSummary')).toBeDefined();
    expect(getByText('ui-finance.groups.item.fund')).toBeDefined();
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      expandAllSections.mockClear();
      collapseAllSections.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', () => {
      renderGroupDetails();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
      renderGroupDetails();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should navigate to edit view when edit shortcut is called', () => {
      renderGroupDetails();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'edit').handler();

      expect(defaultProps.editGroup).toHaveBeenCalled();
    });

    it('should navigate to new form when new shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderGroupDetails();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'new').handler();

      expect(pushMock).toHaveBeenCalledWith(`${GROUPS_ROUTE}/create`);
    });
  });
});
