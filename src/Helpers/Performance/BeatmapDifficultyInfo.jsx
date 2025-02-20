class BeatmapDifficultyInfo {
    static DifficultyRange(difficulty, min, mid, max) {
        if (!min && !mid && !max)
            return (difficulty - 5) / 5;

        if (difficulty > 5)
            return mid + (max - mid) * BeatmapDifficultyInfo.DifficultyRange(difficulty);
        if (difficulty < 5)
            return mid + (mid - min) * BeatmapDifficultyInfo.DifficultyRange(difficulty);
    }
}

export default BeatmapDifficultyInfo;