import {
  FISCAL_YEAR_ROUTE,
  FUNDS_ROUTE,
  GROUPS_ROUTE,
  LEDGERS_ROUTE,
} from '../../common/const';

const routePermissionMap = {
  [LEDGERS_ROUTE]: 'ui-finance.ledger.view',
  [FISCAL_YEAR_ROUTE]: 'ui-finance.fiscal-year.view',
  [GROUPS_ROUTE]: 'ui-finance.group.view',
  [FUNDS_ROUTE]: 'ui-finance.fund-budget.view',
};

export const getInitialRoute = (stripes) => {
  const enabledRoutes = Object.keys(routePermissionMap).filter(route => stripes.hasPerm(routePermissionMap[route]));

  return enabledRoutes[0];
};
