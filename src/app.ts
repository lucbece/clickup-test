import { getSpaceId, getFolderId, getListId, getTasks } from "./cu-endpoints";

const mainFunction = async () => {
try {
    const spaceId = await getSpaceId("NaNLABS's Space");
    console.log(spaceId);

    const folderId = await getFolderId(spaceId, "Slack App");
    console.log(folderId);

    const listId = await getListId(folderId, "Development");
    console.log(listId);

    const tasks = await getTasks(listId);
    console.log(tasks);
}
catch (err) {
    console.log(err);
}
};
export default mainFunction;
