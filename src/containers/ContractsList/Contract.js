import React, {Component} from 'react';
import web3 from 'web3';
import contractInstance from '../../ethereum/contract';
import {REVIEW_STATUS, PARTICIPANT_ROLE} from '../../config';

export default class Contract extends Component {

    getContractInfo = async () => {
        const contract = await contractInstance(this.props.address);

        const infoObj = await contract.methods.getRules().call({
            from: this.props.account,
        });
        const infoValues = Object.values(infoObj);
        let info = [];
        for (let i = 0; i < infoValues[0].length; i++) {
            info.push([infoValues[0][i], infoValues[1][i], infoValues[2][i]]);
        }
        console.log(info);
        //[0] description rule(bytes32)
        //[1] isDone (bool)
        //[2] review [number] 0 - PENDING, 1 - RESOLVE, 2 - REJECT
    };

    renderRules = () => {
        const renderRules = this.props.rules.map(rule => {
            const stringRule = web3.utils.toAscii(rule);
            const lastSymbol = stringRule.indexOf('\u0000');

            const result = lastSymbol !== -1 ? stringRule.substr(0, lastSymbol) : stringRule;
            return <li>{result}</li>
        });
        return <ol>{renderRules}</ol>;
    };

    render() {
        const {participants, amount, address, account} = this.props;

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
            <div style={{border: `1px solid black`, padding: 10, margin: 10, cursor: 'pointer'}}
                 onClick={this.getContractInfo}>
                <h4>{address}</h4>
                <h5>{amount}</h5>
                {renderParticipants}
                {this.renderRules()}
            </div>
        );
    }
}
