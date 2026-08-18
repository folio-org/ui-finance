import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import HierarchyRow from './HierarchyRow';

const defaultProps = {
  type: 'ledger',
  id: 'ledger-1',
  name: 'Main Ledger',
  code: 'ML',
  status: 'Active',
  level: 1,
  isExpanded: false,
  hasChildren: true,
  onToggle: jest.fn(),
  isUngrouped: false,
};

const renderComponent = (props = {}) => render(
  <MemoryRouter>
    <HierarchyRow
      {...defaultProps}
      {...props}
    />
  </MemoryRouter>,
);

describe('HierarchyRow', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the row with name and code', () => {
      renderComponent();

      expect(screen.getByText('Main Ledger (ML)')).toBeInTheDocument();
    });

    it('should render the record type label', () => {
      renderComponent({ type: 'ledger' });

      expect(screen.getByText('ui-finance.browse.hierarchy.type.ledger')).toBeInTheDocument();
    });

    it('should render status when provided and not ungrouped', () => {
      renderComponent({ status: 'Active', isUngrouped: false });

      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should not render status when isUngrouped is true', () => {
      renderComponent({ status: 'Active', isUngrouped: true });

      expect(screen.queryByText('Active')).not.toBeInTheDocument();
    });

    it('should not render code when isUngrouped is true', () => {
      renderComponent({ name: 'Ungrouped', code: 'UG', isUngrouped: true });

      expect(screen.getByText('Ungrouped')).toBeInTheDocument();
      expect(screen.queryByText('Ungrouped (UG)')).not.toBeInTheDocument();
    });

    it('should apply correct indentation based on level', () => {
      renderComponent({ level: 3 });

      const row = document.querySelector('[data-type="ledger"]');

      expect(row).toHaveStyle({ paddingLeft: '72px' });
    });

    it('should set data-type and data-id attributes', () => {
      renderComponent({ type: 'fund', id: 'fund-1' });

      const row = document.querySelector('[data-type="fund"]');

      expect(row).toBeInTheDocument();
      expect(row).toHaveAttribute('data-id', 'fund-1');
    });
  });

  describe('record type labels', () => {
    it.each([
      ['ledger', 'ui-finance.browse.hierarchy.type.ledger'],
      ['group', 'ui-finance.browse.hierarchy.type.group'],
      ['fund', 'ui-finance.browse.hierarchy.type.fund'],
      ['budget', 'ui-finance.browse.hierarchy.type.budget'],
      ['expenseClass', 'ui-finance.browse.hierarchy.type.expenseClass'],
    ])('should render correct label for type "%s"', (type, expectedLabel) => {
      renderComponent({ type });

      expect(screen.getByText(expectedLabel)).toBeInTheDocument();
    });
  });

  describe('links', () => {
    it('should render a link for ledger type', () => {
      renderComponent({ type: 'ledger', id: 'led-1' });

      const link = screen.getByRole('link');

      expect(link).toHaveAttribute('href', '/finance/browse/ledger/led-1/view');
    });

    it('should render a link for group type', () => {
      renderComponent({ type: 'group', id: 'grp-1' });

      const link = screen.getByRole('link');

      expect(link).toHaveAttribute('href', '/finance/browse/group/grp-1/view');
    });

    it('should render a link for fund type', () => {
      renderComponent({ type: 'fund', id: 'fund-1' });

      const link = screen.getByRole('link');

      expect(link).toHaveAttribute('href', '/finance/browse/fund/fund-1/view');
    });

    it('should render a link for budget type', () => {
      renderComponent({ type: 'budget', id: 'bud-1' });

      const link = screen.getByRole('link');

      expect(link).toHaveAttribute('href', '/finance/browse/budget/bud-1/view');
    });

    it('should not render a link for ungrouped groups', () => {
      renderComponent({ type: 'group', id: 'ungrouped', isUngrouped: true });

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('should not render a link for expenseClass type', () => {
      renderComponent({ type: 'expenseClass', id: 'ec-1' });

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('expand/collapse', () => {
    it('should render expand button when hasChildren is true', () => {
      renderComponent({ hasChildren: true });

      expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument();
    });

    it('should render collapse button when expanded', () => {
      renderComponent({ hasChildren: true, isExpanded: true });

      expect(screen.getByRole('button', { name: 'Collapse' })).toBeInTheDocument();
    });

    it('should not render expand button when hasChildren is false', () => {
      renderComponent({ hasChildren: false });

      expect(screen.queryByRole('button', { name: 'Expand' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Collapse' })).not.toBeInTheDocument();
    });

    it('should call onToggle when expand button is clicked', async () => {
      const onToggle = jest.fn();

      renderComponent({ hasChildren: true, onToggle });

      await userEvent.click(screen.getByRole('button', { name: 'Expand' }));

      expect(onToggle).toHaveBeenCalledTimes(1);
    });

    it('should have correct aria-expanded attribute', () => {
      renderComponent({ hasChildren: true, isExpanded: true });

      const button = screen.getByRole('button', { name: 'Collapse' });

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
