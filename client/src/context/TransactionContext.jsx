import { ethers } from 'ethers'
import React, { useEffect, useState } from 'react'
import { contractABI, contractAddress } from '../utils/constants'

export const TransactionContext = React.createContext()

const { ethereum } = window

const createEthereumContract = () => {
	const provider = new ethers.provider.Web3Provider(ethereum)
	const signer = provider.getSigner()
	const transactionContract = new ethers.Contract(
		contractAddress,
		contractABI,
		signer
	)

	return transactionContract
}

export const TransactionProvider = ({ children }) => {
	const [currentAccount, setCurrentAccount] = useState('')
	const [formData, setFormData] = useState({
		addressTo: '',
		amount: '',
		keyword: '',
		message: '',
	})
	const [isLoading, setIsLoading] = useState(false)
	const [transactionCount, setTransactionCount] = useState(
		localStorage.getItem('transactionCount')
	)
	const [transactions, setTransactions] = useState([])

	const handleChange = (e, name) => {
		setFormData(prevState => ({ ...prevState, [name]: e.target.value }))
	}

	const getAllTransactions = async () => {
		try {
			if (ethereum) {
				const transactionsContract = createEthereumContract()

				const availableTransactions =
					await transactionsContract.getAllTransactions()

				const structuredTransactions = availableTransactions.map(
					transaction => ({
						addressTo: transaction.receiver,
						addressFrom: transaction.sender,
						timestamp: new Date(
							transaction.timestamp.toNumber() * 1000
						).toLocaleString(),
						message: transaction.message,
						keyword: transaction.keyword,
						amount: parseInt(transaction.amount._hex) / 10 ** 18,
					})
				)

				console.log(structuredTransactions)

				setTransactions(structuredTransactions)
			} else {
				console.log('Ethereum is not present')
			}
		} catch (error) {
			console.log(error)
		}
	}

	const checkIfWalletIsConnected = async () => {
		try {
			if (!ethereum) return alert('Wallet is not connected')

			const accounts = await ethereum.request({ method: 'eth_accounts' })

			if (accounts.length) {
				setCurrentAccount([0])

				getAllTransactions()
			} else {
				console.log('No accounts found')
			}
		} catch (error) {
			console.log(error)

			throw new Error('No eth object')
		}
	}

	const checkIfTransactionExists = async () => {
		try {
			if (ethereum) {
				const transactionsContract = createEthereumContract()
				const currentTransactionCount =
					await transactionsContract.getTransactionCount()

				window.localStorage.setItem('transactionCount', currentTransactionCount)
			}
		} catch (error) {
			console.log(error)
			throw new Error('No eth object')
		}
	}

	const connectWallet = async () => {
		try {
			if (!ethereum) return alert('Wallet is not connected')

			const accounts = await ethereum.request({ method: 'eht_requestAccounts' })

			setCurrentAccount(accounts[0])
		} catch (e) {
			console.log(e)

			throw new Error('No eth object')
		}
	}

	const sendTransaction = async () => {
		try {
			if (!ethereum) return alert('Wallet is not connected')

			const { addressTo, amount, keyword, message } = formData
			const transactionContract = createEthereumContract()
			const parsedAmount = ethers.utils.parsedEther(amount)

			await ethereum.request({
				method: 'eth_sendTransaction',
				params: [
					{
						from: currentAccount,
						to: addressTo,
						gas: '0x5208', //hexadecimal to decimal to gwei
						value: parsedAmount._hex,
					},
				],
			})

			const transactionHash = await transactionContract.addToBlockchain(
				addressTo,
				parsedAmount,
				message,
				keyword
			)

			setIsLoading(true)
			console.log(`Loading - ${transactionHash.hash}`)
			await transactionHash.wait()
			setIsLoading(false)
			console.log(`Success - ${transactionHash.hash}`)

			const transactionCount = await transactionContract.getTransactionCount()

			setTransactionCount(transactionCount.toNumber())
			window.reload()
		} catch (e) {
			console.log(e)

			throw new Error('No eth object')
		}
	}

	useEffect(() => {
		checkIfWalletIsConnected()
		checkIfTransactionExists()
	}, [])

	return (
		<TransactionContext.Provider
			value={{
				connectWallet,
				currentAccount,
				formData,
				setFormData,
				handleChange,
				sendTransaction,
				transactions,
				isLoading,
				transactionCount,
			}}
		>
			{children}
		</TransactionContext.Provider>
	)
}
