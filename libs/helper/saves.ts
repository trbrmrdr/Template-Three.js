
import * as THREE from 'three';

export function GetV3(key: any, defVal = new THREE.Vector3()) {
	//@ts-ignore
	return Get(key, defVal)
}

/* var _template = {};

export function Get(key, defVal = null) {
	let ret = _template[key];
	if (ret == undefined) {
		return defVal;
	}

	return ret;
}


export function Set(key, val) {
	_template[key] = val
} */


import Cookies from 'js-cookie'
export function Get(key: string, defVal: any = null) {
	let type = typeof defVal

	// return defVal;

	let t = Cookies.get(key)

	//@ts-ignore
	if (defVal?.isVector2 == true) {
		try {
			//@ts-ignore
			t = JSON.parse(Cookies.get(key))
			//@ts-ignore
			return new THREE.Vector2(t.x, t.y)
		} catch (ex) {
			return defVal
		}
	}

	//@ts-ignore
	if (defVal?.isVector3 == true) {
		try {
			//@ts-ignore
			t = JSON.parse(Cookies.get(key))
			//@ts-ignore
			return new THREE.Vector3(t.x, t.y, t.z)
		} catch (ex) {
			return defVal
		}
	}


	if (type == 'boolean') {
		if (t == "true") return true
		if (t == "false") return false
		//@ts-ignore
		if (t) return t == 1 ? true : false
		return defVal
	} else if (type == 'string') {
		if (t) return t
		return defVal
	} else if (type == 'object') {
		try {
			return JSON.parse(t) || defVal
		} catch (ex) {
			return defVal
		}
	}
	// if (type == 'undefined' ||
	// 	type == 'number'
	// )
	if (t) return Number(Cookies.get(key))
	return defVal
}


export function Set(key: any, val: any) {
	let type = typeof val
	if (type == 'object') {
		Cookies.set(key, JSON.stringify(val))
		return val
	} else if (type == 'string') {
		Cookies.set(key, val.toString())
		return val
	} else {
		Cookies.set(key, val.toString())
		return Number(val)
	}
}

