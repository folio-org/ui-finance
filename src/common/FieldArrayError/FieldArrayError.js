import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import css from './FieldArrayError.css';

export const FieldArrayError = ({ meta }) => {
  const [error, setError] = useState();

  useEffect(() => {
    Promise
      .resolve(meta?.error)
      .then(setError);
  }, [meta?.error]);

  return (
    error && !Array.isArray(error) && (
      <div className={css.error}>
        {error}
      </div>
    )
  );
};

FieldArrayError.propTypes = {
  meta: PropTypes.shape({
    error: PropTypes.node,
  }),
};
