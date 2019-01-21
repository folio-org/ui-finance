import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ButtonGroup, Button } from '@folio/stripes/components';
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
    this.handleClick = this.handleClick.bind(this);
    this.handleActive = this.handleActive.bind(this);
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

  handleClick(id) {
    const { parentMutator } = this.props;
    parentMutator.query.update({ _path: `/finance/${id}`, layer: 'null' });
  }

  handleActive(id) {
    const isActive = this.state.activeTab === id ? 'primary' : 'default';
    console.log(isActive);
    return isActive;
  }

  render() {
    const isLedger = this.state.activeTab === 'ledger' ? 'primary' : 'default';
    return (
      <div className={css.SegControl}>
        <ButtonGroup activeId={this.state.activeTab} onActivate={this.handleClick}>
          <Button
            id="ledger"
            onClick={() => this.handleClick('ledger')}
            buttonStyle={this.handleActive('ledger')}
          >
            Ledger
          </Button>
          <Button
            id="fund"
            onClick={() => this.handleClick('fund')}
            buttonStyle={this.handleActive('fund')}
          >
            Fund
          </Button>
          <Button
            id="budget"
            onClick={() => this.handleClick('budget')}
            buttonStyle={this.handleActive('budget')}
          >
            Budget
          </Button>
          <Button
            id="fiscalyear"
            onClick={() => this.handleClick('fiscalyear')}
            buttonStyle={this.handleActive('fiscalyear)')}
          >
            Fiscal Year
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

export default Tabs;
