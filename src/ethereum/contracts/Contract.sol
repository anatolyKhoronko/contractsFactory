pragma solidity ^0.4.24;

contract Contract {
    //data

    enum ReviewStatus { PENDING, RESOLVE, REJECT }

    address public manager;
    address public customer;
    address public executor;
    uint32 amount;
    struct Rule {
        bytes32 description;
        bool isDone;
        ReviewStatus review;
    }
    Rule[] rules;

    //events
    event CloseContract(address _addresContract);

    constructor (address _manager, address _customer, address _executor, uint32 _amount, bytes32[] _rules){
        manager = _manager;
        customer = _customer;
        executor = _executor;
        amount = _amount;
        for(uint16 i=0; i < _rules.length; i++) {
            rules.push(Rule(_rules[i], false, ReviewStatus.PENDING));
        }
    }

    //modifiers
    modifier isCustomer () {
        require(msg.sender == customer);
        _;
    }

    modifier isExecutor () {
        require(msg.sender == executor);
        _;
    }

    modifier isManager () {
        require(msg.sender == manager);
        _;
    }

    //functions
    function getRules() public view returns(bytes32[], bool[], ReviewStatus[]) {
        bytes32[] memory descriptions = new bytes32[](rules.length);
        bool[] memory isDone = new bool[](rules.length);
        ReviewStatus[] memory reviews = new ReviewStatus[](rules.length);
        for(uint16 i = 0; i < rules.length; i++) {
            descriptions[i] = rules[i].description;
            isDone[i] = rules[i].isDone;
            reviews[i] = rules[i].review;
        }
        return (descriptions, isDone, reviews);
    }

    function isDoneRule(uint16 _index) public isExecutor {
        rules[_index].isDone = true;
    }

    function reviewRule(uint16 _index, ReviewStatus _rating ) public isExecutor {
        rules[_index].review = _rating;
        if(_rating == ReviewStatus.RESOLVE) {
            bool closeContract = false;
            for(uint16 i = 0; i < rules.length + 1; i++) {
                if(rules[i].isDone && rules[i].review == ReviewStatus.RESOLVE ) {
                    closeContract = true;
                } else {
                    closeContract = false;
                    break;
                }
            }
            if(closeContract) {
                // CLOSE Contract and send money
                emit CloseContract(address(this));
            }
        }
    }

}
