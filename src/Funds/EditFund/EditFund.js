import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import {
  FUNDS_ROUTE,
} from '../../common/const';

import { FundFormContainer } from '../FundForm';

const EditFund = ({ history, location, match }) => {
  const fundId = match.params.id;

  const closeForm = useCallback(
    () => {
      history.push({
        pathname: `${FUNDS_ROUTE}/view/${fundId}`,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fundId, location.search],
  );

  return (
    <FundFormContainer
      onCancel={closeForm}
    />
  );
};

EditFund.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default withRouter(EditFund);
