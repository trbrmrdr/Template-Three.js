import { Trimesh } from "cannon-es";
import { BufferGeometry, Euler, Mesh, Object3D, Quaternion, Vector3 } from "three";
import { ShapeType } from "three-to-cannon";


function translateMesh(mesh, dpos: Vector3) {
    // if (id != 0) return;
    // @ts-ignore
    const array = mesh.geometry.attributes.position.array;
    // console.log(array[0], array[1], array[2])

    // mesh.position.add(new Vector3(0, 0, dZ));

    // mesh.matrix.makeTranslation(0, 0, dZ)
    // mesh.matrixAutoUpdate = false;
    // mesh.updateMatrix()


    array.forEach((el, id) => {
        // if (id < 10)
        // 	console.log(id, id % 3)
        const id_stack = id % 3;
        if (id_stack == 0) {
            array[id] += dpos.x;
        }
        else if (id_stack == 1) {
            array[id] += dpos.y;
        }
        else if (id_stack == 2) {
            array[id] += dpos.z;
        }
    })
    //@ts-ignore
    mesh.geometry.attributes.position.needsUpdate = true;
    // console.log(array[0], array[1], array[2])
}
function getVertices(geometry: BufferGeometry) {
    const position = geometry.attributes.position;
    const vertices = new Float32Array(position.count * 3);

    for (let i = 0; i < position.count; i++) {
        vertices[i * 3] = position.getX(i);
        vertices[i * 3 + 1] = position.getY(i);
        vertices[i * 3 + 2] = position.getZ(i);
    }

    return vertices;
}
function getTrimeshParameters(geometry: BufferGeometry) {
    const vertices = getVertices(geometry);
    if (!vertices.length) return null;
    const indices = new Uint32Array(vertices.length);

    for (let i = 0; i < vertices.length; i++) {
        indices[i] = i;
    }

    return {
        type: ShapeType.MESH,
        params: {
            vertices,
            indices
        }
    };
}

function createTrimesh(params) {
    const {
        vertices,
        indices
    } = params;
    const shape = new Trimesh(vertices, indices);
    return shape;
}




const _v1 = new Vector3()
const _v2 = new Vector3();
const _q1 = new Quaternion();

function convertObjectToCannon(mesh: Mesh, geometry: BufferGeometry) {
    mesh.updateMatrixWorld();
    mesh.matrixWorld.decompose(_v1, _q1, _v2);
    geometry = geometry.scale(_v2.x, _v2.y, _v2.z);

    geometry = geometry.applyMatrix4(mesh.matrix)

    const shapeParameters = getTrimeshParameters(geometry);
    const {
        type,
        params,
        // @ts-ignore
        offset,
        // @ts-ignore
        orientation
    } = shapeParameters;
    let shape = createTrimesh(params);


    const result = {
        shape,
        offset,
        orientation
    };
    // const result = threeToCannon(wall.collider, { type: ShapeType.MESH });
    return result;
}


function EulerToVector(euler: Euler) {
    return new Vector3(euler.x, euler.y, euler.z);
}

function uniq<T>(a: Array<T>) {
    var seen = {};
    return a.filter(function (item) {
        // @ts-ignore
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}


export { convertObjectToCannon, EulerToVector, uniq, translateMesh };