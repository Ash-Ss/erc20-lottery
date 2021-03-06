const { assert } = require('chai');

const Lottery = artifacts.require('Lottery');
const AshToken = artifacts.require('AshToken');
 
require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('Lottery', (accounts) => {

    let ashToken, lottery, winner;

    before(async () =>{
        ashToken = await AshToken.new()
        lottery = await Lottery.new(ashToken.address)

        await ashToken.transfer(accounts[1], tokens('100'), {from: accounts[0]})
        await ashToken.transfer(accounts[2], tokens('100'), {from: accounts[0]})
        await ashToken.transfer(accounts[3], tokens('100'), {from: accounts[0]})
    })

    describe('AshToken Deployment', async () => {
        it('has a name', async () => {
            const name = await ashToken.name() 
            assert.equal(name, 'AshToken')
        })
    })

    describe('Lottery Deployment', async () => {
        it('has a name', async () => {
            const name = await lottery.name() 
            assert.equal(name, 'Lottery Contract')
        })
    })

    describe('Buying a ticket', async () => [
        it('buys a ticket for the players', async () => {
            let result1;
            result1 = await ashToken.balanceOf(accounts[1])
            assert.equal(result1.toString(), tokens('100'), 'enough balance to buy a ticket for player 1')

            let result2;
            result2 = await ashToken.balanceOf(accounts[2])
            assert.equal(result2.toString(), tokens('100'), 'enough balance to buy a ticket for player 2')

            let result3;
            result3 = await ashToken.balanceOf(accounts[3])
            assert.equal(result3.toString(), tokens('100'), 'enough balance to buy a ticket for player 3')

            await ashToken.approve(lottery.address, tokens('100'), {from: accounts[1]})
            await lottery.enterLottery({from: accounts[1]})

            result1 = await ashToken.balanceOf(accounts[1])
            assert.equal(result1.toString(), tokens('90'), 'player 1 has bought a ticket')
            
            await ashToken.approve(lottery.address, tokens('100'), {from: accounts[2]})
            await lottery.enterLottery({from: accounts[2]})

            result2 = await ashToken.balanceOf(accounts[2])
            assert.equal(result2.toString(), tokens('90'), 'player 2 has bought a ticket')

            await ashToken.approve(lottery.address, tokens('100'), {from: accounts[3]})
            await lottery.enterLottery({from: accounts[3]})

            result3 = await ashToken.balanceOf(accounts[3])
            assert.equal(result3.toString(), tokens('90'), 'player 3 has bought a ticket')

            result3 = await ashToken.balanceOf(lottery.address)
            assert.equal(result3.toString(), tokens('30'), 'Lottery has recieved the money')
        })
    ])

    describe('Picking a winner', async () => {
        it('picks a winner and transfers the winnnings', async () => {

            await lottery.pickWinner({from : accounts[0]})
            winner = await ashToken.balanceOf(lottery.address)
            assert.equal(winner.toString(), tokens('0'), 'money is gone from lottery')

        })
    })
})

