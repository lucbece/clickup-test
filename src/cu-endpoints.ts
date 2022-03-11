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

export const getTasks = async (listId: string, taskName?: string) => {
  const response = await axios.get(`${baseUrl}list/${listId}/task?statuses%5B%5D=to do&archived=false`);
  let list: any;
  
  if (taskName !== undefined) {
    list = response.data.tasks?.filter((list2:any) => list2.name === taskName);
  } else {
    list = response.data?.tasks;
  }  
  return list;
}
