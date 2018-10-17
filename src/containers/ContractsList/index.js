import React, { Component } from 'react';
import contractsFactory from '../../ethereum/contractsFactory';
import Contract from './Contract';

export default class ContractsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contracts: [],
    };
  }

  componentDidMount() {
    this.getContractsAddresses();
  }

  getContractsAddresses = async() => {
    const contractAddresses = await contractsFactory.methods.getParticipantContracts().call({ from: this.props.account });
    const contractsPromises = contractAddresses.map(contract => this.getContract(contract));
    const contracts = await Promise.all(contractsPromises);
    this.setState({ contracts });
  };

  getContract = async(contractAddress) => {
    const data = await contractsFactory.methods.getContract(contractAddress).call({ from: this.props.account });
    return {
        address: contractAddress,
        participants: [data[0][0], data[0][1], data[0][2]],
        amount: data[1],
        rules: [...data[2]],
      };
  };

  renderContracts = () => {
    const { contracts } = this.state;
    if (!contracts.length) return null;
    return contracts.map(contract => (
      <Contract key={contract.address} {...contract} account={this.props.account} />
    ))
  };


  render() {
    console.log(this.state.contracts);
    return <div style={{display: "flex"}} >{this.renderContracts()}</div>;
  }

}
