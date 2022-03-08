import { getSpaceId, getFolderId, getListId, getTasks } from "./cu-endpoints";

const mainFunction = async () => {
try {
    const spaceId = await getSpaceId("NaNLABS's Space");

    const folderId = await getFolderId(spaceId, "Slack App");

    const listId = await getListId(folderId, "Development");

    const tasks = await getTasks(listId);
}
catch (err) {
    console.log(err);
}
};
export default mainFunction;
