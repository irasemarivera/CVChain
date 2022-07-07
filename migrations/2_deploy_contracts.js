var RecruitersVerifiersContract = artifacts.require("./RecruitersVerifiersContract");
var CandidateContract = artifacts.require("./CandidateContract");
module.exports = function(deployer) {
  // Deploy RecruitersVerifiersContract, then deploy CandidateContract, passing in RecruitersVerifiersContract's newly deployed address
  deployer.deploy(RecruitersVerifiersContract).then(function() {
  return deployer.deploy(CandidateContract, RecruitersVerifiersContract.address);
});
};