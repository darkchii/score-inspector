import { Modal } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import ScoreView from "./ScoreView";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { MODAL_STYLE } from "../Helpers/Misc";
ChartJS.register(ArcElement, ChartTooltip, Legend);

function ScoreModal(props) {
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        if (props.data !== undefined && props.data.score !== undefined) {
            setOpen(props.data.active);
        }
    }, [props.data]);

    return (
        <>
            {props.data !== undefined && props.data.score !== undefined ?
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
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