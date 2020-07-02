import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { MessageBanner } from '@folio/stripes/components';

const NoPermissionsMessage = () => (
  <MessageBanner type="warning">
    <FormattedMessage id="ui-finance.noPermissionsMessage" />
    <Link to="/finance">
      <FormattedMessage id="ui-finance.meta.title" />
    </Link>
  </MessageBanner>
);

export default NoPermissionsMessage;
