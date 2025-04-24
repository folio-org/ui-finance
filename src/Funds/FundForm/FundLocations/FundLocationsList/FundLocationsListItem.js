import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import css from './FundLocationsListItem.css';

const formatLocationValue = ({ name, code }, intl) => {
  return name
    ? [name, code && `(${code})`].join(' ')
    : intl.formatMessage({ id: 'stripes-acq-components.invalidReference' });
};

export const FundLocationsListItem = ({
  location,
  index,
  isEditable = true,
  onRemove,
}) => {
  const intl = useIntl();

  return (
    <li className={css.listItem}>
      <span className={css.itemValue}>{formatLocationValue(location, intl)}</span>
      {isEditable && (
        <FormattedMessage id="ui-finance.fund.information.locations.action.remove">
          {aria => (
            <Button
              buttonStyle="fieldControl"
              buttonClass={css.removeBtn}
              align="end"
              type="button"
              id={`clickable-remove-location-${index}`}
              onClick={() => onRemove(location)}
              aria-label={`${aria}: ${formatLocationValue(location, intl)}`}
            >
              <Icon
                icon="times-circle"
                iconClassName={css.removeIcon}
                iconRootClass={css.removeIconRoot}
              />
            </Button>
          )}
        </FormattedMessage>
      )}
    </li>
  );
};

FundLocationsListItem.propTypes = {
  location: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isEditable: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
};
