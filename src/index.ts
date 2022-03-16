import './utils/env'
import mainFunction from "./app";
import { gitFinder } from './GitAccounts';

// user who request your holidays info
//const userName: string = 'carolina.sabatini@nan-labs.com';
// this is the task name, but must be use email
const userName: string = "Luli - Vacaciones";

// path to access data
let spaceName: string = "NaNLABS's Space"
let folderName: string = "Licencias "
let listName: string = "Días disponibles"
let listName2: string = "Solicitudes"
let status_avb_holy = "to do"
let status_req_holy = "complete"

const App = mainFunction(userName, spaceName, folderName, listName, listName2,
    status_avb_holy, status_req_holy);

//const accounts = gitFinder(name);
