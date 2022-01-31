const Lottery = artifacts.require('Lottery');
const AshToken = artifacts.require('AshToken');

module.exports = async function (deployer, network, accounts) {
  
  await deployer.deploy(AshToken);
  const ashToken = await AshToken.deployed();

  await deployer.deploy(Lottery, ashToken.address);
  const lottery = await Lottery.deployed();

  await ashToken.transfer(accounts[1],'100000000000000000000');
  await ashToken.transfer(accounts[2],'100000000000000000000');
  await ashToken.transfer(accounts[3],'100000000000000000000');

}


