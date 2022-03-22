import { getSpaceId, getFolderId, getListId, getTasks_requested, getTasks_assigned } from "./cu-endpoints";
import { get_holidays, get_requested_holidays } from "./holidays";
import { TotalHolidays } from "./holidays";

const mainFunction = async (userName: string, spaceName: string, folderName: string, 
    listName: string, listName2: string, status_avb_holi: string, status_req_holi: string) => {     

    try {        
        const spaceId = await getSpaceId(spaceName);
        console.log(spaceId)

        const folderId = await getFolderId(spaceId, folderName);
        console.log(folderId)

        
        // get assigned holidays
        const listId = await getListId(folderId, listName);
        console.log(listId)
        const tasks = await getTasks_assigned(listId, status_avb_holi);              
        const holidays = get_holidays(tasks);
        console.log(holidays);        
        
        // get requested holidays
        const listId2 = await getListId(folderId, listName2);
        console.log(listId2);
        const tasks2 = await getTasks_requested(listId2, status_avb_holi);           
        const req_holidays = get_requested_holidays(tasks2);
        console.log(req_holidays);
        console.log(req_holidays.length);  
        
        // test a new complex object TotalHolidays
        let oTotalHolidays = new TotalHolidays('455666', 14, 20);        
        oTotalHolidays.addRqHoliday(1646179200, 1646352000, 0, "http:google.com/11", "2020");
        oTotalHolidays.addRqHoliday(1646179200, 1646352000, 0, "http:google.com/22", "2021");
        console.log(oTotalHolidays.serialize())
    }
    catch (err) {
        console.log(err);
    }
};
export default mainFunction;
