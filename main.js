document.addEventListener("DOMContentLoaded", async function () {
    const connectWalletButton = document.getElementById("connectWallet");
    const stakeButton = document.getElementById("stakeButton");
    const withdrawButton = document.getElementById("withdrawButton");
    const claimRewardsButton = document.getElementById("claimRewards");
    const stakeAmountInput = document.getElementById("stakeAmount");
    const balanceDisplay = document.getElementById("balance");
    
    let provider, signer, userAddress;
    const stakingContractAddress = "0x4e07558CE85DEE02c7EF5c21094925Fbb19D7ffB";
    const stakingABI = [
        "function stake(uint256 amount) external",
        "function withdraw(uint256 amount) external",
        "function claimRewards() external",
        "function getBalance(address user) external view returns (uint256)"
    ];

    async function connectWallet() {
        if (window.ethereum) {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            userAddress = await signer.getAddress();
            balanceDisplay.innerText = await getBalance() + " COIMx";
            connectWalletButton.innerText = "Connected";
        } else {
            alert("Please install MetaMask");
        }
    }

    async function getBalance() {
        const contract = new ethers.Contract(stakingContractAddress, stakingABI, provider);
        const balance = await contract.getBalance(userAddress);
        return ethers.utils.formatUnits(balance, 18);
    }

    async function stakeTokens() {
        if (!signer) return alert("Connect your wallet first");
        const contract = new ethers.Contract(stakingContractAddress, stakingABI, signer);
        const amount = ethers.utils.parseUnits(stakeAmountInput.value, 18);
        await contract.stake(amount);
        alert("Stake successful!");
    }

    async function withdrawTokens() {
        if (!signer) return alert("Connect your wallet first");
        const contract = new ethers.Contract(stakingContractAddress, stakingABI, signer);
        await contract.withdraw(stakeAmountInput.value);
        alert("Withdrawal successful!");
    }

    async function claimRewards() {
        if (!signer) return alert("Connect your wallet first");
        const contract = new ethers.Contract(stakingContractAddress, stakingABI, signer);
        await contract.claimRewards();
        alert("Rewards claimed successfully!");
    }

    connectWalletButton.addEventListener("click", connectWallet);
    stakeButton.addEventListener("click", stakeTokens);
    withdrawButton.addEventListener("click", withdrawTokens);
    claimRewardsButton.addEventListener("click", claimRewards);
});
