import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import { Field } from 'redux-form';

import { ControlledVocab } from '@folio/stripes/smart-components';
import {
  TextArea,
  TextField,
} from '@folio/stripes/components';

import { FUND_TYPES_API } from '../../common/const';
import { fundTypesResource } from '../../common/resources';

const fieldComponents = {
  // eslint-disable-next-line react/prop-types
  name: ({ fieldProps }) => {
    return (
      <Field
        {...fieldProps}
        component={TextField}
        fullWidth
      />
    );
  },
  // eslint-disable-next-line react/prop-types
  description: ({ fieldProps }) => {
    return (
      <Field
        {...fieldProps}
        component={TextArea}
        fullWidth
      />
    );
  },
};

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
  return (
    <ControlledVocab
      stripes={stripes}
      resources={resources}
      mutator={mutator}
      dataKey={undefined}
      baseUrl={FUND_TYPES_API}
      records="fundTypes"
      label={intl.formatMessage({ id: 'ui-finance.fundType.label.plural' })}
      labelSingular={intl.formatMessage({ id: 'ui-finance.fundType.label' })}
      objectLabel={fundTypeLabel}
      visibleFields={visibleFields}
      columnMapping={columnMapping}
      hiddenFields={hiddenFields}
      fieldComponents={fieldComponents}
      nameKey="name"
      id="fundTypes"
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
  intl: intlShape.isRequired,
  stripes: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default injectIntl(FundTypeSettings);
