import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from "lodash";
import queryString from 'query-string';
// Stripes Components
import SegmentedControl from '@folio/stripes-components/lib/SegmentedControl';
import Button from '@folio/stripes-components/lib/Button';
// Components and Pages
import css from './Tabs.css';

class Tabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: ''
    }
    this.handleActivate = this.handleActivate.bind(this);
  }

  componentDidMount() {
    const id = this.props.tabID;
    if (!id) return null;
    this.setState({
      activeTab: id,
    });
  }

  handleActivate({ id }) {
    const  { parentMutator } = this.props;
    parentMutator.query.update({ _path: `/finance/${id}` });
  }
  
  render() {
    return (
      <div className={css.SegControl}>
        <SegmentedControl activeId={this.state.activeTab} onActivate={this.handleActivate}>
          <Button id="ledger">Ledger</Button>
          <Button id="fund">Fund</Button>
          <Button id="budget">Budget</Button>
          <Button id="fiscalyear">Fiscal Year</Button>
        </SegmentedControl>
      </div>
    )
  }
}

export default Tabs;