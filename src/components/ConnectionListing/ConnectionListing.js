import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { List } from '@folio/stripes/components';
import css from './css/ConnectionListing.css';
import cssMain from '../Main/Main.css';

class ConnectionListing extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    isView: PropTypes.bool.isRequired,
    isEmptyMessage: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.object),
    path: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  dataRender(data, i) {
    return (
      <li key={i}>
        <Link to={`${this.props.path}${data.id}`}><span>{data.name}</span></Link>
      </li>
    );
  }

  render() {
    const { title, description, items } = this.props;
    const itemFormatter = (item, i) => (this.dataRender(item, i));
    const isEmptyMessage = this.props.isEmptyMessage;
    const isView = this.props.isView ? cssMain.listLabel : cssMain.listLabelEdit;
    const isDescription = description || false;
    return (
      <div className={css.list}>
        <span className={isView}>{title}</span>
        {
          isDescription &&
          <div className="label">{description}</div>
        }
        <List items={items} itemFormatter={itemFormatter} isEmptyMessage={isEmptyMessage} />
      </div>
    );
  }
}

export default ConnectionListing;
