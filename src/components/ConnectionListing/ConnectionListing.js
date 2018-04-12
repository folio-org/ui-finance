import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from "lodash";
import List from '@folio/stripes-components/lib/List';
import css from './css/ConnectionListing.css';

class ConnectionListing extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    isEmptyMessage: PropTypes.string.isRequired,
    parentResources: PropTypes.shape(PropTypes.object),
    parentMutator: PropTypes.shape(PropTypes.object),
    items: PropTypes.arrayOf(PropTypes.object),
    path: PropTypes.string
  }

  
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { title, description, items } = this.props;
    const itemFormatter = (item, i) => (this.dataRender(item, i)); 
    const isEmptyMessage = this.props.isEmptyMessage;
console.log(this.props);
    return (
      <div className={css.list}>
        <h4>{title}</h4>
        <p>{description}</p>
        <List items={items} itemFormatter={itemFormatter} isEmptyMessage={isEmptyMessage} />
      </div>
    )
  }

  dataRender(data, i) {
    return(<li key={i}>
      <a href={`${this.props.path}${data.id}`}>{data.name}</a>
    </li>
    );
  }
}

export default ConnectionListing;