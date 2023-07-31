import { currentNetwork, getContractObj } from ".";
import { StakingEngineDetail } from "./typs";
import { BigNumber, ethers } from "ethers";
import toast from "react-hot-toast";
import { pulsechain } from 'wagmi/chains'

export async function scGetBalances(account) {
    const jsonProvider = new ethers.providers.JsonRpcProvider(pulsechain.rpcUrls.public.http[0]);
    const TokenContract = getContractObj('AztecToken', currentNetwork, jsonProvider);
    try {
        const [
            MATICBalance,
            AztecTokenDecimals,
            AztecTokenBalance,
        ] = await Promise.all([
            account ? jsonProvider.getBalance(account) : BigNumber.from(0),
            TokenContract.decimals(),
            account ? TokenContract.balanceOf(account) : BigNumber.from(0),
        ]);
        return [parseFloat(ethers.utils.formatEther(MATICBalance)), parseFloat(ethers.utils.formatUnits(AztecTokenBalance, AztecTokenDecimals))];
    } catch (e) {
        console.log(e);
        return [0.00, 0.00];
    }
}

export async function scGetStakingEngineInfo(account) {
    const jsonProvider = new ethers.providers.JsonRpcProvider(pulsechain.rpcUrls.public.http[0]);
    const StakingContract = getContractObj('StakingContract', currentNetwork, jsonProvider);
    const TokenContract = getContractObj('AztecToken', currentNetwork, jsonProvider);

    try {
        const [
            AztecTokenDecimals,
            AztecTokenBalance,

            stakedData,

            periodForBronze,
            bronzeRewards,

            periodForSilver,
            silverRewards,

            periodForGold,
            goldRewards,
        ] = await Promise.all([
            TokenContract.decimals(),
            account ? TokenContract.balanceOf(account) : BigNumber.from(0),

            account ? StakingContract.stakes(account) : null,

            StakingContract.periodForBronze(),
            account ? StakingContract.getBronzeRewards(account) : BigNumber.from(0),
            StakingContract.periodForSilver(),
            account ? StakingContract.getSilverRewards(account) : BigNumber.from(0),
            StakingContract.periodForGold(),
            account ? StakingContract.getGoldRewards(account) : BigNumber.from(0),
        ]);

        const stakingDetail: StakingEngineDetail = {
            AztecTokenBalance: parseFloat(ethers.utils.formatUnits(AztecTokenBalance, AztecTokenDecimals)),

            periodForBronze: periodForBronze.toNumber(),
            bronzeStaked: stakedData ? parseFloat(ethers.utils.formatUnits(stakedData[0], AztecTokenDecimals)) : 0.00,
            bronzeStakedTimestamp: stakedData ? stakedData[1].toNumber() : 0,
            bronzeRewards: parseFloat(ethers.utils.formatUnits(bronzeRewards, AztecTokenDecimals)),

            periodForSilver: periodForSilver.toNumber(),
            silverStaked: stakedData ? parseFloat(ethers.utils.formatUnits(stakedData[3], AztecTokenDecimals)) : 0.00,
            silverStakedTimestamp: stakedData ? stakedData[4].toNumber() : 0,
            silverRewards: parseFloat(ethers.utils.formatUnits(silverRewards, AztecTokenDecimals)),

            periodForGold: periodForGold.toNumber(),
            goldStaked: stakedData ? parseFloat(ethers.utils.formatUnits(stakedData[6], AztecTokenDecimals)) : 0.00,
            goldStakedTimestamp: stakedData ? stakedData[7].toNumber() : 0,
            goldRewards: parseFloat(ethers.utils.formatUnits(goldRewards, AztecTokenDecimals)),
        }

        return stakingDetail;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function scStakeBronze(chainId, provider, account, amount) {
    const StakingContract = getContractObj('StakingContract', chainId, provider);
    const TokenContract = getContractObj('AztecToken', chainId, provider);
    try {
        if (parseFloat(amount) <= 0) {
            toast.error("The amount must be higher than zero!");
            return false;
        }
        const tokenDecimals = await TokenContract.decimals();
        const etherAmount: BigNumber = ethers.utils.parseUnits(amount.toString(), tokenDecimals);
        const allowancedAmount: BigNumber = await TokenContract.allowance(account, StakingContract.address);
        if (allowancedAmount.lt(etherAmount)) {
            const tx = await TokenContract.approve(StakingContract.address, ethers.constants.MaxUint256);
            await tx.wait(1);
        }

        const tx = await StakingContract.stakeForBronze(etherAmount);
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function scStakeSilver(chainId, provider, account, amount) {
    const StakingContract = getContractObj('StakingContract', chainId, provider);
    const TokenContract = getContractObj('AztecToken', chainId, provider);
    try {
        if (parseFloat(amount) <= 0) {
            toast.error("The amount must be higher than zero!");
            return false;
        }
        const tokenDecimals = await TokenContract.decimals();
        const etherAmount: BigNumber = ethers.utils.parseUnits(amount.toString(), tokenDecimals);
        const allowancedAmount: BigNumber = await TokenContract.allowance(account, StakingContract.address);
        if (allowancedAmount.lt(etherAmount)) {
            const tx = await TokenContract.approve(StakingContract.address, ethers.constants.MaxUint256);
            await tx.wait(1);
        }

        const tx = await StakingContract.stakeForSilver(etherAmount);
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function scStakeGold(chainId, provider, account, amount) {
    const StakingContract = getContractObj('StakingContract', chainId, provider);
    const TokenContract = getContractObj('AztecToken', chainId, provider);
    try {
        if (parseFloat(amount) <= 0) {
            toast.error("The amount must be higher than zero!");
            return false;
        }
        const tokenDecimals = await TokenContract.decimals();
        const etherAmount: BigNumber = ethers.utils.parseUnits(amount.toString(), tokenDecimals);
        const allowancedAmount: BigNumber = await TokenContract.allowance(account, StakingContract.address);
        if (allowancedAmount.lt(etherAmount)) {
            const tx = await TokenContract.approve(StakingContract.address, ethers.constants.MaxUint256);
            await tx.wait(1);
        }

        const tx = await StakingContract.stakeForGold(etherAmount);
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function scClaimBronze(chainId, provider) {
    const StakingContract = getContractObj('StakingContract', chainId, provider);
    try {
        const tx = await StakingContract.claimForBronze();
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function scClaimSilver(chainId, provider) {
    const StakingContract = getContractObj('StakingContract', chainId, provider);
    try {
        const tx = await StakingContract.claimForSilver();
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function scClaimGold(chainId, provider) {
    const StakingContract = getContractObj('StakingContract', chainId, provider);
    try {
        const tx = await StakingContract.claimForGold();
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}