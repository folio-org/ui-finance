import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { KeyValue, NoValue } from '@folio/stripes/components';

const label = <FormattedMessage id="ui-finance.fund.information.group" />;

function ViewFundGroups({ groups }) {
  return (
    <KeyValue label={label}>
      {groups?.length
        ? groups.map((group, idx) => (
          <React.Fragment key={group.id}>
            {group.name}
            {idx !== groups.length - 1 ? ', ' : ''}
          </React.Fragment>
        ))
        : <NoValue />
      }
    </KeyValue>
  );
}

ViewFundGroups.propTypes = {
  groups: PropTypes.arrayOf(PropTypes.object),
};

ViewFundGroups.defaultProps = {
  groups: [],
};

export default ViewFundGroups;
