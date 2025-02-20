import { OsuBuffer } from "./OsuBuffer";

export class OsuDb {
    constructor() {
        this.OsuVersion = 0;
        this.FolderCount = 0;
        this.AccountUnlocked = false;
        this.AccountUnlockDate = null;
        this.AccountName = "";
        this.BeatmapCount = 0;
        this.Beatmaps = [];
        this.AccountRank = null;
    }

    async Read(file) {
        const buffer = new OsuBuffer(file);
        this.OsuVersion = buffer.ReadInt32();
        this.FolderCount = buffer.ReadInt32();
        this.AccountUnlocked = buffer.ReadBoolean();
        this.AccountUnlockDate = buffer.ReadInt64();
        this.AccountName = buffer.ReadOsuString();
        this.BeatmapCount = buffer.ReadInt32();

        for (let i = 0; i < this.BeatmapCount; i++) {
            //beatmap
            let beatmap = {
                // Size: buffer.ReadInt32(), // old version only
                ArtistName: buffer.ReadOsuString(), //1
                ArtistNameUnicode: buffer.ReadOsuString(), //2
                SongTitle: buffer.ReadOsuString(), //3
                SongTitleUnicode: buffer.ReadOsuString(), //4
                CreatorName: buffer.ReadOsuString(), //5
                Difficulty: buffer.ReadOsuString(), //6
                AudioFileName: buffer.ReadOsuString(), //7
                MD5Hash: buffer.ReadOsuString(), //8
                FileName: buffer.ReadOsuString(),   //9
                RankedStatus: buffer.ReadByte(), //10
                HitCircleCount: buffer.ReadInt16(), //11
                SliderCount: buffer.ReadInt16(), //12
                SpinnerCount: buffer.ReadInt16(), //13
                LastModificationTime: buffer.ReadInt64(), //14
                ApproachRate: buffer.ReadFloat(), //15
                CircleSize: buffer.ReadFloat(), //16
                HPDrainRate: buffer.ReadFloat(), //17
                OverallDifficulty: buffer.ReadFloat(), //18
                SliderVelocity: buffer.ReadDouble() //19
            };

            let difficulties = [];
            for (let i = 0; i < 4; i++) {
                let length = buffer.ReadInt32();
                let diffs = {};
                for (let i = 0; i < length; i++) {
                    buffer.ReadByte();
                    let mode = buffer.ReadInt32();
                    buffer.ReadByte();
                    let diff;
                    if(this.OsuVersion >= 20250107){
                        diff = buffer.ReadFloat();
                    }else{
                        diff = buffer.ReadDouble();
                    }
                    diffs[mode] = diff;
                }
                difficulties.push(diffs);
            }
            beatmap = { ...beatmap, difficulties }; //20, 21, 22, 23

            beatmap = {
                ...beatmap,
                drainTime: buffer.ReadInt32(), //24
                totalTime: buffer.ReadInt32(), //25
                previewTime: buffer.ReadInt32(),    //26
            }

            let timingPoints = [];
            let timingPointsLength = buffer.ReadInt32();
            for (let i = 0; i < timingPointsLength; i++) {
                timingPoints.push([
                    buffer.ReadDouble(), //bpm
                    buffer.ReadDouble(), //offset
                    buffer.ReadBoolean(), //inherited
                ])
            }

            beatmap = { ...beatmap, timingPoints }; //27
            beatmap = {
                ...beatmap,
                beatmapID: buffer.ReadInt32(), //28 //checkpoint, is correct
                beatmapSetID: buffer.ReadInt32(), //29
                threadID: buffer.ReadInt32(), //30
                gradeStandard: buffer.ReadByte(), //31
                gradeTaiko: buffer.ReadByte(), //32
                gradeCatch: buffer.ReadByte(), //33
                gradeMania: buffer.ReadByte(), //34
                localOffset: buffer.ReadInt16(), //35
                stackLeniency: buffer.ReadFloat(), //36
                gameMode: buffer.ReadByte(), //37
                songSource: buffer.ReadOsuString(), //38
                songTags: buffer.ReadOsuString(), //39 //checkpoint, is correct
                onlineOffset: buffer.ReadInt16(), //40
                titleFont: buffer.ReadOsuString(), //41
                isUnplayed: buffer.ReadBoolean(), //42
                lastPlayed: buffer.ReadInt64(), //43
                isOsz2: buffer.ReadBoolean(), //44
                folderName: buffer.ReadOsuString(), //45
                lastChecked: buffer.ReadInt64(), //46
                ignoreBeatmapSounds: buffer.ReadBoolean(), //47
                ignoreBeatmapSkin: buffer.ReadBoolean(), //48
                disableStoryboard: buffer.ReadBoolean(), //49
                disableVideo: buffer.ReadBoolean(), //50
                visualOverride: buffer.ReadBoolean(), //51
                lastModificationTime: buffer.ReadInt32(), //52
                maniaScrollSpeed: buffer.ReadByte() //53
            }
            this.Beatmaps.push(beatmap);
        }

        this.AccountRank = buffer.ReadInt32();
    }
}