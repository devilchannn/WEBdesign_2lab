import {Widget} from '../Widget.js';
import {getRandomArt} from '../services/artApi.js';
import {renderArtwork} from '../services/artworkView.js';
export class ArtWidget extends Widget{
 init(){this.load();}
 async load(){const signal=this.resetController();this.state('loading','Looking through the Art Institute collection...');try{const art=await getRandomArt(signal);if(signal.aborted||this.destroyed)return;renderArtwork(this,art,()=>this.load());}catch(error){if(signal.aborted||this.destroyed)return;this.state('error',`Could not load art. ${error.message}`,()=>this.load());}}
}
