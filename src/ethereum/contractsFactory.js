import web3, { web3log } from './web3';
import ContractsFactory from './build/ContractsFactory.json';
import address from './address.json';



const instance = new web3.eth.Contract(
  JSON.parse(ContractsFactory.interface),
  address.ContractsFactory
);

export default instance;

export const logInstance = new web3log.eth.Contract(
  JSON.parse(ContractsFactory.interface),
  address.ContractsFactory
);