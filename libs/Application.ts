import * as THREE from 'three';


// import * as THREE from './three.js/build/three.module.js';
// import { OrbitControls } from './three.js/examples/jsm/controls/OrbitControls'
// import { OBJLoader } from './three.js/examples/jsm/loaders/OBJLoader'
import { AsciiEffect } from './../../libs/three.js/examples/jsm/effects/AsciiEffect'


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
// import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect'
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader'

import Stats from 'three/examples/jsm/libs/stats.module'
import { options } from './helper/options';
import * as S from './helper/saves'

import * as dat from 'dat.gui';
import * as Easing from './helper/Easing'

import { AmbientLight, AnimationClip, AnimationMixer, Camera, Clock, Color, DoubleSide, Group, MaterialLoader, Mesh, MeshPhongMaterial, PlaneGeometry, PointLight, Scene, Vector3 } from 'three';
import { Keyboard } from './helper/Keyboard';
import { Safety } from './helper/Safety';
import { EulerToVector } from './helper/GeometryMath';
import { Pane } from 'tweakpane';
import { PI_HALF } from './helper/Consts';

class Application {

	// stats = Stats();
	constructor() {
		// document.body.appendChild(this.stats.dom)

		this.baseInit();

		this.scene.add(new THREE.AxesHelper(5))

		// this.controls = new OrbitControls(this.camera, this.asciEfeffect.domElement);
		// this.controls = new OrbitControls(this.camera, document.getElementById("orbitControl"));
		this.controls = new OrbitControls(this.camera, this.canvas);

		// this.controls.autoRotate = false;
		// this.controls.autoRotateSpeed = 0.5;

		window.addEventListener('resize', () => { this.onWindowResize(); }, false);
		this.onWindowResize();

		this.initGUI();
		this.draw();
	}


	get width(): number { return this.canvas.parentElement.clientWidth; }
	get height(): number { return this.canvas.parentElement.clientHeight };
	get FOV(): number {
		// return 60
		const distance = 400;
		return 2 * Math.atan(this.height / (2 * distance)) * 90 / Math.PI;
	}

	render: THREE.WebGLRenderer
	controls: OrbitControls | null
	scene: Scene
	camera: THREE.PerspectiveCamera

	keyboard = new Keyboard();
	sphere: THREE.Mesh;
	plane: THREE.Mesh;

	canvas: HTMLElement;

	ambLight: AmbientLight;
	baseInit() {

		this.canvas = document.getElementById("canvas");

		//Initialise three.js
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(options.backColor);
		//@ts-ignore

		this.render = new THREE.WebGLRenderer({ /* antialias: true, */ canvas: this.canvas });
		// this.render.setPixelRatio(window.devicePixelRatio);
		// this.render.setSize(window.innerWidth, window.innerHeight);
		// this.render.setClearColor("#000000");

		//Camera
		this.camera = new THREE.PerspectiveCamera(this.FOV, this.width / this.height, 1, 20000);
		options.initCamera(this.camera);

		this.scene.add(this.camera);

		this.ambLight = new THREE.AmbientLight(options.ambLight.color, options.ambLight.intensity);
		this.scene.add(this.ambLight);



		this.sphere = new THREE.Mesh(new THREE.SphereGeometry(2, 20, 10), new THREE.MeshStandardMaterial({ flatShading: true, color: options.objectColor }));
		this.scene.add(this.sphere);

		this.plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.MeshStandardMaterial({ color: 0xe0e0e0, side: DoubleSide, }));
		this.plane.position.y = - 2;
		// this.plane.rotation.x = - PI_HALF;
		this.scene.add(this.plane);
		this.updateDPos();
	}

	enableRender = true;
	onWindowResize() {
		// if (window.innerHeight <= 600) {
		// } else {
		// 	this.enableRender = true;
		// }

		this.camera.fov = this.FOV;
		this.camera.aspect = this.width / this.height;
		this.camera.updateProjectionMatrix();

		this.render.setSize(this.width, this.height);

	}

	updateDPos() {
		this.sphere?.position.copy(options.dPos);
		this.plane?.rotation.setFromVector3(options.dRot);
	}

	scaleWindowGui: dat.GUI
	skyGui: dat.GUI
	folderWeed: dat.GUI
	private initGUI() {

		options.gui.addInput(options, 'backColor').on('change', (ev) => {
			S.Set("backColor", ev.value);

			this.scene.background = new THREE.Color(ev.value);
		});

		options.gui.addInput(options, "objectColor").on('change', (ev) => {
			S.Set("objectColor", ev.value);
			//@ts-ignore
			this.sphere.material.color = new Color(ev.value)
		});


		const foladerDPos = options.gui.addFolder({ title: "dPos ", expanded: false });
		foladerDPos.addInput(options, "dPos").on('change', (ev) => {
			options.dPos = S.Set("dPos", ev.value);
			this.updateDPos();
		})

		foladerDPos.addInput(options, "dRot").on('change', (ev) => {
			options.dRot = S.Set("dRot", ev.value);
			this.updateDPos();
		});

		//_________
		const ambLightFolder = options.gui.addFolder({ title: "AmbLight", expanded: true });
		const updateLight = (ev) => {
			this.ambLight.color.set(new Color(options.ambLight.color));
			this.ambLight.intensity = options.ambLight.intensity;

			S.Set('ambLight.color', options.ambLight.color);
			S.Set('ambLight.intensity', options.ambLight.intensity);
		}
		ambLightFolder.addInput(options.ambLight, "color").on('change', updateLight)
		ambLightFolder.addInput(options.ambLight, "intensity").on('change', updateLight)
		//###########################
	}

	loaded = 0;
	private loadObj() {
		const loader = new ColladaLoader();
		loader.load('assets/object.dae',
			(obj) => {
				// this.objLoadingComplete(obj)
				this.loaded = 1;
			},

			function (xhr) {
				this.loaded = xhr.loaded / xhr.total;
				this.loaded = Math.min(this.loaded, 1);
				console.log((xhr.loaded / xhr.total * 100) + '% loaded', this.loaded);
			},

			function (error) {
				console.log('An error happened', error);
			}
		);
		//___________
		// },
		// 	function (xhr) {
		// 		console.log((xhr.loaded / xhr.total * 100) + '% loaded');
		// 	},
		// 	function (error) {
		// 		console.log('An error happened');
		// 	})
	}

	timer = new Clock(true);

	containerControl: HTMLElement = document.getElementById("orbitControl")
	private draw() {
		if (Safety.check() && this.enableRender) {
			// console.log("draw");
			if (this.keyboard.reload) return;
			options.updateCamera(this.camera);

			this.render.render(this.scene, this.camera);

			this.controls?.update();

			// this.stats?.update();
		}
		requestAnimationFrame(() => { this.draw() });
	}


}

export default Application;