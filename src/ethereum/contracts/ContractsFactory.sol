pragma solidity ^0.4.24;

import "./ParticipantFactory.sol";
import "./Contract.sol";

contract ContractsFactory is ParticipantFactory {

    //data
    address private Owner;

    struct ContractData {
        address[3] participants; // always 0 == MANAGER; 1 == CUSTOMER; 2 == EXECUTOR
        uint32 amount;
        bytes32[] rules;
    }

    mapping(address => ContractData) private addressToContract;

    //events
    event CreateContract(address _contractAddress);

    constructor(){
        Owner = msg.sender;
        addressToParticipant[msg.sender] = Participant("Owner", Role.MANAGER);
    }

    //modifiers
    modifier onlyParticipantContract(address _addr) {
        ContractData memory contr = addressToContract[_addr];
        require(contr.participants[0] == msg.sender || contr.participants[1] == msg.sender || contr.participants[2] == msg.sender);
        _;
    }

    //functions
    function createContract(address _customer, address _executor, uint32 _amount, bytes32[] _rules)
    public onlyManager isCustomAndExecutor(_customer, _executor) {
        address newContract = new Contract(msg.sender, _customer, _executor, _amount, _rules);
        address[3] memory participants = [msg.sender, _customer, _executor];
        addressToContract[newContract] = ContractData(participants, _amount, _rules);
        addressParticipantToContracts[msg.sender].push(newContract);
        addressParticipantToContracts[_customer].push(newContract);
        addressParticipantToContracts[_executor].push(newContract);
        emit CreateContract(newContract);
    }

    function getContract(address _addressContract) public view onlyParticipantContract(_addressContract) returns(address[3], uint32, bytes32[])  {
        ContractData memory contr = addressToContract[_addressContract];
        return(
        contr.participants,
        contr.amount,
        contr.rules
        );
    }
}
