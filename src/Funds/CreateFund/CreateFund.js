import React, { useCallback } from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { withRouter } from 'react-router-dom';

import {
  FUNDS_ROUTE,
} from '../../common/const';

import { FundFormContainer } from '../FundForm';

const CreateFund = ({ history, location }) => {
  const closeForm = useCallback(
    (id) => {
      history.push({
        pathname: id ? `${FUNDS_ROUTE}/view/${id}` : FUNDS_ROUTE,
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  return (
    <FundFormContainer
      onCancel={closeForm}
    />
  );
};

CreateFund.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  history: ReactRouterPropTypes.history.isRequired,
};

export default withRouter(CreateFund);
