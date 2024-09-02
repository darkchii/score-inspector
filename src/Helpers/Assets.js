import { ReactComponent as SVG_GRADE_XH } from "../Assets/Grade-XH.svg";
import { ReactComponent as SVG_GRADE_X } from "../Assets/Grade-X.svg";
import { ReactComponent as SVG_GRADE_SH } from "../Assets/Grade-SH.svg";
import { ReactComponent as SVG_GRADE_S } from "../Assets/Grade-S.svg";
import { ReactComponent as SVG_GRADE_A } from "../Assets/Grade-A.svg";
import { ReactComponent as SVG_GRADE_B } from "../Assets/Grade-B.svg";
import { ReactComponent as SVG_GRADE_C } from "../Assets/Grade-C.svg";
import { ReactComponent as SVG_GRADE_D } from "../Assets/Grade-D.svg";
import { ReactComponent as SVG_TRIANGLES } from "../Assets/Triangles.svg";

import IMG_SVG_GRADE_XH from "../Assets/Grade-XH.svg";
import IMG_SVG_GRADE_X from "../Assets/Grade-X.svg";
import IMG_SVG_GRADE_SH from "../Assets/Grade-SH.svg";
import IMG_SVG_GRADE_S from "../Assets/Grade-S.svg";
import IMG_SVG_GRADE_A from "../Assets/Grade-A.svg";
import IMG_SVG_GRADE_B from "../Assets/Grade-B.svg";
import IMG_SVG_GRADE_C from "../Assets/Grade-C.svg";
import IMG_SVG_GRADE_D from "../Assets/Grade-D.svg";

import IMG_CLANS_BG from "../Assets/Other/clans.jpg";

import IMG_TRIANGLES from "../Assets/Triangles.svg";

import PNG_MOD_HT from "../Assets/MOD_HT.png";
import PNG_MOD_NC from "../Assets/MOD_NC.png";
import PNG_MOD_NF from "../Assets/MOD_NF.png";
import PNG_MOD_PF from "../Assets/MOD_PF.png";
import PNG_MOD_RX from "../Assets/MOD_RX.png";
import PNG_MOD_SD from "../Assets/MOD_SD.png";
import PNG_MOD_SO from "../Assets/MOD_SO.png";
import PNG_MOD_TP from "../Assets/MOD_TP.png";
import PNG_MOD_AP from "../Assets/MOD_AP.png";
import PNG_MOD_AT from "../Assets/MOD_AT.png";
import PNG_MOD_CN from "../Assets/MOD_CN.png";
import PNG_MOD_DT from "../Assets/MOD_DT.png";
import PNG_MOD_EZ from "../Assets/MOD_EZ.png";
import PNG_MOD_FL from "../Assets/MOD_FL.png";
import PNG_MOD_HD from "../Assets/MOD_HD.png";
import PNG_MOD_HR from "../Assets/MOD_HR.png";
import PNG_MOD_TD from "../Assets/MOD_TD.png";
import PNG_MOD_NM from "../Assets/MOD_NM.png";
import PNG_MOD_CL from "../Assets/MOD_CL.png";

import PNG_GUEST from "../Assets/Guest.png";

import PNG_LEVEL_BADGE from "../Assets/levelbadge.png";

function getModIcon(modString) {
    switch (modString) {
        default: return null;
        case "HT": return PNG_MOD_HT;
        case "NC": return PNG_MOD_NC;
        case "NF": return PNG_MOD_NF;
        case "PF": return PNG_MOD_PF;
        case "RX": return PNG_MOD_RX;
        case "SD": return PNG_MOD_SD;
        case "SO": return PNG_MOD_SO;
        case "TP": return PNG_MOD_TP;
        case "AP": return PNG_MOD_AP;
        case "AT": return PNG_MOD_AT;
        case "CN": return PNG_MOD_CN;
        case "DT": return PNG_MOD_DT;
        case "EZ": return PNG_MOD_EZ;
        case "FL": return PNG_MOD_FL;
        case "HD": return PNG_MOD_HD;
        case "HR": return PNG_MOD_HR;
        case "TD": return PNG_MOD_TD;
        case "CL": return PNG_MOD_CL;
        case "None": return PNG_MOD_NM;
    }
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
    // switch (grade) {
    //     case 'XH': return _GRADE_ICON_XH
    //     case 'X': return _GRADE_ICON_X
    //     case 'SH': return _GRADE_ICON_SH
    //     case 'S': return _GRADE_ICON_S
    //     case 'A': return _GRADE_ICON_A
    //     case 'B': return _GRADE_ICON_B
    //     case 'C': return _GRADE_ICON_C
    //     case 'D': return _GRADE_ICON_D
    //     default: return null
    // }
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
    PNG_MOD_HT,
    PNG_MOD_NC,
    PNG_MOD_NF,
    PNG_MOD_PF,
    PNG_MOD_RX,
    PNG_MOD_SD,
    PNG_MOD_SO,
    PNG_MOD_TP,
    PNG_MOD_AP,
    PNG_MOD_AT,
    PNG_MOD_CN,
    PNG_MOD_DT,
    PNG_MOD_EZ,
    PNG_MOD_FL,
    PNG_MOD_HD,
    PNG_MOD_HR,
    PNG_MOD_TD,
    PNG_MOD_NM,
    PNG_MOD_CL,
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
};