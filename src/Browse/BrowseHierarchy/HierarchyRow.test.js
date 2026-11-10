import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import HierarchyRow from './HierarchyRow';

const buildNode = (overrides = {}) => ({
  key: 'ledger-1',
  id: 'ledger-1',
  type: 'ledger',
  name: 'Main Library',
  code: 'MAIN-LIB',
  children: [],
  ...overrides,
});

const renderComponent = (props = {}) => render(
  <HierarchyRow
    isExpanded={false}
    level={0}
    node={buildNode()}
    onToggle={jest.fn()}
    {...props}
  />,
);

describe('HierarchyRow', () => {
  it('should show the record type, name with code and status', () => {
    renderComponent({ node: buildNode({ type: 'budget', code: undefined, name: 'FY24-BUDGET', status: 'Active' }) });

    expect(screen.getByText('ui-finance.browse.hierarchy.type.budget')).toBeInTheDocument();
    expect(screen.getByText('FY24-BUDGET')).toBeInTheDocument();
    expect(screen.getByText('ui-finance.budget.status.active')).toBeInTheDocument();
  });

  it.each([
    ['ledger', 'ui-finance.ledger.status.frozen'],
    ['group', 'ui-finance.groups.status.frozen'],
    ['fund', 'ui-finance.fund.status.frozen'],
    ['budget', 'ui-finance.budget.status.frozen'],
    ['expenseClass', 'ui-finance.budget.expenseClasses.status.Frozen'],
  ])('should translate the status of a %s', (type, messageId) => {
    renderComponent({ node: buildNode({ type, status: 'Frozen' }) });

    expect(screen.getByText(messageId)).toBeInTheDocument();
  });

  it('should show the code next to the name', () => {
    renderComponent();

    expect(screen.getByText('Main Library (MAIN-LIB)')).toBeInTheDocument();
  });

  it('should not show a status when the record has none', () => {
    renderComponent();

    expect(screen.queryByText(/status/)).not.toBeInTheDocument();
  });

  it('should show "Ungrouped" without a record type', () => {
    renderComponent({ node: buildNode({ type: 'group', code: undefined, name: '', isUngrouped: true }) });

    expect(screen.getByText('ui-finance.browse.hierarchy.ungrouped')).toBeInTheDocument();
    expect(screen.queryByText('ui-finance.browse.hierarchy.type.group')).not.toBeInTheDocument();
  });

  it('should not render a toggle for a row without children', () => {
    renderComponent();

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should toggle the row by its key', async () => {
    const onToggle = jest.fn();

    renderComponent({ node: buildNode({ children: [buildNode({ key: 'child' })] }), onToggle });
    await userEvent.click(screen.getByRole('button'));

    expect(onToggle).toHaveBeenCalledWith('ledger-1');
  });

  it('should reflect the expanded state on the toggle', () => {
    renderComponent({ isExpanded: true, node: buildNode({ children: [buildNode({ key: 'child' })] }) });

    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });
});
