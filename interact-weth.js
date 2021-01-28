const { ethers } = require("ethers");
const ETHWrapper = require('./build/ETHWrapper.json')
const WETH = require('./build/WETH.json')
const config = require('./config');

const run = async function() {

	const providerURL = "http://localhost:8545";
	const privateKey = config.ganachePrivateKey; // First account from the 10th accounts created with ganache
    ;
	const wrapperContractAddress = "0x305b8DDA35b2e9b395E63Ad7B4e845859ab3aB4e";

	const provider = new ethers.providers.JsonRpcProvider(providerURL)
	
	const wallet = new ethers.Wallet(privateKey, provider)

	const wrapperContract = new ethers.Contract(wrapperContractAddress, ETHWrapper.abi, wallet)
    const wethAddress = await wrapperContract.WETHToken();

    // Wrap
    
	const tokenContract = new ethers.Contract(wethAddress, WETH.abi, wallet)
    
    const wrapValue = ethers.utils.parseEther("1")

	const wrapTx = await wrapperContract.wrap({value: wrapValue})
	await wrapTx.wait();

	let balance = await tokenContract.balanceOf(wallet.address)
    console.log("Balance after wrapping:", balance.toString())
    
	let contractETHBalance = await provider.getBalance(wrapperContractAddress);
    console.log("Contract ETH balance after wrapping:", contractETHBalance.toString())
    
    // Unwrap
    
    const approveTx = await tokenContract.approve(wrapperContractAddress, wrapValue)
	await approveTx.wait()

	const unwrapTx = await wrapperContract.unwrap(wrapValue)
	await unwrapTx.wait()

	balance = await tokenContract.balanceOf(wallet.address)
	console.log("Balance after unwrapping:", balance.toString())

	contractETHBalance = await provider.getBalance(wrapperContractAddress);
	console.log("Contract ETH balance after unwrapping:", contractETHBalance.toString())
}

run()