import axios from 'axios';

const authToken: string = process.env.PERSONAL_ACCESS_TOKEN || '';
axios.defaults.headers.common['Authorization'] =  authToken;
axios.defaults.headers.common['Content-Type'] = 'application/json';
const baseUrl = 'https://api.clickup.com/api/v2/'


export const getSpaceId = async (spaceName: string) => {

  const response = await axios.get(`${baseUrl}team/459857/space?archived=false`);
  let space = response.data.spaces?.find((space:any) => space.name === spaceName)
  return space.id
}

export const getFolderId = async (spaceId: string, folderName: string) => {
  const response = await axios.get(`${baseUrl}space/${spaceId}/folder?archived=false`);
  let folder = response.data.folders?.find((folder:any) => folder.name === folderName)
  return folder.id
}

export const getListId = async (folderId: string, listName: string) => {
  const response = await axios.get(`${baseUrl}folder/${folderId}/list?archived=false`);
  let list = response.data.lists?.find((list:any) => list.name === listName)
  return list.id
}

export const getTasks_assigned = async (listId: string, status: string, taskName?: string) => {
  // get only for a user: Quien, from custom_fields
     
  const response = await axios.get(`${baseUrl}list/${listId}/task?statuses%5B%5D=to do`);
  let list: any;
  
  if (taskName !== undefined) {
    list = response.data.tasks?.filter((list2:any) => list2.name === taskName);
  } else {
    list = response.data?.tasks;
  }
  
  return list;
}

export const getTasks_requested = async (listId: string, status: string, taskName?: string) => {
  // get only for a user: Quien, from custom_fields
  // email : juan.antonellini@nan-labs.com
  let user_who = `,{"field_id":"4d5b2614-3513-47e6-a697-5013093eb4c0","operator":"ANY","value":["468314"]}`

  // get only Vacaciones type (value 0) from config_fields
  let only_vacaciones = `&custom_fields=[{"field_id":"b048a332-8d5f-44c2-bbd4-7c8b1bfe7a13", "operator":"=", "value":0}`+user_who+`]`;
  
  const response = await axios.get(`${baseUrl}list/${listId}/task?statuses%5B%5D=complete&statuses%5B%5D=in progress`+only_vacaciones);  
  let list: any;
  
  if (taskName !== undefined) {
    list = response.data.tasks?.filter((list2:any) => list2.name === taskName);
  } else {
    list = response.data?.tasks;
  }
  
  return list;
}

export const getTasks = async (listId: string) => {
  const response = await axios.get(`${baseUrl}list/${listId}/task?archived=false`);
  return response.data?.tasks;
}
