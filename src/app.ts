import { getSpaceId, getFolderId, getListId, getTasks } from "./cu-endpoints";
import { get_holidays } from "./holidays";

const mainFunction = async (userName: string, spaceName: string, folderName: string, listName: string) => {
try {
    const spaceId = await getSpaceId(spaceName);
    console.log(spaceId)

    const folderId = await getFolderId(spaceId, folderName);
    console.log(folderId)

    const listId = await getListId(folderId, listName);
    console.log(listId)

    const tasks = await getTasks(listId, userName);
    console.log(tasks)

    const holidays = get_holidays(tasks)
    console.log(holidays)
}
catch (err) {
    console.log(err);
}
};
export default mainFunction;
