const etherlime = require('etherlime-lib');
const BookLibrary = require('../build/BookLibrary.json');
const LimeToken = require('../build/LimeToken.json');

const deploy = async (network, secret, etherscanApiKey) => {

	const deployer = new etherlime.EtherlimeGanacheDeployer();
	const result = await deployer.deploy(BookLibrary);
	const result2 = await deployer.deploy(LimeToken);

};

module.exports = {
	deploy
};