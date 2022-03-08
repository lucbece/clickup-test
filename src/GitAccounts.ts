import { getListId, getSpaceId, getTasks, getFolderId } from "./cu-endpoints";

const listName: string = process.env.GITHUB_LIST || 'Account Information'
const gitHubListId: string = process.env.GITHUB_LIST_ID || ''
console.log(gitHubListId)

export const gitFinder = async ( name: string ) => {
    try {
        const accounts = await getTasks(gitHubListId);
        const account = accounts.find((account:any) => account.name === name)
        
        const gitInfo: any[] = account.custom_fields?.find((field:any) => field.name === 'GITHHUB').value
        console.log(gitInfo)
    }
    catch (err) {
        console.log(err);
    }
}
