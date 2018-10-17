import React, { Component } from 'react';
import web3 from 'web3';
import contractInstance from '../../ethereum/contract';
import { REVIEW_STATUS, PARTICIPANT_ROLE } from '../../config';

export default class Contract extends Component {

  state = {
    info: [],
  };


  getContractInfo = async() => {
    const contract = await contractInstance(this.props.address);

    const infoObj = await contract.methods.getRules().call({
      from: this.props.account,
    });
    const infoValues = Object.values(infoObj);
    let info = [];
    for (let i = 0; i < infoValues[0].length; i++) {
      info.push([infoValues[0][i], infoValues[1][i], infoValues[2][i]]);
    }
    this.setState({ info });
  };

  renderRules = () => {
    if (this.state.info.length) {
      return this.renderButton(this.state.info);
    }
    const renderRules = this.props.rules.map(rule => <li>{web3.utils.toAscii(rule)}</li>);
    return <ol>{renderRules}</ol>;
  };

  renderButton = (infoArray) => {
    const result =  infoArray.map(info => {
      const rule = <span>{web3.utils.toAscii(info[0])}</span>;
      const isDone = <button>{info[1].toString()}</button>;
      const reviewStatus = <button>{REVIEW_STATUS[info[2]]}</button>;
      const wrapper = <div style={{display: "flex", justifyContent: "space-around"}}>{rule}{isDone}{reviewStatus}</div>
      return  <li>{wrapper}</li>;
    });
    return <ol>{result}</ol>;
  };

  render() {
    const { participants, amount, address, account } = this.props;

    const renderParticipants = participants.map((address, index) => {
      const participant = PARTICIPANT_ROLE[index];
      const renderAddress = Number(address) === Number(account) ? `${address} - you` : address;
      return (
        <div>
          <h5>{participant}:</h5>
          {renderAddress}
        </div>
      );

    });
    return (
      <div style={{ border: `1px solid black`, padding: 10, margin: 10, cursor: 'pointer' }}
           onClick={this.getContractInfo}>
        <h4>{address}</h4>
        <h5>{amount}</h5>
        {renderParticipants}
        {this.renderRules()}
      </div>
    );
  }
}
