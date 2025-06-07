// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract GPTMembership is ERC721 {
    address public owner;
    uint256 public membershipTypes;
    uint256 public totalMemberships;

    string public constant MY_CONTRACT = "DAULAT HUSSAIN";

    struct Membership {
        uint256 id;
        string name;
        uint256 cost;
        string date;
    }

    struct UserMembership {
        uint256 id;
        uint256 membershipId;
        address user;
        uint256 cost;
        string expireDate;
    }

    mapping(address => UserMembership) public userMemberships;
    mapping(uint256 => Membership) public memberships;
    mapping(uint256 => mapping(address => bool)) public hasBought;
    mapping(uint256 => mapping(uint256 => address)) public membershipTaken;
    mapping(uint256 => uint256[]) public membershipsTaken;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        owner = msg.sender;
    }

    function list(
        string memory _name,
        uint256 _cost,
        string memory _date
    ) public onlyOwner {
        require(_cost > 0, "Cost must be greater than zero");
        membershipTypes++;
        memberships[membershipTypes] = Membership(
            membershipTypes,
            _name,
            _cost,
            _date
        );
    }

    function mint(uint256 _membershipId, address _user, string memory _expireDate) public payable {
        require(_membershipId > 0 && _membershipId <= membershipTypes, "Invalid membership ID");
        require(msg.value >= memberships[_membershipId].cost, "Insufficient balance");
        require(!hasBought[_membershipId][_user], "User already owns this membership");

        totalMemberships++;

        userMemberships[_user] = UserMembership(
            totalMemberships,
            _membershipId,
            _user,
            memberships[_membershipId].cost,
            _expireDate
        );

        hasBought[_membershipId][_user] = true;
        membershipTaken[_membershipId][totalMemberships] = _user;
        membershipsTaken[_membershipId].push(totalMemberships);

        _safeMint(_user, totalMemberships);
    }

    function getMembership(uint256 _membershipId) public view returns (Membership memory) {
        require(_membershipId > 0 && _membershipId <= membershipTypes, "Invalid membership ID");
        return memberships[_membershipId];
    }

    function getMembershipsTaken(uint256 _membershipId) public view returns (uint256[] memory) {
        require(_membershipId > 0 && _membershipId <= membershipTypes, "Invalid membership ID");
        return membershipsTaken[_membershipId];
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdraw failed");
    }

    function getUserMembership(address _address) public view returns (UserMembership memory) {
        return userMemberships[_address];
    }
}
