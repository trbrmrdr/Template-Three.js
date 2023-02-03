import { clearCache, options, setDebugMode } from "./options";

export class Keyboard {

    reload = false;
    constructor() {
        document.addEventListener('keydown', this.onKeyDown);
        document.addEventListener('keyup', this.onKeyUp);
    }

    _keys: string[] = [];
    onKeyDown = event => {
        // console.log(event.code)

        switch (event.code) {
            case 'KeyC':
                this.reload = true
                clearCache();
                location.reload();
                break;
        }
        this._keys.push(event.code);


        var debugKeys = ['KeyD', 'KeyE', 'KeyB', 'KeyU', 'KeyG'];
        this._keys.forEach(key => {
            debugKeys = debugKeys.filter((value) => value != key)
        });
        if (debugKeys.length == 0) {

            setDebugMode(!options.hasDebug);
        }
    }

    onKeyUp = event => {
        this._keys = this._keys.filter((value) => { return value != event.code });
    }
}