

var AssetLoader = class{

    constructor(){
        this.assets = new Map();
        this.loaders = {};
        this.loaders.THREE_TextureLoader = new THREE.TextureLoader();
    }
}


export default AssetLoader;