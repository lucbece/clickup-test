import './utils/env'
import mainFunction from "./app";
import { gitFinder } from './GitAccounts';

// user who request your holidays info
//const userName: string = 'carolina.sabatini@nan-labs.com';
// this is the task name, but must be use email
const userName: string = "Emilio Crudele";

// path to access data
let spaceName: string = "NaNLABS's Space"
let folderName: string = "Licencias "
let listName: string = "Días disponibles"

const App = mainFunction(userName, spaceName, folderName, listName);

//const accounts = gitFinder(name);
