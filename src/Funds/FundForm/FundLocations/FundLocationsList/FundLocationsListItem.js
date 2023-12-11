import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Icon,
} from '@folio/stripes/components';

import css from './FundLocationsListItem.css';

const formatLocationValue = ({ name, code }) => [name, code && `(${code})`].join(' ');

export const FundLocationsListItem = ({
  location,
  index,
  onRemove,
}) => {
  return (
    <li className={css.listItem}>
      <span className={css.itemValue}>{formatLocationValue(location)}</span>
      <FormattedMessage id="ui-finance.fund.information.locations.action.remove">
        {aria => (
          <Button
            buttonStyle="fieldControl"
            buttonClass={css.removeBtn}
            align="end"
            type="button"
            id={`clickable-remove-location-${index}`}
            onClick={() => onRemove(location)}
            aria-label={`${aria}: ${location.name}`}
          >
            <Icon
              icon="times-circle"
              iconClassName={css.removeIcon}
              iconRootClass={css.removeIconRoot}
            />
          </Button>
        )}
      </FormattedMessage>
    </li>
  );
};

FundLocationsListItem.propTypes = {
  location: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
};
