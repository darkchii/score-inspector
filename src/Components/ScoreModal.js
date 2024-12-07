import { Modal } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import ScoreView from "./ScoreView";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { MODAL_STYLE } from "../Helpers/Misc";
ChartJS.register(ArcElement, ChartTooltip, Legend);

function ScoreModal(props) {
    const [targetProg, setTargetProg] = useState(0);
    const [open, setOpen] = useState(false);
    const handleClose = async () => {
        setTargetProg(0);
        //sleep for 0.3s
        await new Promise(r => setTimeout(r, 300));
        setOpen(false);
    }

    useEffect(() => {
        if (props.data !== undefined && props.data.score !== undefined) {
            (async () => {
                setOpen(props.data.active);
                await new Promise(r => setTimeout(r, 50));
                setTargetProg(1);
            })();
        }
    }, [props.data]);

    return (
        <>
            {props.data !== undefined && props.data.score !== undefined ?
                <Modal
                    open={open}
                    onClose={handleClose}
                    sx={{
                        opacity: 0.5 + 0.5 * targetProg,
                        transform: `translate(0%, ${(1-targetProg) * 100}%)`,
                        transition: 'all 0.3s',
                    }}
                >
                    <ScoreView data={{
                        score: props.data.score, style: {...MODAL_STYLE}, pp_version: 'live'
                    }} />
                </Modal>
                : <></>
            }
        </>
    );
}
export default ScoreModal;