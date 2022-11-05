import { Modal } from "@mui/material";
import React, { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js';
import ScoreView from "./ScoreView";
ChartJS.register(ArcElement, ChartTooltip, Legend);

function ScoreModal(props) {
    const [open, setOpen] = React.useState(false);
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
                        score: props.data.score, style: {
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            minWidth: 800,
                            boxShadow: 24,
                            borderRadius: 3
                        }
                    }} />
                </Modal>
                : <></>
            }
        </>
    );
}
export default ScoreModal;