// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract RecruitersVerifiersContract {
    address owner;
    uint authorizedVerifiersCount;
    uint authorizedRecruitersCount;

    /**
     * @dev Set contract deployer as owner
     */
    constructor() {
        owner = msg.sender;
        authorizedVerifiersCount = 0;
        authorizedRecruitersCount = 0;
    }

    // Only owner can access
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this operation.");
        _;
    }

    //An employeer or a university
    struct Verifier{
        uint id;
        string cif;
        string name;
        uint verifierType; //1- university, 2-employeer
        string postalAddress;
        string emailAddress;
        address verifierAddress;
        bool isAuthorized;
    }
    //Address list of authorized verifiers
    address[] public authorizedVerifiers;
    mapping(address => Verifier) public verifierDetails;

    //A recruiter
    struct Recruiter{
        uint id;
        string cif;
        string name;
        string postalAddress;
        string emailAddress;
        address recruiterAddress;
        bool isAuthorized;
    }
    //Address list of authorized recruiters
    address[] public authorizedRecruiters;
    mapping(address => Recruiter) public recruiterDetails;

    mapping(address => mapping (address => uint)) public candidateRecruiterTmpAuth;

    // Function to add authorized verifiers, only owner can add them
    function addAuthorizedVerifiers(string memory _cif, string memory _name, uint _verifierType, string memory _postalAddress, 
    string memory _emailAddress, address _verifierAddress) public onlyOwner{
        Verifier memory verifier = Verifier({
            id: authorizedVerifiersCount,
            cif: _cif,
            name: _name,
            verifierType: _verifierType,
            postalAddress: _postalAddress,
            emailAddress: _emailAddress,
            verifierAddress: _verifierAddress,
            isAuthorized: true
        });
        verifierDetails[_verifierAddress] = verifier;
        authorizedVerifiers.push(_verifierAddress);
        authorizedVerifiersCount++;
    }

    // Function to add authorized recruiters, only owner can add them
    function addAuthorizedRecruiters(string memory _cif, string memory _name, string memory _postalAddress, 
    string memory _emailAddress, address _recruiterAddress) public onlyOwner{
        Recruiter memory recruiter = Recruiter({
            id: authorizedRecruitersCount,
            cif: _cif,
            name: _name,
            postalAddress: _postalAddress,
            emailAddress: _emailAddress,
            recruiterAddress: _recruiterAddress,
            isAuthorized: true
        });
        recruiterDetails[_recruiterAddress] = recruiter;
        authorizedRecruiters.push(_recruiterAddress);
        authorizedRecruitersCount++;
    }

    //Function to search verifier details, public
    function getVerifier(address _verifierAddress) public view returns (Verifier memory) {
        Verifier memory verifier = verifierDetails[_verifierAddress];
        return verifier;
    }

    //Function to search recruiter details, public
    function getRecruiter(address _recruiterAddress) public view returns (Recruiter memory) {
        Recruiter memory recruiter = recruiterDetails[_recruiterAddress];
        return recruiter;
    }

    //Function to get a list of all authorized verifiers
    function getAllAuthorizedverifiers() public view  returns (Verifier[] memory){
        Verifier[] memory verifiers = new Verifier[](authorizedVerifiersCount);
        for (uint i = 0; i < authorizedVerifiersCount; i++) {
            Verifier storage verifier = verifierDetails[authorizedVerifiers[i]];
            verifiers[i] = verifier;
        }
         return verifiers;
    }

    //Function to get a list of all authorized recruiters
    function getAllAuthorizedRecruiters() public view returns (Recruiter[] memory){
        Recruiter[] memory recruiters = new Recruiter[](authorizedRecruitersCount);
        for (uint i = 0; i < authorizedRecruitersCount; i++) {
            Recruiter storage recruiter = recruiterDetails[authorizedRecruiters[i]];
            recruiters[i] = recruiter;
        }
         return recruiters;
    }

    // get total number of verifiers authorized, public
    function getAuthorizedVerifierCount() external view returns (uint) {
        return authorizedVerifiersCount;
    }

    // get total number of recruiters authorized, public
    function getAuthorizedRecruiterCount() external view returns (uint) {
        return authorizedRecruitersCount;
    }

    function isAuthorizedRecruiter(address _recruiterAddress) external view returns (bool){
        return recruiterDetails[_recruiterAddress].isAuthorized;
    }

    function isAuthorizedVerifier(address _verifierAddress) external view returns (bool){
        return verifierDetails[_verifierAddress].isAuthorized;
    }

}