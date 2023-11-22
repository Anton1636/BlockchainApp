require('@nomicfoundation/hardhat-toolbox')

module.exports = {
	solidity: '0.8.9',
	networks: {
		mainnet: {
			url: 'https://quick-proportionate-sky.ethereum-goerli.quiknode.pro/b70e85f9e9930a300f743f0d29f9a7d5255862c1/',
			accounts: [
				'0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
			],
		},
	},
}
