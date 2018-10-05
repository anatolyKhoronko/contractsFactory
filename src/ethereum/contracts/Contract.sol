pragma solidity ^0.4.24;

contract Contract {
    //data
    address manager;
    address customer;
    address executor;
    uint32 amount;
    bytes32[] rules;

    //events

    constructor (address _manager, address _customer, address _executor, uint32 _amount, bytes32[] _rules){
        manager = _manager;
        customer = _customer;
        executor = _executor;
        amount = _amount;
        rules = _rules;
    }


    //modifiers



    //functions


}
