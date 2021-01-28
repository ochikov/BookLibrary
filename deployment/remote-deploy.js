const etherlime = require('etherlime-lib');
const BookLibrary = require('../build/BookLibrary.json');
const USElection = require('../build/USElection.json');
const LIBWrapper = require('../build/LIBWrapper.json');

const config = require('../config');


const deploy = async (network, secret, etherscanApiKey) => {
	const infuraApiKey = config.infuraApiKey;
	const deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, infuraApiKey);
	const result = await deployer.deploy(BookLibrary, {}, '0x659A7debA8Ab39E8Ce96D335A289332Ce90d5188', '0x90f5b5EB9fd37306A78d5ef28123ef5dd9136E96');
	// const result2 = await deployer.deploy(USElection);
	// const result3 = await deployer.deploy(LIBWrapper);

	
};

// TX Hash 0x87c3a8a56c4706d02675ceb3dcdbcc0bb776a8a45eedf5c43e72ea365760eab8
// Address: 0x7dFc0613CA34D40F526f898D3EDbC79AdcbaF493

module.exports = {
	deploy
};