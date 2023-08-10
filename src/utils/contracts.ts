import { getContractObj } from ".";
import { StakingEngineDetail, StakingInfo } from "./typs";
import { BigNumber, ethers } from "ethers";
import toast from "react-hot-toast";

export async function scGetStakingEngineInfo(chainId, provider, account) {
    const HEXContract = getContractObj('HEX', chainId, provider);

    try {
        const [
            currentDay,
            globalInfo,
            hexDecimals,
            hexBalance,
            stakeCount,
        ] = await Promise.all([
            HEXContract.currentDay(),
            HEXContract.globalInfo(),
            HEXContract.decimals(),
            account ? HEXContract.balanceOf(account) : BigNumber.from(0),
            account ? HEXContract.stakeCount(account) : BigNumber.from(0),
        ]);

        const getStakeListsCmds = [];
        for (let i = 0; i < stakeCount.toNumber(); i++) {
            getStakeListsCmds.push(account ? HEXContract.stakeLists(account, i) : null);
        }
        const stakedInfos = await Promise.all(getStakeListsCmds);

        const StakingInfoList: StakingInfo[] = [];
        for (let i = 0; i < stakedInfos.length; i++) {
            if (!stakedInfos[i]) continue;

            const stakeInfo: StakingInfo = {
                stakedIndex: i,
                stakedId: stakedInfos[i].stakeId
            }
            StakingInfoList.push(stakeInfo);
        }

        const stakingDetail: StakingEngineDetail = {
            currentDay: currentDay.toNumber(),
            sharePrice: globalInfo[2].toNumber(),
            hexBalance: parseFloat(ethers.utils.formatUnits(hexBalance, hexDecimals)),
            stakingInfoList: StakingInfoList
        }

        return stakingDetail;
    } catch (e) {
        console.log(e);
        return null;
    }
}

export async function scHEXTransfer(chainId, provider, to, amount) {
    const HEXContract = getContractObj('HEX', chainId, provider);
    try {
        if (parseFloat(amount) <= 0) {
            toast.error("The amount must be higher than zero!");
            return false;
        }
        const tokenDecimals = await HEXContract.decimals();
        const etherAmount: BigNumber = ethers.utils.parseUnits(amount.toString(), tokenDecimals);
        const tx = await HEXContract.transfer(to, etherAmount);
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}


export async function scHEXStakeStart(chainId, provider, newStakedHex, newStakedDays) {
    const HEXContract = getContractObj('HEX', chainId, provider);
    try {
        if (parseFloat(newStakedHex) <= 0) {
            toast.error("The amount must be higher than zero!");
            return false;
        }
        const tokenDecimals = await HEXContract.decimals();
        const newStakedHearts: BigNumber = ethers.utils.parseUnits(newStakedHex.toString(), tokenDecimals);
        const tx = await HEXContract.stakeStart(newStakedHearts, newStakedDays);
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}


export async function scHEXStakeEnd(chainId, provider, stakeIndex, stakeIdParam) {
    const HEXContract = getContractObj('HEX', chainId, provider);
    try {
        const tx = await HEXContract.stakeEnd(stakeIndex, stakeIdParam);
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}

export async function scHEXStakeGoodAccounting(chainId, provider, stakerAddr, stakeIndex, stakeIdParam) {
    const HEXContract = getContractObj('HEX', chainId, provider);
    try {
        const tx = await HEXContract.stakeGoodAccounting(stakerAddr, stakeIndex, stakeIdParam);
        await tx.wait(1);

        return true;
    } catch (e) {
        console.log(e);
        return false;
    }
}
