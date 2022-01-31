import abi from './Transactions.json'


export const contractABI = abi.abi;
export const contractAddress = '0xB1B67aB3bfC3Cd7F7137FBF076B7e102cc833ad3'

export const convertAddress = (address) =>{
    return `${address.slice(0,4)}...${address.slice(address.length-4)}`
}