import './utils/env'
import mainFunction from "./app";
import { gitFinder } from './GitAccounts';

const name: string = 'Lucas Becerra'
const App = mainFunction();

const accounts = gitFinder(name);
