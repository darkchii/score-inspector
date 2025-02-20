import BeatmapDifficultyInfo from "./BeatmapDifficultyInfo";
import HitResult from "./HitResult";

class HitWindows {
    constructor() {
        this.perfect = 0;
        this.great = 0;
        this.good = 0;
        this.ok = 0;
        this.meh = 0;
        this.miss = 0;
    }

    SetDifficulty(difficulty){
        for(let range of this.GetRanges()){
            let value = BeatmapDifficultyInfo.DifficultyRange(difficulty, range.min, range.average, range.max);

            switch(range.result){
                case HitResult.Miss:
                    this.miss = value;
                    break;
                case HitResult.Meh:
                    this.meh = value;
                    break;
                case HitResult.Ok:
                    this.ok = value;
                    break;
                case HitResult.Good:
                    this.good = value;
                    break;
                case HitResult.Great:
                    this.great = value;
                    break;
                case HitResult.Perfect:
                    this.perfect = value;
                    break;
            }
        }
    }

    WindowFor(result){
        switch(result){
            case HitResult.Perfect:
                return this.perfect;
            case HitResult.Great:
                return this.great;
            case HitResult.Good:
                return this.good;
            case HitResult.Ok:
                return this.ok;
            case HitResult.Meh:
                return this.meh;
            case HitResult.Miss:
                return this.miss;
            default:
                throw new Error(`Invalid enum value ${result}`);
        }
    }

    GetRanges() {
        return [];
    }
}

export default HitWindows;