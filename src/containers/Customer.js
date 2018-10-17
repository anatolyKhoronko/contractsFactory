import React, { Component } from 'react';
import ContractsList from './ContractsList'

class Customer extends Component {
  render(){
    return(
      <div>
        <h1>Customer</h1>
        <ContractsList account={this.props.account} />
      </div>
    )
  }
}

export default Customer;