import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SegmentedControl from '@folio/stripes-components/lib/SegmentedControl';
import Button from '@folio/stripes-components/lib/Button';
import css from './Tabs.css';

class Tabs extends Component {
  static propTypes = {
    tabID: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    parentMutator: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTab: ''
    };
    this.handleActivate = this.handleActivate.bind(this);
    this.setTabID = this.setTabID.bind(this);
  }

  componentDidMount() {
    this.setTabID();
  }

  setTabID() {
    const { tabID } = this.props;
    if (!tabID) return null;
    this.setState({
      activeTab: tabID,
    });
    return false;
  }

  handleActivate({ id }) {
    const { parentMutator } = this.props;
    parentMutator.query.update({ _path: `/finance/${id}`, layer: 'null' });
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
    );
  }
}

export default Tabs;
