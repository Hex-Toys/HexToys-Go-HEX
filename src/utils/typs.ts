export interface StakingEngineDetail {
    currentDay: number;
    sharePrice: number;
    hexBalance: number;
    stakingInfoList: StakingInfo[];
}

export interface StakingInfo {
    stakedIndex: number;
    stakedId: number;
}