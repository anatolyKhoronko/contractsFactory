import web3 from './web3';
import Contract from './build/Contract.json';

const instance = (address) => {
  return new Promise((res, rej) => {
   const contractInstance =  new web3.eth.Contract(
      JSON.parse(Contract.interface),
      address
    );
   res(contractInstance);
  })
};

export default instance;

