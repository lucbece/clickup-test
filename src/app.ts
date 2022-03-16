import { getSpaceId, getFolderId, getListId, getTasks } from "./cu-endpoints";
import { get_holidays, get_requested_holidays } from "./holidays";

const mainFunction = async (userName: string, spaceName: string, folderName: string, 
    listName: string, listName2: string, status_avb_holi: string, status_req_holi: string) => {     

    try {        
        const spaceId = await getSpaceId(spaceName);
        console.log(spaceId)

        const folderId = await getFolderId(spaceId, folderName);
        console.log(folderId)

        /*
        // get available holidays
        const listId = await getListId(folderId, listName);
        console.log(listId)
        const tasks = await getTasks(listId, status_avb_holi, userName);
        //console.log(tasks)        
        const holidays = get_holidays(tasks)
        console.log(holidays)
        */

        // get requested holidays
        const listId2 = await getListId(folderId, listName2);
        console.log(listId2)
        const tasks2 = await getTasks(listId2, status_avb_holi);
        console.log(tasks2)        
        const req_holidays = get_requested_holidays(tasks2)
        console.log(req_holidays)
        console.log(req_holidays.length)
    }
    catch (err) {
        console.log(err);
    }
};
export default mainFunction;
