const { ethers } = require("ethers");
const LimeToken = require('./build/LimeToken.json');
const config = require('./config');

const run = async function() {
    const privateKey = config.ganachePrivateKey; // First account from the 10th accounts created with ganache
    const contractAddress = '0xa00f6A3a3D00979D7B7E23D7C7dF6CC7E255Ad88'

    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
	const wallet = new ethers.Wallet(privateKey, provider);
    const limeToken = new ethers.Contract(contractAddress, LimeToken.abi, wallet);


    // // Mint Tokens to the deployer
    const lmtTokenAmount = ethers.utils.parseEther("2"); // Because ether is with 18 decimals as our token
    const mintTokenTransaction = await limeToken.mint(wallet.address, lmtTokenAmount);
    const mintTokenTransactionReceipt = await mintTokenTransaction.wait();
    if (mintTokenTransactionReceipt.status != 1) {
		console.log("Transaction was not successful")
		return 
    }

    let balance = await limeToken.balanceOf(wallet.address);
    console.log('Deployer Balance:',balance.toString())

    // Transfer to 0x465b2b6CC578268BA33f24A7e151D144b0E44D29
    let receiverAddress = '0x465b2b6CC578268BA33f24A7e151D144b0E44D29'
    const lmtTokenForTransfer = ethers.utils.parseEther("1.43"); // Because ether is with 18 decimals as our token

    let transfer = await limeToken.transfer(receiverAddress, lmtTokenForTransfer);

    let receiverBalance = await limeToken.balanceOf(receiverAddress);
    console.log('Receiver Balancer:',receiverBalance.toString());

    let balanceAfterTransferOfDeployer = await limeToken.balanceOf(wallet.address);
    console.log('Deployer Balance after transfer:',balanceAfterTransferOfDeployer.toString())

    // Burn remaining tokens of deployer
    let burnTokens = await limeToken.burn(balanceAfterTransferOfDeployer);

    let balanceAfterBurnOfDeployer = await limeToken.balanceOf(wallet.address);
    console.log('Deployer Balance after Burn:',balanceAfterBurnOfDeployer.toString())

}

run()