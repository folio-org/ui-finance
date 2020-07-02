import {
  FISCAL_YEAR_ROUTE,
  FUNDS_ROUTE,
  GROUPS_ROUTE,
  LEDGERS_ROUTE,
} from '../../common/const';

const viewPermissionsMap = {
  'ui-finance.ledger.view': LEDGERS_ROUTE,
  'ui-finance.fiscal-year.view': FISCAL_YEAR_ROUTE,
  'ui-finance.group.view': GROUPS_ROUTE,
  'ui-finance.fund-budget.view': FUNDS_ROUTE,
};

export const getInitialRoute = (stripes) => {
  const routesList = Object.keys(viewPermissionsMap)
    .map(perm => (stripes.hasPerm(perm) ? viewPermissionsMap[perm] : ''))
    .filter(Boolean);

  return routesList[0];
};
