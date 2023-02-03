import { Camera, Euler, Light, PointLight, Vector2, Vector3 } from 'three';
import * as S from './saves'
import Cookies from 'js-cookie'
import { text } from 'stream/consumers';
import { Pane } from 'tweakpane';
import { PI_HALF } from './Consts';

const CURR_VERSION_NAME = 'v 0.0 template';

export function clearCache() {
	console.log("cleared Game Cookies");
	for (var name in Cookies.get()) {
		Cookies.remove(name)
	}
}

if (S.Get("versionName", CURR_VERSION_NAME) !== CURR_VERSION_NAME) {
	clearCache();
}

S.Set("versionName", CURR_VERSION_NAME);

var options = {

	hasDebug: S.Get("hasDebug", false),

	gui: new Pane({ title: CURR_VERSION_NAME, expanded: true }),
	hasLocal: location.host.includes("localhost"),

	position: S.Get("position", new Vector3(7., 4., 6.)),
	rotation: S.Get("rotation", new Vector3(-0.61, 0.79, 0.46)),


	initCamera: (camera: Camera) => {
		camera.position.copy(options.position);
		camera.setRotationFromEuler(new Euler(options.rotation.x, options.rotation.y, options.rotation.z));
		// console.log(options.position, options.rotation);


		options.gui.addButton({ title: "export" }).on('click', () => {
			console.log(options.gui.exportPreset());
		})

		const cameraFolder = options.gui.addFolder({ title: "Camera", expanded: false });

		cameraFolder.addInput(options, "position").on('change', (ev) => {
			options.position = S.Set("position", ev.value);
			camera.position.copy(options.position);
		})

		cameraFolder.addInput(options, "rotation").on('change', (ev) => {
			options.rotation = S.Set("rotation", ev.value);
			camera.setRotationFromEuler(new Euler(options.rotation.x, options.rotation.y, options.rotation.z));
		});

	},
	updateCamera: (camera: Camera) => {
		if (!options.hasDebug) return;
		if (options.gui.hidden || !options.gui.expanded) return;

		options.position = S.Set("position", camera.position);
		S.Set("rotation", new Vector3(camera.rotation.x, camera.rotation.y, camera.rotation.z));
		const saved = options.position;
		try {
			options.position = S.Set("position", camera.position);
			options.gui.refresh()
		} catch (ex) {
			S.Set("position", saved);
		}
	},
	//###################
	// Project vars

	objectColor: S.Get('objectColor', '#93deea'),
	backColor: S.Get('backColor', '#000000'),

	dPos: S.Get('dPos', new Vector3(0, 0, 0)),
	dRot: S.Get('dRot', new Vector3(PI_HALF, 0, 0)),

	ambLight: {
		color: S.Get('ambLight.color', '#ffffff'),
		intensity: S.Get('ambLight.intensity', 0.4)
	}
};


const setDebugMode = (enable: boolean = options.hasDebug) => {
	options.hasDebug = S.Set('hasDebug', enable);
	options.gui.hidden = enable == false;
}
setDebugMode();
export { options, setDebugMode }