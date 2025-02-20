import DifficultyRange from "../DifficultyRange";
import HitResult from "../HitResult";
import HitWindows from "../HitWindows";

class OsuHitWindows extends HitWindows {
    constructor() {
        super();

        this.MISS_WINDOW = 400;
        this.OSU_RANGES = [
            new DifficultyRange(HitResult.Great, 80, 50, 20),
            new DifficultyRange(HitResult.Ok, 140, 100, 60),
            new DifficultyRange(HitResult.Meh, 200, 150, 100),
            new DifficultyRange(HitResult.Miss, this.MISS_WINDOW, this.MISS_WINDOW, this.MISS_WINDOW)
        ];
    }

    SetDifficulty(difficulty){
        super.SetDifficulty(difficulty);
    }

    IsHitResultAllowed(result){
        switch(result){
            case HitResult.Great:
            case HitResult.Ok:
            case HitResult.Meh:
            case HitResult.Miss:
                return true;
            default:
                return false;
        }
    }

    GetRanges(){
        return this.OSU_RANGES;
    }
}

export default OsuHitWindows;