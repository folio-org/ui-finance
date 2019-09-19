import unset from 'lodash/unset';
import queryString from 'query-string';

function removeQueryParam(param) {
  const parsed = queryString.parse(this.props.location.search);

  unset(parsed, param);
  this.props.history.push(`${this.props.location.pathname}?${queryString.stringify(parsed)}`);
}

export default removeQueryParam;
