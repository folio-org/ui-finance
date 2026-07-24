import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import HierarchyControls from './HierarchyControls';

const defaultProps = {
  allLedgersExpanded: false,
  allGroupsExpanded: false,
  allFundsExpanded: false,
  allBudgetsExpanded: false,
  onToggleLedgers: jest.fn(),
  onToggleGroups: jest.fn(),
  onToggleFunds: jest.fn(),
  onToggleBudgets: jest.fn(),
};

const renderComponent = (props = {}) => render(
  <HierarchyControls
    {...defaultProps}
    {...props}
  />,
);

describe('HierarchyControls', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('expand labels', () => {
    it('should show "expand" labels when all are collapsed', () => {
      renderComponent();

      expect(screen.getByText('ui-finance.browse.hierarchy.expandLedgers')).toBeInTheDocument();
      expect(screen.getByText('ui-finance.browse.hierarchy.expandGroups')).toBeInTheDocument();
      expect(screen.getByText('ui-finance.browse.hierarchy.expandFunds')).toBeInTheDocument();
      expect(screen.getByText('ui-finance.browse.hierarchy.expandBudgets')).toBeInTheDocument();
    });

    it('should show "collapse" labels when all are expanded', () => {
      renderComponent({
        allLedgersExpanded: true,
        allGroupsExpanded: true,
        allFundsExpanded: true,
        allBudgetsExpanded: true,
      });

      expect(screen.getByText('ui-finance.browse.hierarchy.collapseLedgers')).toBeInTheDocument();
      expect(screen.getByText('ui-finance.browse.hierarchy.collapseGroups')).toBeInTheDocument();
      expect(screen.getByText('ui-finance.browse.hierarchy.collapseFunds')).toBeInTheDocument();
      expect(screen.getByText('ui-finance.browse.hierarchy.collapseBudgets')).toBeInTheDocument();
    });

    it('should show mixed expand/collapse labels', () => {
      renderComponent({
        allLedgersExpanded: true,
        allGroupsExpanded: false,
        allFundsExpanded: true,
        allBudgetsExpanded: false,
      });

      expect(screen.getByText('ui-finance.browse.hierarchy.collapseLedgers')).toBeInTheDocument();
      expect(screen.getByText('ui-finance.browse.hierarchy.expandGroups')).toBeInTheDocument();
      expect(screen.getByText('ui-finance.browse.hierarchy.collapseFunds')).toBeInTheDocument();
      expect(screen.getByText('ui-finance.browse.hierarchy.expandBudgets')).toBeInTheDocument();
    });
  });

  describe('click handlers', () => {
    it('should call onToggleLedgers when ledgers button is clicked', async () => {
      const onToggleLedgers = jest.fn();

      renderComponent({ onToggleLedgers });

      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandLedgers'));

      expect(onToggleLedgers).toHaveBeenCalledTimes(1);
    });

    it('should call onToggleGroups when groups button is clicked', async () => {
      const onToggleGroups = jest.fn();

      renderComponent({ onToggleGroups });

      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandGroups'));

      expect(onToggleGroups).toHaveBeenCalledTimes(1);
    });

    it('should call onToggleFunds when funds button is clicked', async () => {
      const onToggleFunds = jest.fn();

      renderComponent({ onToggleFunds });

      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandFunds'));

      expect(onToggleFunds).toHaveBeenCalledTimes(1);
    });

    it('should call onToggleBudgets when budgets button is clicked', async () => {
      const onToggleBudgets = jest.fn();

      renderComponent({ onToggleBudgets });

      await userEvent.click(screen.getByText('ui-finance.browse.hierarchy.expandBudgets'));

      expect(onToggleBudgets).toHaveBeenCalledTimes(1);
    });
  });

  it('should render separator characters between controls', () => {
    renderComponent();

    const separators = screen.getAllByText('|');

    expect(separators).toHaveLength(3);
  });
});
