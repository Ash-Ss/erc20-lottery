import Web3 from 'web3';

let web3;

//optimized for server-side rendering and for absent metamask

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  //We are in the browser and metamask in running
  web3 = new Web3(window.web3.currentProvider);
} 

export default web3;
