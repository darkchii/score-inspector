import IMG_SVG_GRADE_XH from "../Assets/Grades/Grade-XH.svg?url";
import IMG_SVG_GRADE_X from "../Assets/Grades/Grade-X.svg?url";
import IMG_SVG_GRADE_SH from "../Assets/Grades/Grade-SH.svg?url";
import IMG_SVG_GRADE_S from "../Assets/Grades/Grade-S.svg?url";
import IMG_SVG_GRADE_A from "../Assets/Grades/Grade-A.svg?url";
import IMG_SVG_GRADE_B from "../Assets/Grades/Grade-B.svg?url";
import IMG_SVG_GRADE_C from "../Assets/Grades/Grade-C.svg?url";
import IMG_SVG_GRADE_D from "../Assets/Grades/Grade-D.svg?url";

import IMG_TRIANGLES from "../Assets/Triangles.svg?url";

import PNG_GUEST from "../Assets/Guest.png";

import PNG_LEVEL_BADGE from "../Assets/levelbadge.png";

import PNG_MOD_EXTENDER from "../Assets/Mods/MOD_EXTENDER.png";
import PNG_TEAMS from "../Assets/Other/teams.png";

//this dictates the custom icon badge
//these mods simply get the acronym overlayed on the badge
function getModIcon(acronym, is_type = false) {
    if(acronym === null || acronym === undefined){
        console.error("getModIcon: acronym is null or undefined");
        return null;
    }
    acronym = acronym.toUpperCase();
    // const modIcons = require.context('../Assets/Mods', true);
    const mod_modules = import.meta.glob('../Assets/Mods/*.png', {
        eager: true
    });

    try{
        let name;
        if(is_type){
            name = `MOD_BG_${acronym}.png`;
        }else{
            name = `${acronym}@2x.png`;
        }
        const path = `../Assets/Mods/${name}`;
        const icon = mod_modules[path].default;
        return icon;
    }catch(err){ 
        console.error(err);
    }
    return null;
}

const _GRADE_ICONS_IMG = [];
_GRADE_ICONS_IMG['XH'] = IMG_SVG_GRADE_XH;
_GRADE_ICONS_IMG['SSH'] = IMG_SVG_GRADE_XH;
_GRADE_ICONS_IMG['X'] = IMG_SVG_GRADE_X;
_GRADE_ICONS_IMG['SS'] = IMG_SVG_GRADE_X;
_GRADE_ICONS_IMG['SH'] = IMG_SVG_GRADE_SH;
_GRADE_ICONS_IMG['S'] = IMG_SVG_GRADE_S;
_GRADE_ICONS_IMG['A'] = IMG_SVG_GRADE_A;
_GRADE_ICONS_IMG['B'] = IMG_SVG_GRADE_B;
_GRADE_ICONS_IMG['C'] = IMG_SVG_GRADE_C;
_GRADE_ICONS_IMG['D'] = IMG_SVG_GRADE_D;

function getGradeIcon(grade) {
    return _GRADE_ICONS_IMG[grade.toUpperCase()];
}

function getFlagIcon(country_code){
    //get flag icons (dynamic import)
    if(country_code === null || country_code === undefined){
        country_code = '__';
    }
    country_code = country_code.toUpperCase();
    try {
        // const flag = import(`../Assets/Flags/${country_code}.png`);
        const path = `../Assets/Flags/${country_code}.png`;
        const flag_modules = import.meta.glob('../Assets/Flags/*.png', {
            eager: true
        });
        return flag_modules[path].default;
    } catch (err) {
        console.error(err);
        return null;
    }
}

export {
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
    PNG_GUEST,
    PNG_LEVEL_BADGE,
    PNG_MOD_EXTENDER,
    PNG_TEAMS,
    getFlagIcon
};