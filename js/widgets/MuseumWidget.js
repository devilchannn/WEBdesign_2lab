import {Widget} from '../Widget.js';
import {searchMet} from '../services/metApi.js';
import {renderArtwork} from '../services/artworkView.js';
export class MuseumWidget extends Widget{
 init(){this.query='flower';this.renderSearch();this.load();}
 renderSearch(){this.form=document.createElement('form');this.form.className='search-form';this.input=document.createElement('input');this.input.type='search';this.input.className='text-input';this.input.maxLength=80;this.input.value=this.query;this.input.placeholder='Search the collection...';this.input.setAttribute('aria-label','Поиск по музею');const submit=document.createElement('button');submit.type='submit';submit.className='action-btn primary';submit.textContent='SEARCH ↗';this.form.append(this.input,submit);this.form.addEventListener('submit',e=>{e.preventDefault();const text=this.input.value.trim();if(!text)return;this.query=text;this.load();});this.result=document.createElement('div');this.content.append(this.form,this.result);}
 async load(){const signal=this.resetController();this.showState('loading','Searching The Metropolitan Museum...');try{const art=await searchMet(this.query,signal);if(signal.aborted||this.destroyed)return;renderArtwork(this,art,()=>this.load(),this.result);}catch(error){if(signal.aborted||this.destroyed)return;this.showState('error',`Search failed. ${error.message}`,()=>this.load());}}
 showState(type,message,retry){const target=this.result;this.content=this.result;this.state(type,message,retry);this.content=this.element.querySelector('.widget-content');}
}
