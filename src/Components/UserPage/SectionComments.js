import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import MUIRichTextEditor from 'mui-rte';
import { convertFromRaw, convertToRaw } from 'draft-js';
import { DeleteComment, GetComments, GetFormattedName, SendComment } from "../../Helpers/Account";
import { showNotification } from "../../Helpers/Misc";
import { stateToHTML } from "draft-js-export-html";
import parse from 'html-react-parser';
import moment from "moment";

let htmlOptions = {
    entityStyleFn: (entity) => {
        const entityType = entity.get('type').toLowerCase();
        if (entityType === 'image') {
            const data = entity.getData();
            return {
                element: 'img',
                attributes: {
                    src: data.url,
                },
                style: {
                    // Put styles here...
                    width: data.width ?? '100%',
                    height: data.height ?? 'auto',
                    maxWidth: '1000px',
                    maxHeight: '1000px',
                    borderRadius: '10px',
                },
            };
        }
    },
};

function SectionComments(props) {
    const [isWorking, setIsWorking] = useState(false);
    const [lastMessage, setLastMessage] = useState(null);
    const ref = useRef(null);
    const [comments, setComments] = useState([]);

    const refreshComments = async () => {
        setComments([]);
        const data = await GetComments(props.user.osu.id);
        console.log(data);

        data.forEach(comment => {
            comment.comment = stateToHTML(convertFromRaw(JSON.parse(comment.comment)), htmlOptions);
            comment.date = moment(comment.date_created);
        });
        setComments(data);
    };

    const deleteComment = async (id) => {
        await DeleteComment(id, localStorage.getItem('auth_osu_id'));
        await refreshComments();
    };

    useEffect(() => {
        refreshComments();
    }, []);

    const onComment = () => {
        ref.current?.save();
    }

    const onSave = (data) => {
        if (isWorking || lastMessage?.getTime() + 5000 > new Date().getTime()) {
            showNotification('Error', 'Please wait a few seconds', 'warning');
            return;
        }

        (async () => {
            setIsWorking(true);
            let res;
            try {
                res = await SendComment(localStorage.getItem('auth_osu_id'), props.user.osu.id, -1, data);
                console.log(res);
            } catch (e) {
                console.log(e);
            }
            if (res?.status === 200) {
                showNotification('Success', 'Comment send', 'success');
            } else {
                showNotification('Error', 'Comment could not be send', 'error');
            }
            await refreshComments();
            setLastMessage(new Date());
            setIsWorking(false);
        })();
    }

    return (
        <>
            <Grid>
                <Stack spacing={2}>
                    <Paper elevation={3} sx={{ p: 2, minHeight: '200px', pb: 6 }}>
                        <Box sx={{ minHeight: '120px' }}>
                            <MUIRichTextEditor
                                controls={['bold', 'italic', 'underline', 'strikethrough', 'undo', 'redo', 'link', 'media']}
                                label="Start typing..."
                                maxLength={300}
                                ref={ref}
                                onSave={onSave}
                            />
                        </Box>
                        <Button disabled={isWorking} sx={{ float: 'right', mb: 2 }} variant='contained' onClick={onComment}>Comment</Button>
                    </Paper>
                    <Typography variant='title'>{comments.length} comments</Typography>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        {comments.map((comment, index) => {
                            return (
                                <Paper elevation={4} sx={{ mb: 1, p: 1 }}>
                                    <Typography variant='subtitle1'>{GetFormattedName(comment)} &bull; {comment.date.fromNow()}</Typography>
                                    <Typography variant='body2'>{parse(comment.comment)}</Typography>
                                    {
                                        (comment.commentor_id == localStorage.getItem('auth_osu_id')) && <Button onClick={() => deleteComment(comment.id)} variant='contained'>Delete</Button>
                                    }
                                </Paper>
                            )
                        })
                        }
                    </Paper>
                </Stack>
            </Grid>
        </>
    );
}

export default SectionComments;