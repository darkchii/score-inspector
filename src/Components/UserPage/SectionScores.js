import FavoriteIcon from '@mui/icons-material/Favorite';
import DoneIcon from '@mui/icons-material/Done';
import { green, pink } from "@mui/material/colors";
import { useState } from 'react';
import { useCallback } from 'react';
import { getModIcon, SVG_GRADE_A, SVG_GRADE_B, SVG_GRADE_C, SVG_GRADE_D, SVG_GRADE_SH, SVG_GRADE_X, SVG_GRADE_XH } from '../../Helpers/Assets';
import moment from 'moment';
import { getModString, mods, mod_strings_long } from '../../Helpers/Osu';
import { Box, Card, CardContent, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import ScoreModal from '../ScoreModal';
import { DataGrid } from '@mui/x-data-grid';
import ScoreFilter from '../ScoreFilter';

function SectionScores(props) {
    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), []);
    const [modalData, setModalData] = useState({ active: false });
    const columns = [
        { field: 'title', flex: 1, headerName: 'Title', minWidth: 280 },
        { field: 'score', headerName: 'Score', minWidth: 170, type: "number", valueFormatter: (params) => { return `${params.value.toLocaleString('en-US')}`; } },
        { field: 'mods', headerName: 'Mods', minWidth: 180, type: "number", renderCell: (params) => { return modFormatter(params) } },
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
    ];

    const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

    const gradeFormatter = (cell) => {
        return (
            <>
                {
                    {
                        'XH': <SVG_GRADE_XH />,
                        'X': <SVG_GRADE_X />,
                        'SH': <SVG_GRADE_SH />,
                        'S': <SVG_GRADE_SH />,
                        'A': <SVG_GRADE_A />,
                        'B': <SVG_GRADE_B />,
                        'C': <SVG_GRADE_C />,
                        'D': <SVG_GRADE_D />,
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
                            <img height="20px" src={getModIcon(mod)} alt={mod} />
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
                title: `${score.beatmap.title} [${score.beatmap.diffname}]`,
                score: score.score,
                mods: score.enabled_mods,
                sr: score.beatmap.modded_sr.star_rating,
                pp: score.pp,
                aimpp: score.pp_original.aim,
                speedpp: score.pp_original.speed,
                accpp: score.pp_original.acc,
                flpp: score.pp_original.flashlight,
                date: `${score.date_played}`,
                grade: `${score.rank}`,
                combo: `${score.combo}`,
                maxcombo: `${score.beatmap.maxcombo}`,
                acc: score.accuracy,
                length: score.beatmap.modded_length,
                bpm: score.beatmap.modded_bpm,
                approved: score.beatmap.approved,
                ppfc: score.pp_fc.total,
                ppss: score.pp_ss.total,
                score_object: score
            });
            index++;
        });

        props.user.scoreRows = rows;
        forceUpdate();
    }

    const handleFilter = (c, filter) => {
        let _cProc = {};
        c.forEach(col => {
            _cProc[col.field] = !col.hide;
        });
        setColumnVisibilityModel(_cProc);

        if (filter !== null) {
            var scores = JSON.parse(JSON.stringify(props.user.scores));
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

            if (filter.starsRange[0] !== null && filter.starsRange[0] >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.star_rating >= filter.starsRange[0]); }
            if (filter.starsRange[1] !== null && filter.starsRange[1] >= 0) { scores = scores.filter(score => score.beatmap.modded_sr.star_rating <= filter.starsRange[1]); }

            if (filter.ppRange[0] !== null && filter.ppRange[0] >= 0) { scores = scores.filter(score => score.pp >= filter.ppRange[0]); }
            if (filter.ppRange[1] !== null && filter.ppRange[1] >= 0) { scores = scores.filter(score => score.pp <= filter.ppRange[1]); }

            if (filter.accRange[0] !== null && filter.accRange[0] >= 0) { scores = scores.filter(score => score.accuracy >= filter.accRange[0]); }
            if (filter.accRange[1] !== null && filter.accRange[1] >= 0) { scores = scores.filter(score => score.accuracy <= filter.accRange[1]); }

            if (filter.comboRange[0] !== null && filter.comboRange[0] >= 0) { scores = scores.filter(score => score.combo >= filter.comboRange[0]); }
            if (filter.comboRange[1] !== null && filter.comboRange[1] >= 0) { scores = scores.filter(score => score.combo <= filter.comboRange[1]); }

            if (filter.flags.checkUniqueSS) { scores = scores.filter(score => score.is_unique_ss); }
            if (filter.flags.checkUniqueFC) { scores = scores.filter(score => score.is_unique_fc); }
            if (filter.flags.checkUniqueDTFC) { scores = scores.filter(score => score.is_unique_dt_fc); }

            scores = scores.filter(score => {
                return moment(score.beatmap.approved_date).isBetween(filter.approvedDateRange[0], filter.approvedDateRange[1], undefined, '[]');
            });

            scores = scores.filter(score => {
                return moment(score.date_played).isBetween(filter.playedDateRange[0], filter.playedDateRange[1], undefined, '[]');
            });

            setScores(scores);
        }
    };

    useEffect(() => {
        if (props.user.scoreRows === undefined) {
            setScores(props.user.scores);
        }
        handleFilter(columns, null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        props.user.scoreRows != null ?
            <>
                <ScoreModal data={modalData} />
                <Box>
                    <Card>
                        <CardContent>
                            <ScoreFilter columns={columns} onApply={handleFilter} />
                            <Typography variant="h6" style={{ marginBottom: 10 }}>Scores: {props.user.scoreRows.length.toLocaleString('en-US')}</Typography>
                            <DataGrid
                                onRowClick={rowHandleClick}
                                autoHeight
                                rows={props.user.scoreRows}
                                columns={columns}
                                columnVisibilityModel={columnVisibilityModel}
                                onColumnVisibilityModelChange={(newModel) =>
                                    setColumnVisibilityModel(newModel)
                                }
                                pagination
                                // components={{ Toolbar: GridToolbar }}
                                density="compact"
                            />
                        </CardContent>
                    </Card>
                </Box>
            </> : <></>
    );
}
export default SectionScores;