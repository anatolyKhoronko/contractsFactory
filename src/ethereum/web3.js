import Web3 from 'web3';

const web3= new Web3(window.web3.currentProvider);

export default web3;

const logProvider = new Web3.providers.WebsocketProvider('wss://rinkeby.infura.io/ws');

export const web3log = new Web3(logProvider);