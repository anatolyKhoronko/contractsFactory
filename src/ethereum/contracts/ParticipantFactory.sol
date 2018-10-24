pragma solidity ^0.4.24;

contract ParticipantFactory {

    //data

    enum Role { MANAGER, CUSTOMER, EXECUTOR }

    struct Participant {
        string name;
        Role role;
    }

    mapping(address => Participant) public addressToParticipant;
    mapping(address => address[]) public addressParticipantToContracts;

    //events

    event RegisterParticipant(address _addr, string _name, Role _role);

    //modifiers

    modifier onlyManager () {
        require(addressToParticipant[msg.sender].role == Role.MANAGER);
        _;
    }

    modifier isParticipant() {
        require(bytes(addressToParticipant[msg.sender].name).length > 0 ); //TEMPORARY!
        _;
    }

    modifier isCustomAndExecutor(address _customer, address _executor) {
        require(addressToParticipant[_customer].role == Role.CUSTOMER);
        require(addressToParticipant[_executor].role == Role.EXECUTOR);
        _;
    }

    //functions

    function registerParticipant(address _addr, string _name, Role _role) private {
        addressToParticipant[_addr] = Participant(_name, _role);
        emit RegisterParticipant(_addr, _name, _role);
    }

    function registerManager(address _addr, string _name) onlyManager {
        registerParticipant(_addr, _name, Role.MANAGER);
    }

    function registerCustomer(address _addr, string _name) onlyManager {
        registerParticipant(_addr, _name, Role.CUSTOMER);
    }

    function registerExecutor(address _addr, string _name) onlyManager {
        registerParticipant(_addr, _name, Role.EXECUTOR);
    }

    function getRole() public view isParticipant returns(uint8)  {
        uint8 role = uint8(addressToParticipant[msg.sender].role);
        return role;
    }

    function getParticipantContracts() public view isParticipant returns(address[]) {
        address[] memory contracts = addressParticipantToContracts[msg.sender];
        return contracts;
    }
}
