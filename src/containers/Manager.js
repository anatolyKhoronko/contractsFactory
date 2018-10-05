import React, { Component } from 'react';
import PropTypes from 'prop-types';
import contractsFactory, { logInstance } from '../ethereum/contractsFactory';
import web3 from '../ethereum/web3';

class Manager extends Component {
  static propTypes = {};
  state = {
    participant: 'Customer',
    participantName: '',
    participantAddress: '',
    customer: '',
    executor: '',
    amount: '',
    rules: [''],
    contractAddress: '',
    quantityRules: 1,
  };

  registerParticipant = async(e) => {
    e.preventDefault();

    const nameFunc = `register${this.state.participant}`;
    await contractsFactory.methods[nameFunc](this.state.participantAddress, this.state.participantName).send({
      from: this.props.account,
    });
  };

  createContract = async(e) => {
    console.log('ca;;');
    e.preventDefault();
    const { customer, executor, amount, rules } = this.state;
    const byteRules = rules.map(rule => web3.utils.fromAscii(rule));
    await contractsFactory.methods.createContract(customer, executor, amount, byteRules).send({
      from: this.props.account,
    });
  };

  getContract = async(contract) => {
    // e.preventDefault();
    console.log('ds');
    const contractData = await contractsFactory.methods.getContract(contract).call({ from: this.props.account });
    console.log(contractData);
    return contractData;
    // this.setState({ contract });
  };

  getContracts = async(e) => {
    e.preventDefault();
    console.log('asd');
    const contracts = await contractsFactory.methods.getParticipantContracts().call({ from: this.props.account });
    const contractsData = contracts.map(contract => this.getContract(contract));
    const result = await Promise.all(contractsData);
    this.setState({contracts: this.renderContract(result)});
  };


  renderContract = (contracts) => {
    if (!contracts.length) return null;
    return contracts.map(contract => {
      const rules = contract[2].map(rule => <p>{web3.utils.toAscii(rule)}</p>);
      const participants = contract[0].map((address, index) => {
        let participant;
        if (index === 0) participant = 'Manager';
        else if (index === 1) participant = 'Customer';
        else participant = 'Executor';
        return (
          <p>
            {participant}:
            <br/>
            {address}
          </p>
        );

      });
      const amount = contract[1];
      return (
        <div style={{border: `1px solid black`}}>
          {participants}
          {amount}
          {rules}
        </div>);
    });


  };

  handlerRules = (e, index) => {
    const _target = e.target;
    this.setState((state) => {
      console.log(state);
      const newRules = [...state.rules];
      newRules[index] = _target.value;
      return {
        rules: newRules,
      };
    });
  };

  renderRulesField = () => {
    console.log(this.state.rules[0]);

    return Array(this.state.quantityRules).fill('').map((it, index) =>
      <input key={`rule${index}`} value={this.state.rules[index]} onChange={(e) => this.handlerRules(e, index)}
             type="text"/>);
  };


  changeField = field => e => this.setState({ [field]: e.target.value });


//"0xda3c4831D767726f549491aa92ba6D6033B04311"

  render() {
    const { customer, executor, amount, rules, participant, participantAddress, participantName, contracts } = this.state;
    return (
      <div>
        <h1>Manager</h1>
        <h2>Create Participant</h2>
        <form style={{ display: 'flex' }} onSubmit={this.registerParticipant}>
          <input value={participantAddress} placeholder="address"
                 onChange={this.changeField('participantAddress')} type="text"/>
          <input value={participantName} placeholder="name"
                 onChange={this.changeField('participantName')} type="text"/>
          <select value={participant} onChange={this.changeField('participant')}>
            <option value="Customer">Customer</option>
            <option value="Executor">Executor</option>
            <option value="Manager">Manager</option>
          </select>
          <button>Add</button>
        </form>
        <hr/>
        <h2>Create Contract</h2>
        <form>
          <div>
            <label>Customer</label>
            <input value={customer} onChange={this.changeField('customer')}/>
          </div>
          <div>
            <label>Executor</label>
            <input value={executor} onChange={this.changeField('executor')}/>
          </div>
          <div>
            <label>Amount</label>
            <input value={amount} onChange={this.changeField('amount')}/>
          </div>
          <button onClick={(e) => {
            e.preventDefault();
            this.setState({ quantityRules: this.state.quantityRules + 1 });
          }}>+
          </button>
          {this.renderRulesField()}
          <br/>
          <button onClick={this.createContract}>CREATE</button>
        </form>

        <hr/>
        <form onSubmit={this.getContracts}>
          {/*<label>Contract address</label>*/}
          {/*<input type="text" value={contractAddress} onChange={this.changeField('contractAddress')}/>*/}
          <button>Get Contracts</button>
        </form>
        {contracts}
      </div>
    );
  }
}


export default Manager;