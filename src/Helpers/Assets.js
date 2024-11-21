import { ReactComponent as SVG_GRADE_XH } from "../Assets/Grades/Grade-XH.svg";
import { ReactComponent as SVG_GRADE_X } from "../Assets/Grades/Grade-X.svg";
import { ReactComponent as SVG_GRADE_SH } from "../Assets/Grades/Grade-SH.svg";
import { ReactComponent as SVG_GRADE_S } from "../Assets/Grades/Grade-S.svg";
import { ReactComponent as SVG_GRADE_A } from "../Assets/Grades/Grade-A.svg";
import { ReactComponent as SVG_GRADE_B } from "../Assets/Grades/Grade-B.svg";
import { ReactComponent as SVG_GRADE_C } from "../Assets/Grades/Grade-C.svg";
import { ReactComponent as SVG_GRADE_D } from "../Assets/Grades/Grade-D.svg";
import { ReactComponent as SVG_TRIANGLES } from "../Assets/Triangles.svg";

import IMG_SVG_GRADE_XH from "../Assets/Grades/Grade-XH.svg";
import IMG_SVG_GRADE_X from "../Assets/Grades/Grade-X.svg";
import IMG_SVG_GRADE_SH from "../Assets/Grades/Grade-SH.svg";
import IMG_SVG_GRADE_S from "../Assets/Grades/Grade-S.svg";
import IMG_SVG_GRADE_A from "../Assets/Grades/Grade-A.svg";
import IMG_SVG_GRADE_B from "../Assets/Grades/Grade-B.svg";
import IMG_SVG_GRADE_C from "../Assets/Grades/Grade-C.svg";
import IMG_SVG_GRADE_D from "../Assets/Grades/Grade-D.svg";

import IMG_CLANS_BG from "../Assets/Other/clans.jpg";

import IMG_TRIANGLES from "../Assets/Triangles.svg";

import PNG_GUEST from "../Assets/Guest.png";

import PNG_LEVEL_BADGE from "../Assets/levelbadge.png";

//this dictates the custom icon badge
//these mods simply get the acronym overlayed on the badge
function getModIcon(acronym, is_type = false) {
    if(acronym === null || acronym === undefined){
        console.error("getModIcon: acronym is null or undefined");
        return null;
    }
    acronym = acronym.toUpperCase();
    const modIcons = require.context('../Assets/Mods', true);
    try{
        let name;
        if(is_type){
            name = `./MOD_BG_${acronym}.png`;
        }else{
            name = `./MOD_${acronym}.png`;
        }
        const icon = modIcons(name);
        return icon;
    }catch(err){ 
        console.error(err);
    }
    return null;
}

export function getPossibleMods() {
    return [
        "EZ",
        "NF",
        "HT",
        "HR",
        "SD",
        "PF",
        "DT",
        "NC",
        "HD",
        "FL",
        "TD",
        "SO",
        "None"
    ]
}

const _GRADE_ICONS = [];
_GRADE_ICONS['XH'] = <SVG_GRADE_XH />;
_GRADE_ICONS['X'] = <SVG_GRADE_X />;
_GRADE_ICONS['SH'] = <SVG_GRADE_SH />;
_GRADE_ICONS['S'] = <SVG_GRADE_S />;
_GRADE_ICONS['A'] = <SVG_GRADE_A />;
_GRADE_ICONS['B'] = <SVG_GRADE_B />;
_GRADE_ICONS['C'] = <SVG_GRADE_C />;
_GRADE_ICONS['D'] = <SVG_GRADE_D />;

const _GRADE_ICONS_IMG = [];
_GRADE_ICONS_IMG['XH'] = IMG_SVG_GRADE_XH;
_GRADE_ICONS_IMG['X'] = IMG_SVG_GRADE_X;
_GRADE_ICONS_IMG['SH'] = IMG_SVG_GRADE_SH;
_GRADE_ICONS_IMG['S'] = IMG_SVG_GRADE_S;
_GRADE_ICONS_IMG['A'] = IMG_SVG_GRADE_A;
_GRADE_ICONS_IMG['B'] = IMG_SVG_GRADE_B;
_GRADE_ICONS_IMG['C'] = IMG_SVG_GRADE_C;
_GRADE_ICONS_IMG['D'] = IMG_SVG_GRADE_D;

function getGradeIcon(grade) {
    return _GRADE_ICONS_IMG[grade];
}

function getFlagIcon(country_code){
    //get flag icons (require.context)
    if(country_code === null || country_code === undefined){
        country_code = '__';
    }
    country_code = country_code.toUpperCase();
    const flagIcons = require.context('../Assets/Flags', true);
    const flag = flagIcons(`./${country_code}.png`);
    return flag;
}

export {
    SVG_GRADE_XH,
    SVG_GRADE_X,
    SVG_GRADE_SH,
    SVG_GRADE_S,
    SVG_GRADE_A,
    SVG_GRADE_B,
    SVG_GRADE_C,
    SVG_GRADE_D,
    getModIcon,
    getGradeIcon,
    IMG_SVG_GRADE_XH,
    IMG_SVG_GRADE_X,
    IMG_SVG_GRADE_SH,
    IMG_SVG_GRADE_S,
    IMG_SVG_GRADE_A,
    IMG_SVG_GRADE_B,
    IMG_SVG_GRADE_C,
    IMG_SVG_GRADE_D,
    IMG_TRIANGLES,
    SVG_TRIANGLES,
    PNG_GUEST,
    PNG_LEVEL_BADGE,
    IMG_CLANS_BG,
    getFlagIcon
};