import React, { Component } from 'react';
import web3 from './ethereum/web3';
import contractsFactory, { logInstance } from './ethereum/contractsFactory';

import Manager from './containers/Manager';
import Executor from './containers/Executor';
import Customer from './containers/Customer';

class App extends Component {
  state = {
    account: '',
    participant: 'Customer',
    participantAddress: '',
    participantName: '',
    role: '',
  };

  events = () => {

    web3.currentProvider.publicConfigStore.on('update', async(arg) => {
      if (arg.selectedAddress != this.state.account) {

        this.setState({ account: arg.selectedAddress });
        this.getRole(this.state.account);
        console.log('Change ethereum accounts', arg, this.state.account);
      }
    });

    logInstance.events.RegisterParticipant()
      .on('data', data => console.log('Register Participant', data))
      .on('error', err => console.log('Register Participant', err));

    logInstance.events.CreateContract()
      .on('data', data => console.log('Create Contract', data))
      .on('error', err => console.log('Create Contract', err));


  };

  getRole = async(acc) => {
    try {
      const role = await contractsFactory.methods.getRole().call({ from: acc });
      console.log(role);
      this.setState({ role });
    } catch (e) {
      this.setState({ role: false });
    }
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] });
    this.getRole(accounts[0]);
    this.events();

  }


  showParticipant = () => {

    const props = {
      account: this.state.account,
    };

    switch (this.state.role) {
      case '0':
        return <Manager {...props}/>;
      case '1':
        return <Customer {...props}/>;
      case '2':
        return <Executor {...props}/>;
      default:
        return <h1>Loading...</h1>;
    }
  };


  render() {
    return (
      <section >
        {this.showParticipant()}

      </section>
    );
  }
}

export default App;
