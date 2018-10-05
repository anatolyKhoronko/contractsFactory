const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const factoryPath = path.resolve(__dirname, 'contracts', 'ContractsFactory.sol');
const contractPath = path.resolve(__dirname, 'contracts', 'Contract.sol');
const participantPath = path.resolve(__dirname, 'contracts', 'ParticipantFactory.sol');
console.log(contractPath);
const sources = {
  'ContractsFactory.sol': fs.readFileSync(factoryPath, 'utf8'),
  'Contract.sol': fs.readFileSync(contractPath, 'utf8'),
  'ParticipantFactory.sol': fs.readFileSync(participantPath, 'utf8'),
};
const {contracts:output, errors} = solc.compile({ sources }, 1);
console.log(errors);

fs.ensureDirSync(buildPath);


Object.keys(output).forEach(contract => {
  console.log(contract);
  const name = contract.substr(0,contract.indexOf('.sol'));
  console.log(name);
  fs.outputJSONSync(
    path.resolve(buildPath, `${name}.json`),
    output[contract],
  );
});