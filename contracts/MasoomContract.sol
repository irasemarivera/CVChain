// SPDX-License-Identifier: MIT
pragma solidity ^0.4.25;

contract MasoomContract {
    address public owner;
    uint candidateCount;
    uint voterCount;
    bool start;
    bool end;

    // Constructor
    function MasoomContract() public {
        owner = msg.sender;
        candidateCount = 0;
        voterCount = 0;
        start = false;
        end = false;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    // Only Admin can access
    modifier onlyAdmin() {
        require(msg.sender == owner);
        _;
    }
    
    struct Candidate{
        string name;
        string party;
        string manifesto;
        uint voteCount;
        uint constituency;
        uint candidateId;
    }
    mapping(uint => Candidate) public candidateDetails;

    uint public fileCount = 0;
    mapping(uint => File) public files;

    //Datatype for file
    struct File {
        uint id; //File count
        string hash; //IPFS file hash
        string title; //Title of the file
        address author; //User's wallet address
    }

    //Create an event
    event FileUploaded(
        uint id,
        string hash,
        string title,
        address author
    );
    
    // Only admin can add candidate
    function addCandidate(string _name, string _party, string _manifesto, uint _constituency) public onlyAdmin {
        Candidate memory newCandidate = Candidate({
            name : _name,
            party : _party,
            manifesto : _manifesto,
            voteCount : 0,
            constituency : _constituency,
            candidateId : candidateCount
        });
        candidateDetails[candidateCount] = newCandidate;
        candidateCount += 1;
    }
    // get total number of candidates
    function getCandidateCount() public view returns (uint) {
        return candidateCount;
    }

    function uploadFile(string memory _fileHash, string memory _title) public {
        //Make sure the file hash exists
        require(bytes(_fileHash).length >0);
        //Make sure file title exists
        require(bytes(_title).length >0);
        //Make sure uploaded address exists
        require(msg.sender!=address(0));
        // Increment file id
        fileCount++;
        //Add file to the contract
        files[fileCount] = File(fileCount, _fileHash, _title, msg.sender);
        //Trigger an event
        emit FileUploaded(fileCount, _fileHash, _title, msg.sender);
    }
    
    struct Voter{
        address voterAddress;
        string name;
        string aadhar;
        uint constituency;
        bool hasVoted;
        bool isVerified;
    }
    address[] public voters;
    mapping(address => Voter) public voterDetails;
    
    // request to be added as voter
    function requestVoter(string _name, string _aadhar, uint _constituency) public {
        Voter memory newVoter = Voter({
            voterAddress : msg.sender,
            name : _name,
            aadhar : _aadhar,
            constituency : _constituency,
            hasVoted : false,
            isVerified : false
        });
        voterDetails[msg.sender] = newVoter;
        voters.push(msg.sender);
        voterCount += 1;
    }

    // get total number of voters
    function getVoterCount() public view returns (uint) {
        return voterCount;
    }

    function verifyVoter(address _address) public onlyAdmin {
        voterDetails[_address].isVerified = true;
    }

    function vote(uint candidateId) public{
        require(voterDetails[msg.sender].hasVoted == false);
        require(voterDetails[msg.sender].isVerified == true);
        require(start == true);
        require(end == false);
        candidateDetails[candidateId].voteCount += 1;
        voterDetails[msg.sender].hasVoted = true;
    }
    
    function startElection() public onlyAdmin {
        start = true;
        end = false;
    }

    function endElection() public onlyAdmin {
        end = true;
        start = false;
    }

    function getStart() public view returns (bool) {
        return start;
    }

    function getEnd() public view returns (bool) {
        return end;
    }
}