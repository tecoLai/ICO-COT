import ether from './helpers/ether';
import token from './helpers/token';
import { advanceBlock } from './helpers/advanceToBlock';
import { increaseTimeTo, duration } from './helpers/increaseTime';
import EVMRevert from './helpers/EVMRevert';
import { event_period } from './helpers/eventPeriod';
import { event_parameter } from './helpers/eventParameters';

const BigNumber = web3.BigNumber;

const should = require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should();

const COTCoinCrowdsale = artifacts.require("./COTCoinCrowdsale.sol");
const COTCoin = artifacts.require("./COTCoin.sol");


contract('COTCoinCrowdsale', function ([owner, purchaser, purchaser2, purchaser3, purchaser4, purchaser5, purchaser6, purchaser7, purchaser8, purchaser9]) {
  const wallet = owner;
  const rate = event_parameter.rate();
  const totalSupply = event_parameter.totalSupply();
  const lowest_weiAmount = 25*10**18;

  before(async function () {
    // Advance to the next block to correctly read time in the solidity "now" function interpreted by testrpc
    await advanceBlock();
  });

  beforeEach(async function () {

    this.current_time = web3.eth.getBlock(web3.eth.blockNumber).timestamp;
    this.preSales_startTime = event_period.preSales_startTime(this.current_time);
    this.preSales_endTime = event_period.preSales_endTime(this.preSales_startTime);
    this.publicSales_startTime = event_period.publicSales_startTime(this.preSales_endTime);
    this.publicSales_endTime = event_period.publicSales_endTime(this.publicSales_startTime);
    this.afterPreSales_endTime = event_period.afterPreSales_endTime(this.preSales_endTime);
    this.afterEndTime = event_period.afterEndTime(this.publicSales_endTime);
    this.lockUpTime = event_period.lockUpTime(this.publicSales_endTime); 
    this.crowdsale = await COTCoinCrowdsale.new(this.preSales_startTime, this.preSales_endTime, this.publicSales_startTime, this.publicSales_endTime, this.lockUpTime, rate, lowest_weiAmount, wallet);   
    this.token_address = await this.crowdsale.token();
    //console.log(this.token_address);
    this.token = COTCoin.at(this.token_address);
  });


  describe('disscount for pre sale', function () {
    
    it('should reject if eth lower than 25', async function () {
      await increaseTimeTo(this.preSales_startTime);
      const whitelist = [purchaser];// add users into whitelist
      await this.crowdsale.importList(whitelist);
      await this.crowdsale.sendTransaction({ value: ether(24.999999999), from: purchaser }).should.be.rejectedWith(EVMRevert);
    });

    it('should use disscount pattern 1 if eth between 25 to 41.6667', async function () {
      await increaseTimeTo(this.preSales_startTime);
      const whitelist = [purchaser];// add users into whitelist
      await this.crowdsale.importList(whitelist);
      await this.crowdsale.sendTransaction({ value: ether(25), from: purchaser }).should.be.fulfilled;
      const totalToken_data1 = await this.token.balanceOf(purchaser);
      const totalToken1 = token(totalToken_data1.toNumber(10));
      const expect_1 = 263157;

      expect_1.should.equal(totalToken1);

      await this.crowdsale.sendTransaction({ value: ether(41.6667), from: purchaser }).should.be.fulfilled;
      const totalToken_data2 = await this.token.balanceOf(purchaser);
      const totalToken2 = token(totalToken_data2.toNumber(10));
      const expect_2 = expect_1 + 438596;
      expect_2.should.equal(totalToken2);


      //return eth
      web3.eth.sendTransaction({from:owner,to:purchaser,value:web3.toWei(25,"ether")});
      web3.eth.sendTransaction({from:owner,to:purchaser,value:web3.toWei(40,"ether")});
    });

    it('should use disscount pattern 2 if eth between 41.6668 to 83.3334', async function () {
      await increaseTimeTo(this.preSales_startTime);
      const whitelist = [purchaser2, purchaser3];// add users into whitelist
      await this.crowdsale.importList(whitelist);
      await this.crowdsale.sendTransaction({ value: ether(41.6668), from: purchaser2 }).should.be.fulfilled;
      const totalToken_data1 = await this.token.balanceOf(purchaser2);
      const totalToken1 = token(totalToken_data1.toNumber(10));
      const expect_1 = 462964;
      expect_1.should.equal(totalToken1);

      await this.crowdsale.sendTransaction({ value: ether(83.3334), from: purchaser3 }).should.be.fulfilled;
      const totalToken_data2 = await this.token.balanceOf(purchaser3);
      const totalToken2 = token(totalToken_data2.toNumber(10));
      const expect_2 = 925926;
      expect_2.should.equal(totalToken2);

      //return eth
      web3.eth.sendTransaction({from:owner,to:purchaser2,value:web3.toWei(40,"ether")});
      web3.eth.sendTransaction({from:owner,to:purchaser3,value:web3.toWei(80,"ether")});      
    });    

    it('should use disscount pattern 3 if eth between 83.3335 to 250', async function () {
      await increaseTimeTo(this.preSales_startTime);
      const whitelist = [purchaser4, purchaser7];// add users into whitelist
      await this.crowdsale.importList(whitelist);
      await this.crowdsale.sendTransaction({ value: ether(83.3335), from: purchaser4 }).should.be.fulfilled;
      const totalToken_data1 = await this.token.balanceOf(purchaser4);
      const totalToken1 = token(totalToken_data1.toNumber(10));
      const expect_1 = 1041668;

      expect_1.should.equal(totalToken1);

      web3.eth.sendTransaction({from:purchaser5,to:purchaser7,value:web3.toWei(99,"ether")});
      web3.eth.sendTransaction({from:purchaser6,to:purchaser7,value:web3.toWei(99,"ether")});
      await this.crowdsale.sendTransaction({ value: ether(250.00009), from: purchaser7 }).should.be.fulfilled;
      const totalToken_data2 = await this.token.balanceOf(purchaser7);
      const totalToken2 = token(totalToken_data2.toNumber(10));
      const expect_2 = 3125001;

      expect_2.should.equal(totalToken2);

      //return eth
      web3.eth.sendTransaction({from:owner,to:purchaser4,value:web3.toWei(80,"ether")});
      web3.eth.sendTransaction({from:owner,to:purchaser5,value:web3.toWei(90,"ether")}); 
      web3.eth.sendTransaction({from:owner,to:purchaser6,value:web3.toWei(90,"ether")}); 
      web3.eth.sendTransaction({from:owner,to:purchaser7,value:web3.toWei(70,"ether")});        
    });   
    
    it('should use disscount pattern 4 if eth bigger than 250.0001', async function () {
      await increaseTimeTo(this.preSales_startTime);
      const whitelist = [purchaser8];// add users into whitelist
      await this.crowdsale.importList(whitelist);

      web3.eth.sendTransaction({from:purchaser5,to:purchaser8,value:web3.toWei(90,"ether")});
      web3.eth.sendTransaction({from:purchaser6,to:purchaser8,value:web3.toWei(90,"ether")});
      await this.crowdsale.sendTransaction({ value: ether(250.0001), from: purchaser8 }).should.be.fulfilled;
      const totalToken_data1 = await this.token.balanceOf(purchaser8);
      const totalToken1 = token(totalToken_data1.toNumber(10));
      const expect_1 = 3571430;

      expect_1.should.equal(totalToken1);

      //return eth
      web3.eth.sendTransaction({from:owner,to:purchaser5,value:web3.toWei(90,"ether")}); 
      web3.eth.sendTransaction({from:owner,to:purchaser6,value:web3.toWei(90,"ether")}); 
      web3.eth.sendTransaction({from:owner,to:purchaser8,value:web3.toWei(70,"ether")});  
    });   

  });

});
