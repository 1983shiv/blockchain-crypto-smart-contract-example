import React, { useEffect, useLayoutEffect, useState } from 'react'
import { ethers } from 'ethers'

import { contractABI, contractAddress } from './../utils/constants'

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer)
    // console.log(provider, signer, transactionContract)
    return transactionContract;
}

export const TransactionProvider = ({ children}) => {
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [isLoading, setIsLoading] = useState(false)
    const [currentAccount, setCurrentAccount] = useState('')
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: ''})
    const [transactions, setTransactions] = useState([]);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({
            ...prevState,
            [name]: e.target.value
        }))
    }

    const getAllTransactions = async () => {
        try {
          if (ethereum) {
            const transactionsContract = getEthereumContract();
    
            const availableTransactions = await transactionsContract.getAllTransactions();
    
            const structuredTransactions = availableTransactions.map((transaction) => ({
              addressTo: transaction.receiver,
              addressFrom: transaction.sender,
              timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
              message: transaction.message,
              keyword: transaction.keyword,
              amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }));
    
            console.log(structuredTransactions);
    
            setTransactions(structuredTransactions);
          } else {
            console.log("Ethereum is not present");
          }
        } catch (error) {
          console.log(error);
        }
      };

    // console.log('addressTo', formData.addressTo)

    const checkIfWalletIsConnect = async() =>{

        try {
            if(!ethereum) return alert("please install metamask");

            const accounts = await ethereum.request({ method: 'eth_accounts'});
            if(accounts.length){
                setCurrentAccount(accounts[0])
                getAllTransactions();
            } else {
                console.log("no account found");
            }
            console.log('accounts', accounts);            
        } catch (error) {
            console.log(error);
            throw new Error("no ethereum object found")
        }
    }

    const checkIfTransactionsExists = async () => {
        try {
          if (ethereum) {
            const transactionsContract = getEthereumContract();
            const currentTransactionCount = await transactionsContract.getTransactionCount();
    
            window.localStorage.setItem("transactionCount", currentTransactionCount);
          }
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object");
        }
    };

    const connectWallet = async() => {
        try {
            if(!ethereum) return alert("please install metamask");
            const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
            throw new Error("no ethereum object found")
        }
    }

    const sendTransaction = async() => {
        try {
            
            if(!ethereum) return alert("please install metamask");
            // get the data from the form...
            setIsLoading(true)
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract()
            const parseAmount = ethers.utils.parseEther(amount)

            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 gwei
                    value: parseAmount._hex, // 0.00001
                }]
            });

            
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parseAmount, message, keyword);
            
            console.log(`Loading -- ${transactionHash.hash}`);
            await transactionHash.wait();
            setIsLoading(false)
            console.log(`Success -- ${transactionHash.hash}`);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());

        } catch (error) {
            console.log(error);
            throw new Error("there is no ethereum object found");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnect();
        checkIfTransactionsExists();
    }, [transactionCount]);
    

    return(
        // <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, handleChange, sendTransaction, isLoading }}>
        //     {children}
        // </TransactionContext.Provider>
        <TransactionContext.Provider
            value={{
                transactionCount,
                connectWallet,
                transactions,
                currentAccount,
                isLoading,
                sendTransaction,
                handleChange,
                formData,
            }}
            >
            {children}
        </TransactionContext.Provider>
    )
}