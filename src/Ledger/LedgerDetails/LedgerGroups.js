import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import { Icon } from '@folio/stripes/components';

import ConnectionListing from '../../components/ConnectionListing';
import { GROUPS_ROUTE } from '../../common/const';
import { useRelatedGroups } from './useRelatedGroups';

const defaultProps = {
  funds: [],
};

const LedgerGroups = ({
  currency,
  fiscalYearId,
  funds = defaultProps.funds,
  history,
  ledgerId,
}) => {
  const fundIds = useMemo(() => funds.map(({ id }) => id), [funds]);

  const {
    groups,
    isFetching,
  } = useRelatedGroups({
    fiscalYearId,
    fundIds,
    ledgerId,
  });

  const openGroup = useCallback(
    (e, group) => {
      const path = `${GROUPS_ROUTE}/${group.id}/view`;

      history.push(path);
    },
    [history],
  );

  if (isFetching) {
    return (
      <Icon
        icon="spinner-ellipsis"
        width="100px"
      />
    );
  }

  return (
    <ConnectionListing
      items={groups}
      currency={currency}
      openItem={openGroup}
      columnIdPrefix="group-list"
    />
  );
};

LedgerGroups.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  funds: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
  ledgerId: PropTypes.string.isRequired,
  fiscalYearId: PropTypes.string,
};

export default withRouter(LedgerGroups);
