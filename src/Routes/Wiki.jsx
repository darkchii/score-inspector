import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Loader from "../Components/UI/Loader";
import { Container } from "@mui/material";

const WIKI_REPO = "https://raw.githubusercontent.com/darkchii/score-inspector-wiki/main";

function Wiki() {
    const params = useParams();
    const [raw, setRaw] = useState(null);

    useEffect(() => {
        console.log(params);
        //we load .md file from the wiki repo (if it exists, otherwise 404)

        //just raw output for now, we later parse the markdown
        (async () => {
            try {
                const res = await fetch(`${WIKI_REPO}/${params["*"]}.md`);
                if (res.status === 404) {
                    //404 page not found
                    console.error('Page not found');
                } else {
                    const md = await res.text();
                    setRaw(md);
                    console.log(md);
                }
            } catch (err) {
                console.error(err);
                //redirect to index
                setRaw(`# 404\n\nPage not found.`);
            }
        })();
    }, [params]);

    if (!raw) return <Loader />;

    return (
        <Container>
            <div>{raw}</div>
        </Container>
    )
}

export default Wiki;