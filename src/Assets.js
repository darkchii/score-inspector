import { ReactComponent as SVG_GRADE_XH } from "./Assets/Grade-XH.svg";
import { ReactComponent as SVG_GRADE_X } from "./Assets/Grade-X.svg";
import { ReactComponent as SVG_GRADE_SH } from "./Assets/Grade-SH.svg";
import { ReactComponent as SVG_GRADE_S } from "./Assets/Grade-S.svg";
import { ReactComponent as SVG_GRADE_A } from "./Assets/Grade-A.svg";
import { ReactComponent as SVG_GRADE_B } from "./Assets/Grade-B.svg";
import { ReactComponent as SVG_GRADE_C } from "./Assets/Grade-C.svg";
import { ReactComponent as SVG_GRADE_D } from "./Assets/Grade-D.svg";

import PNG_MOD_HT from "./Assets/MOD_HT.png";
import PNG_MOD_NC from "./Assets/MOD_NC.png";
import PNG_MOD_NF from "./Assets/MOD_NF.png";
import PNG_MOD_PF from "./Assets/MOD_PF.png";
import PNG_MOD_RX from "./Assets/MOD_RX.png";
import PNG_MOD_SD from "./Assets/MOD_SD.png";
import PNG_MOD_SO from "./Assets/MOD_SO.png";
import PNG_MOD_TP from "./Assets/MOD_TP.png";
import PNG_MOD_AP from "./Assets/MOD_AP.png";
import PNG_MOD_AT from "./Assets/MOD_AT.png";
import PNG_MOD_CN from "./Assets/MOD_CN.png";
import PNG_MOD_DT from "./Assets/MOD_DT.png";
import PNG_MOD_EZ from "./Assets/MOD_EZ.png";
import PNG_MOD_FL from "./Assets/MOD_FL.png";
import PNG_MOD_HD from "./Assets/MOD_HD.png";
import PNG_MOD_HR from "./Assets/MOD_HR.png";
import PNG_MOD_TD from "./Assets/MOD_TD.png";
import PNG_MOD_NM from "./Assets/MOD_NM.png";

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
        case "None": return PNG_MOD_NM;
    }
}

function getGradeIcon(grade) {
    switch (grade) {
        case 'XH': return <SVG_GRADE_XH />
        case 'X': return <SVG_GRADE_X />
        case 'SH': return <SVG_GRADE_SH />
        case 'S': return <SVG_GRADE_S />
        case 'A': return <SVG_GRADE_A />
        case 'B': return <SVG_GRADE_B />
        case 'C': return <SVG_GRADE_C />
        case 'D': return <SVG_GRADE_D />
        default: return null
    }
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
    getModIcon,
    getGradeIcon
};