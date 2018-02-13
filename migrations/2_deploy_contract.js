var COTCoinCrowdsale = artifacts.require("./COTCoinCrowdsale.sol");

module.exports = function(deployer, network, accounts){


	var current_time = (new Date()).getTime();
	current_time = parseInt(current_time/1000);

	var preSale_startTime = (new Date('2018/02/19 00:00:00')).getTime(); //2/19
	preSale_startTime = parseInt(preSale_startTime/1000);
	preSale_startTime = preSale_startTime + 12*60*60; //12時

	var preSale_endTime = (new Date('2018/03/14 00:00:00')).getTime();
	preSale_endTime = parseInt(preSale_endTime/1000); 
	preSale_endTime = preSale_endTime + 23*60*60; //23時
	preSale_endTime = preSale_endTime + 50*60; // 50分 end

	var publicSale_startTime = (new Date('2018/03/15 00:00:00')).getTime();
	publicSale_startTime = parseInt(publicSale_startTime/1000);　
	publicSale_startTime = publicSale_startTime + 12*60*60; 　//12時

	var publicSale_endTime = (new Date('2038/01/01 00:00:00')).getTime();
	publicSale_endTime = parseInt(publicSale_endTime/1000);
	publicSale_endTime = publicSale_endTime + 23*60*60; //23時
	publicSale_endTime = publicSale_endTime + 50*60; // 50分 end

	//取引レート
	//1 ETH = 10000 COT
	const rate = new web3.BigNumber(10000);　
	const wallet = accounts[0]; //デプロイ用なアドレス設定

	const lowest_weiAmount = 25*10**18;//プレセールに最低限ETH

	deployer.deploy(COTCoinCrowdsale, preSale_startTime, preSale_endTime, publicSale_startTime, publicSale_endTime, rate, lowest_weiAmount, wallet);
};
