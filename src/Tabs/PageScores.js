/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Tooltip, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import React, { useEffect } from "react";
import * as Assets from "../Assets";
import { getModString, mods, mod_strings_long } from "../helper";
import FavoriteIcon from '@mui/icons-material/Favorite';
import DoneIcon from '@mui/icons-material/Done';
import { green, pink } from "@mui/material/colors";
import ScoreModal from "../Components/ScoreModal";
import BeatmapFilter from "../Components/BeatmapFilter";

function PageScores(props) {
    const [, updateState] = React.useState();
    const forceUpdate = React.useCallback(() => updateState({}), []);
    const [modalData, setModalData] = React.useState({ active: false });
    const [scoreCount, setScoreCount] = React.useState(0);
    const [columns, setColumns] = React.useState(
        [
            { field: 'title', flex: 1, headerName: 'Title', minWidth: 280 },
            { field: 'score', headerName: 'Score', minWidth: 170, type: "number", valueFormatter: (params) => { return `${params.value.toLocaleString('en-US')}`; } },
            { field: 'mods', headerName: 'Mods', minWidth: 180, type: "number", renderCell: (params) => { return modFormatter(params) }, onMouseEnter: (params) => { console.log(params) } },
            { field: 'approved', headerName: 'Status', minWidth: 50, type: "number", renderCell: (params) => { return approvedFormatter(params) } },
            { field: 'sr', headerName: 'Stars', minWidth: 100, type: "number", valueFormatter: (params) => { return `${params.value.toFixed(2)}*`; } },
            { field: 'pp', headerName: 'PP', minWidth: 80, type: "number", valueFormatter: (params) => { return `${params.value.toFixed(1)}pp`; } },
            { field: 'aimpp', headerName: 'Aim PP', minWidth: 80, type: "number", valueFormatter: (params) => { return `${params.value.toFixed(1)}pp`; }, hide: true },
            { field: 'speedpp', headerName: 'Speed PP', minWidth: 80, type: "number", valueFormatter: (params) => { return `${params.value.toFixed(1)}pp`; }, hide: true },
            { field: 'accpp', headerName: 'Acc PP', minWidth: 80, type: "number", valueFormatter: (params) => { return `${params.value.toFixed(1)}pp`; }, hide: true },
            { field: 'flpp', headerName: 'FL PP', minWidth: 80, type: "number", valueFormatter: (params) => { return `${params.value.toFixed(1)}pp`; }, hide: true },
            { field: 'date', headerName: 'Date', minWidth: 150, valueFormatter: (params) => { return `${moment(params.value).fromNow()}`; } },
            { field: 'acc', headerName: 'Accuracy', minWidth: 120, type: "number", valueFormatter: (params) => { return `${params.value.toFixed(2)}%`; } },
            { field: 'grade', headerName: 'Grade', minWidth: 80, renderCell: (params) => { return gradeFormatter(params) } },
            { field: 'combo', headerName: 'Play combo', minWidth: 100, type: "number", valueFormatter: (params) => { return `${params.value}x`; } },
            { field: 'maxcombo', headerName: 'Max combo', minWidth: 100, type: "number", valueFormatter: (params) => { return `${params.value}x`; }, hide: true },
            { field: 'length', headerName: 'Length', minWidth: 100, type: "number", valueFormatter: (params) => { return moment.utc(moment.duration(params.value, "seconds").asMilliseconds()).format("mm:ss") } },
            { field: 'bpm', headerName: 'BPM', minWidth: 100, type: "number" },
            { field: 'ppfc', headerName: 'FC PP', minWidth: 100, type: "number", hide: true },
            { field: 'ppss', headerName: 'SS PP', minWidth: 100, type: "number", hide: true },
        ]
    );

    const [columnVisibilityModel, setColumnVisibilityModel] = React.useState({});

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

    const setScores = (scores) => {
        var rows = [];

        var index = 0;
        scores.forEach(score => {
            rows.push({
                id: index,
                title: `${score.title} [${score.diffname}]`,
                score: score.score,
                mods: score.enabled_mods,
                sr: score.star_rating,
                pp: score.pp,
                aimpp: score.pp_cur.aim,
                speedpp: score.pp_cur.speed,
                accpp: score.pp_cur.acc,
                flpp: score.pp_cur.flashlight,
                date: `${score.date_played}`,
                grade: `${score.rank}`,
                combo: `${score.combo}`,
                maxcombo: `${score.maxcombo}`,
                acc: score.accuracy,
                length: (score.mods & mods.DoubleTime ? score.length * 1.5 : (score.mods & mods.HalfTime ? score.length * 0.75 : score.length)),
                bpm: (score.mods & mods.DoubleTime ? score.bpm * 1.5 : (score.mods & mods.HalfTime ? score.bpm * 0.75 : score.bpm)),
                approved: score.approved,
                ppfc: score.pp_fc.total,
                ppss: score.pp_ss.total,
                score_object: score
            });
            index++;
        });

        props.data.scoreRows = rows;
        setScoreCount(scores.length);
        forceUpdate();

        console.log(props.data.scores.filter(x => scores.includes(x)));
    }

    const handleFilter = (c, filter) => {
        // setColumns(c);
        // console.log(c);
        let _cProc = {};
        c.forEach(col => {
            _cProc[col.field] = !col.hide;
        });
        setColumnVisibilityModel(_cProc);

        if (filter !== null) {
            var scores = JSON.parse(JSON.stringify(props.data.scores));

            //mods
            scores = scores.filter(score => {
                if (filter.modsUsage === 'any') {
                    if (score.enabled_mods === 0 && filter.enabledNomod) {
                        return true;
                    }
                    return (filter.enabledMods & score.enabled_mods) !== 0;
                }
                return filter.enabledMods === score.enabled_mods;
            });

            //grades
            scores = scores.filter(score => {
                return filter.enabledGrades.includes(score.rank);
            });

            if (filter.scoreRange[0] !== null && filter.scoreRange[0] >= 0) { scores = scores.filter(score => score.score >= filter.scoreRange[0]); }
            if (filter.scoreRange[1] !== null && filter.scoreRange[1] >= 0) { scores = scores.filter(score => score.score <= filter.scoreRange[1]); }

            if (filter.starsRange[0] !== null && filter.starsRange[0] >= 0) { scores = scores.filter(score => score.star_rating >= filter.starsRange[0]); }
            if (filter.starsRange[1] !== null && filter.starsRange[1] >= 0) { scores = scores.filter(score => score.star_rating <= filter.starsRange[1]); }

            if (filter.ppRange[0] !== null && filter.ppRange[0] >= 0) { scores = scores.filter(score => score.pp >= filter.ppRange[0]); }
            if (filter.ppRange[1] !== null && filter.ppRange[1] >= 0) { scores = scores.filter(score => score.pp <= filter.ppRange[1]); }

            if (filter.accRange[0] !== null && filter.accRange[0] >= 0) { scores = scores.filter(score => score.accuracy >= filter.accRange[0]); }
            if (filter.accRange[1] !== null && filter.accRange[1] >= 0) { scores = scores.filter(score => score.accuracy <= filter.accRange[1]); }

            if (filter.comboRange[0] !== null && filter.comboRange[0] >= 0) { scores = scores.filter(score => score.combo >= filter.comboRange[0]); }
            if (filter.comboRange[1] !== null && filter.comboRange[1] >= 0) { scores = scores.filter(score => score.combo <= filter.comboRange[1]); }

            scores = scores.filter(score => {
                return moment(score.approved_date).isBetween(filter.approvedDateRange[0], filter.approvedDateRange[1], undefined, '[]');
            });

            scores = scores.filter(score => {
                return moment(score.date_played).isBetween(filter.playedDateRange[0], filter.playedDateRange[1], undefined, '[]');
            });

            setScores(scores);
        }
    };

    useEffect(() => {
        if (props.data.scoreTable === undefined) {
            setScores(props.data.scores);
        }

        handleFilter(columns, null);
    }, []);

    return (
        props.data.scoreRows != null ?
            <>
                <ScoreModal data={modalData} />
                <Box sx={{ height: 'auto', width: '100%' }}>
                    <BeatmapFilter columns={columns} onApply={handleFilter} />
                    <Typography variant="h6" style={{ marginBottom: 10 }}>Scores: {scoreCount}</Typography>
                    <DataGrid
                        onRowClick={rowHandleClick}
                        autoHeight
                        rows={props.data.scoreRows}
                        columns={columns}
                        columnVisibilityModel={columnVisibilityModel}
                        onColumnVisibilityModelChange={(newModel) =>
                            setColumnVisibilityModel(newModel)
                        }
                        pagination
                        // components={{ Toolbar: GridToolbar }}
                        density="compact"
                    />
                </Box>
            </> : <></>
    );
}
export default PageScores;