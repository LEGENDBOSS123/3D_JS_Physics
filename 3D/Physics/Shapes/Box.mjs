
import Composite from "./Composite.mjs";
import Matrix3 from "../Math3D/Matrix3.mjs";
import Vector3 from "../Math3D/Vector3.mjs";

var Box = class extends Composite {
    constructor(options) {
        super(options);
        this.shape = this.constructor.SHAPES.BOX;
        this.width = options?.width ?? 1;
        this.height = options?.height ?? 1;
        this.depth = options?.depth ?? 1;
        this.setLocalFlag(this.constructor.FLAGS.OCCUPIES_SPACE, true);
        this.calculateLocalHitbox();
        this.calculateGlobalHitbox();
    }

    calculateLocalMomentOfInertia() {
        this.local.body.momentOfInertia = Matrix3.zero();
        var I = (1/12) * this.local.body.mass * (this.height * this.height + this.depth * this.depth);
        this.local.body.momentOfInertia.set(0, 0, I);
        this.local.body.momentOfInertia.set(1, 1, I);
        this.local.body.momentOfInertia.set(2, 2, I);
        return this.local.body.momentOfInertia;
    }

    calculateLocalHitbox() {

        this.local.hitbox.min = new Vector3(-this.width / 2, -this.height / 2, -this.depth / 2);
        this.local.hitbox.max = new Vector3(this.width / 2, this.height / 2, this.depth / 2);

        return this.local.hitbox;
    }

    calculateGlobalHitbox() {
        var localHitbox = this.local.hitbox;

        var updateForVertex = function (v) {
            this.global.body.rotation.multiplyVector3InPlace(v).addInPlace(this.global.body.position);
            this.global.hitbox.expandToFitPoint(v);
        }.bind(this);

        this.global.hitbox.min = new Vector3(Infinity, Infinity, Infinity);
        this.global.hitbox.max = new Vector3(-Infinity, -Infinity, -Infinity);

        updateForVertex(localHitbox.min.copy());
        updateForVertex(localHitbox.max.copy());
        var vector = new Vector3();
        vector.x = localHitbox.min.x;
        vector.y = localHitbox.min.y;
        vector.z = localHitbox.max.z;
        updateForVertex(vector);
        vector.x = localHitbox.min.x;
        vector.y = localHitbox.max.y;
        vector.z = localHitbox.min.z;
        updateForVertex(vector);
        vector.x = localHitbox.min.x;
        vector.y = localHitbox.max.y;
        vector.z = localHitbox.max.z;
        updateForVertex(vector);
        vector.x = localHitbox.max.x;
        vector.y = localHitbox.min.y;
        vector.z = localHitbox.min.z;
        updateForVertex(vector);
        vector.x = localHitbox.max.x;
        vector.y = localHitbox.min.y;
        vector.z = localHitbox.max.z;
        updateForVertex(vector);
        vector.x = localHitbox.max.x;
        vector.y = localHitbox.max.y;
        vector.z = localHitbox.min.z;
        updateForVertex(vector);
        return this.global.hitbox;
    }

    getVerticies(){
        var verticies = [];
        for(var x = -1; x <= 1; x += 2){
            for(var y = -1; y <= 1; y += 2){
                for(var z = -1; z <= 1; z += 2){
                    verticies.push(this.translateLocalToWorld(new Vector3(x * this.width / 2, y * this.height / 2, z * this.depth / 2)));
                }
            }
        }
        return verticies;
    }

    getLocalVerticies(){
        var verticies = [];
        for(var x = -1; x <= 1; x += 2){
            for(var y = -1; y <= 1; y += 2){
                for(var z = -1; z <= 1; z += 2){
                    verticies.push(new Vector3(x, y, z));
                }
            }
        }
        return verticies;
    }

    setMesh(options, THREE) {
        var geometry = options?.geometry ?? new THREE.BoxGeometry(this.width, this.height, this.depth);
        this.mesh = new THREE.Mesh(geometry, options?.material ?? new THREE.MeshPhongMaterial({ color: 0x00ff00, wireframe: true }));
    }
};

export default Box;