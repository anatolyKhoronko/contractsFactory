const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const fs = require('fs-extra');
const path = require('path');
const compiledFactory = require('./build/ContractsFactory.json');

const provider = new HDWalletProvider(
  'furnace away dream life margin spice normal analyst gorilla neglect village embody',
  'https://rinkeby.infura.io/v3/429f03444e744c5d811b3eb0984b1461',
);

const web3 = new Web3(provider);

const deploy = async() => {
  const accounts = await web3.eth.getAccounts();
  let result;
  try {
    result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
      .deploy({ data: `0x${compiledFactory.bytecode}` })
      .send({ from: accounts[0], gas: '2500000' });

    console.log('Contract deployed to :', result.options.address);

    fs.outputJSONSync(
      path.resolve(__dirname, 'address.json'),
      { 'ContractsFactory': result.options.address },
    );
  } catch (e) {
    console.log(e);
  }
  console.log(result);
};

deploy();