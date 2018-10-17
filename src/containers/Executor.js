import React, { Component } from 'react';
import ContractsList from './ContractsList'

class Executor extends Component {
  render(){
    return(
      <div>
        <h1>Executor</h1>
        <ContractsList account={this.props.account} />
      </div>
    )
  }
}

export default Executor;