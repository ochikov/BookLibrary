const etherlime = require('etherlime-lib');
const BookLibrary = require('../build/BookLibrary.json');
const LimeToken = require('../build/LimeToken.json');
const ETHWrapper = require('../build/ETHWrapper.json');
const LIBWrapper = require('../build/LIBWrapper.json');

const deploy = async (network, secret, etherscanApiKey) => {

	const deployer = new etherlime.EtherlimeGanacheDeployer();
	const result = await deployer.deploy(BookLibrary);
	const result2 = await deployer.deploy(LimeToken);
	const result3 = await deployer.deploy(ETHWrapper);
	const result4 = await deployer.deploy(LIBWrapper);

};

module.exports = {
	deploy
};