import { BladeburnerConstants } from "./data/Constants";
import { Action, IActionParams } from "./Action";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";

export interface IOperationParams extends IActionParams {
    reqdRank?: number;
    teamCount?: number;
}

export class Operation extends Action {
    reqdRank: number = 100;
    teamCount: number = 0;

    constructor(params: IOperationParams | null = null) {
        super(params);
        if(params && params.reqdRank) this.reqdRank   =  params.reqdRank;
        if(params && params.teamCount) this.teamCount  =  params.teamCount;
    }

    // For actions that have teams. To be implemented by subtypes.
    getTeamSuccessBonus(inst: any): number {
        if (this.teamCount && this.teamCount > 0) {
            this.teamCount = Math.min(this.teamCount, inst.teamSize);
            let teamMultiplier = Math.pow(this.teamCount, 0.05);
            return teamMultiplier;
        }

        return 1;
    }

    getActionTypeSkillSuccessBonus(inst: any): number {
        return inst.skillMultipliers.successChanceOperation;
    }

    getChaosDifficultyBonus(inst: any, params: any): number {
        const city = inst.getCurrentCity();
        if (city.chaos > BladeburnerConstants.ChaosThreshold) {
            let diff = 1 + (city.chaos - BladeburnerConstants.ChaosThreshold);
            let mult = Math.pow(diff, 0.1);
            return mult;
        }

        return 1;
    }

    static fromJSON(value: any): Operation {
        return Generic_fromJSON(Operation, value.data);
    }

    toJSON(): any {
        return Generic_toJSON("Operation", this);
    }
}

Reviver.constructors.Operation = Operation;