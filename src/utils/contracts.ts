import { getContractObj } from ".";
import { StakingEngineDetail } from "./typs";
import { BigNumber, ethers } from "ethers";
import toast from "react-hot-toast";

export async function scGetStakingEngineInfo(chainId, provider) {
    const HEXContract = getContractObj('HEX', chainId, provider);

    try {
        const [
            startDay,
            globalInfo,
        ] = await Promise.all([
            HEXContract.currentDay(),
            HEXContract.globalInfo(),
        ]);

        const stakingDetail: StakingEngineDetail = {
            startDay: startDay.toNumber(),
            sharePrice: globalInfo[2].toNumber(),
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
