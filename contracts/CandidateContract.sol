// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./RecruitersVerifiersContract.sol";

contract CandidateContract {
    address owner;
    uint registeredCandidatesCount;
    uint viewResumeTime;
    RecruitersVerifiersContract recruitersVerifiersContract;

    /**
     * @dev Set contract deployer as owner
     */
    constructor(RecruitersVerifiersContract _recruitersVerifiersContract) {
        owner = msg.sender;
        registeredCandidatesCount = 0;
        viewResumeTime = 120; //Default time in secs to view a resume
        recruitersVerifiersContract = _recruitersVerifiersContract;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    // Only owner can access
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this operation.");
        _;
    }

    // Only unregistered candidates
    modifier onlyUnregisteredCandidates() {
        require (candidateDetails[msg.sender].isRegistered == false, "Candidate already registered!");
        _;
    }

    // Only registered candidates
    modifier onlyRegisteredCandidates() {
        require (candidateDetails[msg.sender].isRegistered == true, "Candidate must register first!");
        _;
    }

    // Only authorized verifiers
    modifier onlyAuthorizedVerifiers(address _verifierAddress){
        require(isAuthorizedVerifier(_verifierAddress), "Verifier is not authorized to perform this operation");
        _;
    }

    // Only authorized recruiters
    modifier onlyAuthorizedRecruiters(address _recruiterAddress){
        require(isAuthorizedRecruiter(_recruiterAddress), "Recruiter is not authorized to perform this operation");
        _;
    }

    //Struct for files of the candidate
    struct Experience {
        uint id;
        string hash;
        string title;
        uint experienceType; //Experience type: 1)academic or 2)professional
        uint candidateId;
        address author;
        bool isVerified;
        address verifiableBy;
        uint verificationDate;
    }
    mapping(address => mapping(uint => Experience)) experiencesByCandidate;
    
    //A candidate registered or not registered
    struct Candidate{
        uint id;
        string dni;
        string name;
        string lastName;
        string secondLastName;
        string postalAddress;
        string emailAddress;
        address candidateAddress;
        bool isRegistered;
        bool isVerified;
        uint experienceCount;
    }
    //Address list of registered candidates
    address[] registeredCandidates;
    mapping(address => Candidate) candidateDetails;

    mapping(address => mapping (address => uint)) candidateRecruiterTmpAuth;
    mapping(address => mapping (address => bool)) candidateVerifierPending;
    mapping(address => address[]) verifiableCandidatesHistoryByVerifier;

    //Events
    event ExperiencesAdded(Experience[] experiences);
    
    // Everybody can register themselves as candidates, only allowed to unregistered candidates
    function registerCandidate(string memory _dni, string memory _name, string memory _lastName, 
    string memory _secondLastName, string memory _postalAddress, string memory _emailAddress) 
    public onlyUnregisteredCandidates{
        Candidate memory candidate = Candidate({
            id: registeredCandidatesCount,
            dni: _dni,
            name: _name,
            lastName: _lastName,
            secondLastName: _secondLastName,
            postalAddress: _postalAddress,
            emailAddress: _emailAddress,
            candidateAddress: msg.sender,
            isRegistered: true,
            isVerified: false,
            experienceCount: 0
        });
        candidateDetails[msg.sender] = candidate;
        registeredCandidates.push(msg.sender);
        registeredCandidatesCount++;
    }

    // Function to authorize recruiters to consult candidates resumes, only allowed to registeredCandidates
    function authorizeRecruiter(address[] memory _recruiterAddresses) public onlyRegisteredCandidates{
        for (uint i = 0; i < _recruiterAddresses.length; i++) {
            candidateRecruiterTmpAuth[msg.sender][_recruiterAddresses[i]] = block.timestamp + viewResumeTime;
        }
    }

    //Function to get a list of all registered candidates, only for testing purposes (owner)
    function getRegisteredCandidates() public view onlyOwner returns (Candidate[] memory){
        Candidate[] memory candidates = new Candidate[](registeredCandidatesCount);
        for (uint i = 0; i < registeredCandidatesCount; i++) {
            Candidate storage candidate = candidateDetails[registeredCandidates[i]];
            candidates[i] = candidate;
        }
         return candidates;
    }

    //Function to get a candidate, only for recruiters authorized temporarily
    function getCandidateRecruiter(address _candidateAddress, uint _currentTime) public view onlyAuthorizedRecruiters(msg.sender) returns (Candidate memory, Experience[] memory, uint, uint){
        require (candidateRecruiterTmpAuth[_candidateAddress][msg.sender] > 0, "You are not authorized to view this resume.");
        require (candidateRecruiterTmpAuth[_candidateAddress][msg.sender] >= _currentTime, "Resume is expired. Request a new authorization");
        Candidate memory candidate = candidateDetails[_candidateAddress];
        Experience[] memory experiences = getAllExperiencesByCandidate(_candidateAddress);
        return (candidate, experiences, candidateRecruiterTmpAuth[_candidateAddress][msg.sender], _currentTime);
    }

    //Function to get my resume, only for registered candidates
    function getCandidate() public view onlyRegisteredCandidates returns (Candidate memory, Experience[] memory){
        Candidate memory candidate = candidateDetails[msg.sender];
        Experience[] memory experiences = getAllExperiencesByCandidate(msg.sender);
        return (candidate, experiences);
    }

    // get total number of candidates registered, public
    function getRegisteredCandidateCount() public view returns (uint) {
        return registeredCandidatesCount;
    }

    // get total experiences by candidate, only allowed to registered candidates
    function getExperienceCountByCandidate(address _address) public view onlyRegisteredCandidates returns (uint) {
        return candidateDetails[_address].experienceCount;
    }

    // Upload multiple experiences, only allowed to registered candidates
    function addExperiences(Experience[] memory experiences) public onlyRegisteredCandidates{
        for (uint i = 0; i < experiences.length; i++) {
            Experience memory experience = Experience({
                id: candidateDetails[msg.sender].experienceCount,
                hash: experiences[i].hash,
                title: experiences[i].title,
                experienceType: experiences[i].experienceType,
                candidateId: candidateDetails[msg.sender].id,
                author: msg.sender,
                isVerified: false,
                verifiableBy: experiences[i].verifiableBy,
                verificationDate: 0
            });
            experiencesByCandidate[msg.sender][candidateDetails[msg.sender].experienceCount] = experience;
            candidateDetails[msg.sender].experienceCount++;

            candidateDetails[msg.sender].isVerified = false;
            candidateVerifierPending[msg.sender][experiences[i].verifiableBy] = true;
            bool isCandidateVerifierAlreadyInList = false;
            for (uint j = 0; j < verifiableCandidatesHistoryByVerifier[experiences[i].verifiableBy].length; j++){
                if (verifiableCandidatesHistoryByVerifier[experiences[i].verifiableBy][j] == msg.sender)
                    isCandidateVerifierAlreadyInList = true;
            }
            if (!isCandidateVerifierAlreadyInList)
                verifiableCandidatesHistoryByVerifier[experiences[i].verifiableBy].push(msg.sender);
            
        }
 
        emit ExperiencesAdded(experiences);
    }

    //Function to get a list of all experiences added by a candidate address, only allowed to self registered candidates and recruiters
    function getAllExperiencesByCandidate(address _candidateAddress) private view returns (Experience[] memory){
        Experience[] memory experiences = new Experience[](candidateDetails[_candidateAddress].experienceCount);
        for (uint i = 0; i < candidateDetails[_candidateAddress].experienceCount; i++) {
            Experience storage experience = experiencesByCandidate[_candidateAddress][i];
            experiences[i] = experience;
        }
         return experiences;
    }

    //Function to get a list of all verifiable experiences of a candidate address, only allowed to authorized verifiers
    function getUnverifiedExperiencesByCandidate(address _candidateAddress) public view onlyAuthorizedVerifiers(msg.sender)
    returns (Experience[] memory){
        uint unverifiedExperiencesCount = 0;
        for (uint i = 0; i < candidateDetails[_candidateAddress].experienceCount; i++) {
            if(!experiencesByCandidate[_candidateAddress][i].isVerified && 
            experiencesByCandidate[_candidateAddress][i].verifiableBy == msg.sender)
                unverifiedExperiencesCount++;
        }
        Experience[] memory experiences = new Experience[](unverifiedExperiencesCount);
        uint j = 0;
        for (uint i = 0; i < candidateDetails[_candidateAddress].experienceCount; i++) {
            if(!experiencesByCandidate[_candidateAddress][i].isVerified && 
            experiencesByCandidate[_candidateAddress][i].verifiableBy == msg.sender && j < unverifiedExperiencesCount){
                Experience storage experience = experiencesByCandidate[_candidateAddress][i];
                experiences[j] = experience;
                j++;
            }
        }
        return experiences;
    }

    //Function to get candidates that have not been verified, only for authorized verifiers
    function getVerifiableCandidates() public view onlyAuthorizedVerifiers(msg.sender) returns (Candidate[] memory) {
        uint verifiableCandidatesHistoryCount = 0;
        for (uint i = 0; i < verifiableCandidatesHistoryByVerifier[msg.sender].length; i++) {
            if (candidateVerifierPending[verifiableCandidatesHistoryByVerifier[msg.sender][i]][msg.sender])
                verifiableCandidatesHistoryCount++;
        }
        Candidate[] memory candidates = new Candidate[](verifiableCandidatesHistoryCount);
        for (uint i = 0; i < verifiableCandidatesHistoryByVerifier[msg.sender].length; i++) {
            if (candidateVerifierPending[verifiableCandidatesHistoryByVerifier[msg.sender][i]][msg.sender]){
                Candidate storage candidate = candidateDetails[registeredCandidates[i]];
                candidates[i] = candidate;
            }
        }
        return (candidates);
    }

    //Function to verify experiences of a candidate, only allowed to authorized verifiers
    function verifyExperiences(Experience[] memory experiences, address _candidateAddress) public onlyAuthorizedVerifiers(msg.sender){
        bool isVerifiedCandidate = true;
        bool isCandidateVerifierNotPending = true;
        for (uint i = 0; i < candidateDetails[_candidateAddress].experienceCount; i++) {
            for (uint j = 0; j < experiences.length; j++) {
                if (compareStrings(experiencesByCandidate[_candidateAddress][i].hash, experiences[j].hash)){
                    experiencesByCandidate[_candidateAddress][i].isVerified = true;
                    experiencesByCandidate[_candidateAddress][i].verificationDate = block.timestamp;
                }
            }
            isVerifiedCandidate = isVerifiedCandidate && experiencesByCandidate[_candidateAddress][i].isVerified;
            candidateDetails[_candidateAddress].isVerified = isVerifiedCandidate;
        }
        for (uint i = 0; i < candidateDetails[_candidateAddress].experienceCount; i++) {
            if (experiencesByCandidate[_candidateAddress][i].verifiableBy == msg.sender){
                isCandidateVerifierNotPending = isCandidateVerifierNotPending && experiencesByCandidate[_candidateAddress][i].isVerified;
            }
        }
        candidateVerifierPending[_candidateAddress][msg.sender] = !isCandidateVerifierNotPending;
    }

    function getViewResumeTime() public returns (uint){
        return viewResumeTime;
    }

    function setViewResumeTime(uint _viewResumeTime) public onlyOwner{
        viewResumeTime = _viewResumeTime;
    }

    function compareStrings (string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

    function isAuthorizedRecruiter(address _recruiterAddress) private view returns (bool){
        return recruitersVerifiersContract.isAuthorizedRecruiter(_recruiterAddress);
    }

    function isAuthorizedVerifier(address _verifierAddress) private view returns (bool){
        return recruitersVerifiersContract.isAuthorizedVerifier(_verifierAddress);
    }

    function getAuthorizedVerifierCount() public view returns (uint){
        return recruitersVerifiersContract.getAuthorizedVerifierCount();
    }

    function getAuthorizedRecruiterCount() public view returns (uint){
        return recruitersVerifiersContract.getAuthorizedRecruiterCount();
    }

    function getUserRole() public view returns (uint) {
        uint userRole = 0;
        if (candidateDetails[msg.sender].isRegistered == true)
            userRole = 1;
        else if(isAuthorizedRecruiter(msg.sender))
            userRole = 2;
        else if(isAuthorizedVerifier(msg.sender))
            userRole = 3;
        else if(msg.sender == owner)
            userRole = 5;
        return userRole;
    }
}