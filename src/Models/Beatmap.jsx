import { round } from "lodash";
import BeatmapDifficulty from "./BeatmapDifficulty";
import moment from "moment";
import Mods from "../Helpers/Mods";
import SerializableObject from "./SerializableObject";

class Beatmap extends SerializableObject {
    constructor(data, mods = null) {
        super();

        //if data is of type Beatmap, duplicate it
        if (data instanceof Beatmap) {
            return data.duplicate();
        }

        if (!mods) {
            mods = new Mods(0);
        }

        this.beatmap_id = data.beatmap_id;
        this.approved = data.approved;
        this.submit_date = data.submit_date;
        this.approved_date = data.approved_date;
        this.last_update = data.last_update;
        this.artist = data.artist;
        this.set_id = data.set_id;
        this.bpm = data.bpm;
        this.creator = data.creator;
        this.creator_id = data.creator_id;
        this.stars = parseFloat(data.stars);
        this.stars_rounded = round(this.stars, 2);
        this.diff_aim = data.diff_aim;
        this.diff_speed = data.diff_speed;
        this.cs = data.cs;
        this.od = data.od;
        this.ar = data.ar;
        this.hp = data.hp;
        this.total_length = data.total_length;
        this.source = data.source;
        this.genre = data.genre;
        this.language = data.language;
        this.title = data.title;
        this.length = data.length;
        this.diffname = data.diffname;
        this.file_md5 = data.file_md5;
        this.mode = data.mode;
        this.tags = data.tags;
        this.favorites = data.favorites;
        this.rating = data.rating;
        this.playcount = data.playcount;
        this.passcount = data.passcount;
        this.circles = data.circles;
        this.sliders = data.sliders;
        this.spinners = data.spinners;
        this.objects = this.circles + this.sliders + this.spinners;
        this.maxcombo = data.maxcombo;
        this.storyboard = data.storyboard;
        this.video = data.video;
        this.download_unavailable = data.download_unavailable;
        this.audio_unavailable = data.audio_unavailable;

        this.modded_length = this.length;
        this.modded_bpm = this.bpm;
        this.approved_date_moment = moment(this.approved_date);

        this.packs = data.packs ?? [];

        if (mods) {
            this.modded_length /= mods.speed;
            this.modded_bpm *= mods.speed;
        }

        if(data.difficulty_data){
            this.difficulty = new BeatmapDifficulty(this, data.difficulty_data, mods);
        }
    }
}

export default Beatmap;