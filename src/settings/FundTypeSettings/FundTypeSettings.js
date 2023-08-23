import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import { ControlledVocab } from '@folio/stripes/smart-components';
import { getControlledVocabTranslations } from '@folio/stripes-acq-components';

import { FUND_TYPES_API } from '../../common/const';
import { fundTypesResource } from '../../common/resources';

const hiddenFields = ['numberOfObjects', 'lastUpdated'];
const visibleFields = ['name'];
const columnMapping = {
  name: <FormattedMessage id="ui-finance.fundType.name" />,
};

const fundTypeLabel = <FormattedMessage id="ui-finance.fundType.label" />;

const FundTypeSettings = ({
  intl,
  stripes,
  resources,
  mutator,
}) => {
  const hasEditPerms = stripes.hasPerm('ui-finance.settings.all');

  return (
    <ControlledVocab
      stripes={stripes}
      resources={resources}
      mutator={mutator}
      baseUrl={FUND_TYPES_API}
      records="fundTypes"
      label={intl.formatMessage({ id: 'ui-finance.fundType.label.plural' })}
      translations={getControlledVocabTranslations('ui-finance.settings.fundTypes')}
      objectLabel={fundTypeLabel}
      visibleFields={visibleFields}
      columnMapping={columnMapping}
      hiddenFields={hiddenFields}
      nameKey="name"
      id="fundTypes"
      canCreate={hasEditPerms}
      actionSuppressor={{
        edit: () => !hasEditPerms,
        delete: () => !hasEditPerms,
      }}
    />
  );
};

FundTypeSettings.manifest = Object.freeze({
  values: {
    ...fundTypesResource,
    PUT: {
      path: `${FUND_TYPES_API}/%{activeRecord.id}`,
    },
    DELETE: {
      path: `${FUND_TYPES_API}/%{activeRecord.id}`,
    },
  },
  updaterIds: [],
  activeRecord: {},
  updaters: {
    type: 'okapi',
    records: 'users',
    path: 'users',
    GET: {
      params: {
        query: (queryParams, pathComponents, resourceValues) => {
          if (resourceValues.updaterIds && resourceValues.updaterIds.length) {
            return `(${resourceValues.updaterIds.join(' or ')})`;
          }

          return null;
        },
      },
    },
  },
});

FundTypeSettings.propTypes = {
  intl: PropTypes.object.isRequired,
  stripes: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default injectIntl(FundTypeSettings);
