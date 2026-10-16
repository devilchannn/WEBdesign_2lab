import {loadState,saveState} from './services/storage.js';
import {NotesWidget} from './widgets/NotesWidget.js';
import {ArtWidget} from './widgets/ArtWidget.js';
import {MuseumWidget} from './widgets/MuseumWidget.js';
import {SavedWidget} from './widgets/SavedWidget.js';
const CLASSES={notes:NotesWidget,art:ArtWidget,museum:MuseumWidget,saved:SavedWidget};
export class Dashboard{
 constructor(grid){this.grid=grid;this.state=loadState();this.instances=new Map();this.render();this.setupAdd();}
 persist(){if(!saveState(this.state))this.toast('Could not save changes in this browser');}
 render(){this.instances.forEach(w=>w.destroy());this.instances.clear();this.grid.replaceChildren();for(const model of this.state.widgets){const WidgetClass=CLASSES[model.type];if(!WidgetClass)continue;try{const widget=new WidgetClass(this,model);this.instances.set(model.id,widget);this.grid.append(widget.create());}catch(error){console.error('Widget failed:',error);const alert=document.createElement('div');alert.className='state-panel';alert.textContent=`Widget ${model.type} failed to initialize.`;this.grid.append(alert);}}this.updateEmpty();}
 updateEmpty(){document.getElementById('empty-workspace').hidden=this.state.widgets.length>0;}
 add(type){if(!CLASSES[type])return;const model={id:`${type}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,type,collapsed:false};this.state.widgets.push(model);this.persist();const widget=new CLASSES[type](this,model);try{this.instances.set(model.id,widget);this.grid.append(widget.create());this.updateEmpty();widget.element.scrollIntoView({behavior:'smooth',block:'nearest'});}catch(error){console.error(error);this.state.widgets=this.state.widgets.filter(m=>m.id!==model.id);this.persist();this.toast('Could not add this widget');}}
 toggle(id){const w=this.instances.get(id);if(!w)return;w.model.collapsed=!w.model.collapsed;w.updateCollapse();this.persist();}
 remove(id){const w=this.instances.get(id);if(w){w.destroy();this.instances.delete(id);}this.state.widgets=this.state.widgets.filter(m=>m.id!==id);this.persist();this.updateEmpty();this.toast('Widget removed — add it again anytime');}
 refreshType(type){this.instances.forEach(widget=>{if(widget.model.type===type&&typeof widget.render==='function')widget.render();});}
 setupAdd(){const open=document.getElementById('add-widget-button');const menu=document.getElementById('add-menu');open.addEventListener('click',()=>{menu.hidden=!menu.hidden;open.setAttribute('aria-expanded',String(!menu.hidden));});menu.querySelectorAll('[data-add]').forEach(button=>button.addEventListener('click',()=>{this.add(button.dataset.add);menu.hidden=true;open.setAttribute('aria-expanded','false');}));document.addEventListener('click',e=>{if(!e.target.closest('.add-wrap')){menu.hidden=true;open.setAttribute('aria-expanded','false');}});document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.hidden=true;open.setAttribute('aria-expanded','false');}});}
 toast(message){const toast=document.getElementById('toast');toast.textContent=message;toast.classList.add('visible');clearTimeout(this.toastTimer);this.toastTimer=setTimeout(()=>toast.classList.remove('visible'),2700);}
}
