import { Box, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import moment from "moment";
import React, { useEffect } from "react";
import * as Assets from "../Assets";
import { getModString, mods, mod_strings_long } from "../helper";
import FavoriteIcon from '@mui/icons-material/Favorite';
import DoneIcon from '@mui/icons-material/Done';
import { green, pink } from "@mui/material/colors";
import ScoreModal from "../Components/ScoreModal";

function PageScores(props) {
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [modalData, setModalData] = React.useState({ active: false });

    const gradeFormatter = (cell) => {
        return (
            <>
                {
                    {
                        'XH': <Assets.SVG_GRADE_XH />,
                        'X': <Assets.SVG_GRADE_X />,
                        'SH': <Assets.SVG_GRADE_SH />,
                        'S': <Assets.SVG_GRADE_S />,
                        'A': <Assets.SVG_GRADE_A />,
                        'B': <Assets.SVG_GRADE_B />,
                        'C': <Assets.SVG_GRADE_C />,
                        'D': <Assets.SVG_GRADE_D />,
                    }[cell.value]
                }
            </>
        );
    }

    const modFormatter = (cell) => {
        return (
            <>
                {
                    getModString(cell.value).map(mod => (
                        <Tooltip title={mod_strings_long[mods[mod]]}>
                            <img height="20px" src={Assets.getModIcon(mod)} alt={mod} />
                        </Tooltip>
                    ))
                }
            </>
        );
    }

    const approvedFormatter = (cell) => {
        var name = "";
        switch (cell.value) {
            default:
            case 1:
            case 2:
                name = "Ranked";
                break;
            case 4:
                name = "Loved";
                break
        }
        return (
            <Tooltip title={name}>
                {
                    {
                        1: <DoneIcon sx={{ color: green[500] }} />,
                        2: <DoneIcon sx={{ color: green[500] }} />,
                        4: <FavoriteIcon sx={{ color: pink[500] }} />
                    }[cell.value]
                }
            </Tooltip>
        );
    }

    const rowHandleClick = (params, event, details) => {
        //console.log(params.row.beatmap_id);
        const score = params.row.score_object;
        setModalData({
            active: true,
            score: score
        })
    }

    var columns = [
        { field: 'title', flex: 1, headerName: 'Title', minWidth: 280 },
        { field: 'score', headerName: 'Score', minWidth: 170, type: "number", valueFormatter: (params) => { return `${params.value.toLocaleString('en-US')}`; } },
        { field: 'mods', headerName: 'Mods', minWidth: 180, type: "number", renderCell: (params) => { return modFormatter(params) }, onMouseEnter: (params) => { console.log(params) } },
        { field: 'approved', headerName: 'Status', minWidth: 50, type: "number", renderCell: (params) => { return approvedFormatter(params) } },
        { field: 'sr', headerName: 'Stars', minWidth: 100, type: "number", valueFormatter: (params) => { return `${params.value.toFixed(2)}*`; } },
        { field: 'pp', headerName: 'PP', minWidth: 80, type: "number", valueFormatter: (params) => { return `${params.value.toFixed(1)}pp`; } },
        { field: 'ppfc', headerName: 'PPfc', minWidth: 80, type: "number", valueFormatter: (params) => { return `${params.value.toFixed(1)}pp`; } },
        { field: 'date', headerName: 'Date', minWidth: 150, valueFormatter: (params) => { return `${moment(params.value).fromNow()}`; } },
        { field: 'acc', headerName: 'Accuracy', minWidth: 120, type: "number", valueFormatter: (params) => { return `${params.value.toFixed(2)}%`; } },
        { field: 'grade', headerName: 'Grade', minWidth: 80, renderCell: (params) => { return gradeFormatter(params) } },
        { field: 'combo', headerName: 'Play combo', minWidth: 100, type: "number", valueFormatter: (params) => { return `${params.value}x`; } },
        { field: 'maxcombo', headerName: 'Max combo', minWidth: 100, type: "number", valueFormatter: (params) => { return `${params.value}x`; } },
        { field: 'length', headerName: 'Length', minWidth: 100, type: "number", valueFormatter: (params) => { return moment.utc(moment.duration(params.value, "seconds").asMilliseconds()).format("mm:ss") } },
        { field: 'bpm', headerName: 'BPM', minWidth: 100, type: "number" },
    ];
    useEffect(() => {
        if (props.data.scoreTable === undefined) {
            var rows = [];

            var index = 0;
            props.data.scores.forEach(score => {
                rows.push({
                    id: index,
                    title: `${score.title} [${score.diffname}]`,
                    score: score.score,
                    mods: score.enabled_mods,
                    sr: score.star_rating,
                    pp: score.pp,
                    ppfc: score.pp_fc.total,
                    date: `${score.date_played}`,
                    grade: `${score.rank}`,
                    combo: `${score.combo}`,
                    maxcombo: `${score.maxcombo}`,
                    acc: score.accuracy,
                    length: (score.mods & mods.DoubleTime ? score.length * 1.5 : (score.mods & mods.HalfTime ? score.length * 0.75 : score.length)),
                    bpm: (score.mods & mods.DoubleTime ? score.bpm * 1.5 : (score.mods & mods.HalfTime ? score.bpm * 0.75 : score.bpm)),
                    approved: score.approved,
                    score_object: score
                });
                index++;
            });

            props.data.scoreRows = rows;
            forceUpdate();
        }
    }, []);
    return (
        props.data.scoreRows != null ?
            <>
                <ScoreModal data={modalData} />
                <Box sx={{ height: 'auto', width: '100%' }}>
                    <DataGrid
                        onRowClick={rowHandleClick}
                        autoHeight
                        rows={props.data.scoreRows}
                        columns={columns}
                        pagination
                        components={{ Toolbar: GridToolbar }}
                        density="compact"
                    />
                </Box>
            </> : <></>
    );
}
export default PageScores;