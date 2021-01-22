const etherlime = require('etherlime-lib');
const BookLibrary = require('../build/BookLibrary.json');

const deploy = async (network, secret, etherscanApiKey) => {
	const infuraApiKey = '6cc519519e394bf787e6142617dbbcc3'
	const deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, infuraApiKey);
	const result = await deployer.deploy(BookLibrary);
};

// TX Hash 0x7415410f0d02ceaf59bc65540e0e2cfce8b29ac0e7108505f30b10537a7e3114
// Address: 0x52e6D87f66023088313e602F8edB234F786F9F0b

module.exports = {
	deploy
};