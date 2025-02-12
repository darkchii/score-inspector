import { useNavigate } from "react-router";
import { showNotification } from "../../Helpers/Misc";
import { GetLoginToken } from "../../Helpers/Account";
import { UpdateClan } from "../../Helpers/Clan";
import ClanFormFields from "./ClanFormFields";

function ClanEdit(props) {
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        if (!data.clanName || !data.clanTag || !data.clanDescription || !data.clanColor) {
            showNotification('Error', 'Please fill in all fields.', 'error');
            return;
        }

        const _data = {
            id: props.clan.clan.id,
            name: data.clanName,
            tag: data.clanTag,
            description: data.clanDescription,
            color: data.clanColor,
            logo_image_url: data.clanLogoUrl,
            header_image_url: data.clanHeaderUrl,
            background_image_url: data.clanBackgroundUrl,
            disable_requests: data.clanDisableRequests,
            disable_logs: data.clanDisableLogs,
            default_sort: data.clanDefaultSort,
            discord_invite: data.clanDiscordInvite,
            user: {
                id: props.user.osu_id,
                token: await GetLoginToken(),
            }
        }

        try {
            const response = await UpdateClan(_data);
            if (response.error) {
                showNotification('Error', response.error, 'error');
            } else {
                showNotification('Success', 'Clan updated successfully.', 'success');
                navigate(0);
            }
        } catch (err) {
            console.error(err);
            showNotification('Error', 'An error occurred while updating the clan.', 'error');
        }
    }

    return (
        <ClanFormFields user={props.user} clan={props.clan} onSubmit={onSubmit} />
    );
}

export default ClanEdit;