const { ethers } = require("ethers");
const LimeToken = require('./build/LimeToken.json');
const config = require('./config');

const run = async function() {
    const privateKey = config.ganachePrivateKey; // First account from the 10th accounts created with ganache
    const contractAddress = '0x9eD274314f0fB37837346C425D3cF28d89ca9599'

    const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
	const wallet = new ethers.Wallet(privateKey, provider);
    const limeToken = new ethers.Contract(contractAddress, LimeToken.abi, wallet);


    // // Mint Tokens to the deployer
    const lmtTokenAmount = '2000000000000000000'; // 2 LMT
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
    lmtTokenForTransfer = '1430000000000000000';
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