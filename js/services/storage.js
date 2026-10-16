// localStorage: состояние панели, задачи и избранные объекты. Без секретов.
const KEY = 'objects-archive-v1';
export const DEFAULT_STATE = {widgets:[{id:'notes-1',type:'notes',collapsed:false},{id:'art-1',type:'art',collapsed:false},{id:'museum-1',type:'museum',collapsed:false},{id:'saved-1',type:'saved',collapsed:false}],tasks:[],saved:[]};
export function loadState(){try{const raw=localStorage.getItem(KEY);if(!raw)return structuredClone(DEFAULT_STATE);const data=JSON.parse(raw);return {widgets:Array.isArray(data.widgets)?data.widgets:structuredClone(DEFAULT_STATE.widgets),tasks:Array.isArray(data.tasks)?data.tasks:[],saved:Array.isArray(data.saved)?data.saved:[]};}catch{return structuredClone(DEFAULT_STATE);}}
export function saveState(state){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}}
