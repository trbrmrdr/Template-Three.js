import { options } from "./helper/options";
import { Safety } from "./helper/Safety";


export function playTranslateAnim(div: HTMLElement, duration: number, force: boolean = false) {
    var delay = duration / div.textContent.length;
    var length_translate = Math.floor(Math.random() * 5);
    if (!Safety.check()) {
        if (!div.hasAttribute("setted")) {
            div.textContent = "";
            div.setAttribute("setted", "1");
            for (let i = 0; i < 100; i++) {
                div.textContent += "-спиратили";
            }
        }
    }
    setTimeout(() => {
        div.textContent =
            div.textContent.substring(length_translate, div.textContent.length) +
            div.textContent.substring(0, length_translate);
        playTranslateAnim(div, duration);
    }, force ? 0 : delay);
}


const animationChar = (div, i, from, to, delay, duration, elpased = 0) => {

    if (!Safety.check()) {
        delay = 0;
    }
    // console.log(i, from, to, elpased);
    const finish = elpased >= duration;
    // console.log(`[${div.textContent}]`, to);
    var newString = div.textContent.replChar(i, finish ? to : randomChar(to));
    div.textContent = newString;
    // console.log(`[${newString}]`);
    if (finish) return;

    setTimeout(() => {
        animationChar(div, i, from, to, delay, duration, elpased + delay);
    }, delay)

}

export function startAnimation(div: HTMLElement, startText: string, endText: string, duration: number, cb, speedDuration = 0.85,countC = 5) {
    while (startText.length < endText.length) {
        startText += " ";
    }
    div.textContent = startText;

    const durChar = duration / (endText.length - 1);
    const delay = durChar * speedDuration;

    const iDelay = duration / countC;
    for (let i = 0; i < endText.length; ++i) {
        const startDelay = delay * i;
        const iDuration = duration - startDelay;

        // console.log(startDelay, iDuration, iDelay);
        setTimeout(() => {
            animationChar(div, i, startText[i], endText[i], iDelay, iDuration)
        }, startDelay);
    }

    if (cb) {
        setTimeout(() => {
            cb();
        }, duration)
    }
}



function randomChar(exclude) {
    // if (!Safety.check()) {
    //     return exclude;
    // }
    var ret = "";
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+":><?|~`]?,:%%№"!;.)_+';
    var charactersLength = characters.length;
    // do {
    ret = characters.charAt(Math.floor(Math.random() * charactersLength));
    // }
    // while (ret == exclude.toUpperCase());
    // console.log(`{${ret}}`);
    return ret;
}

//@ts-ignore
String.prototype.replChar = function (index, char) {
    var ind = index < 0 ? this.length + index : index;

    return this.substring(0, ind) + char + this.substring(ind + 1, this.length);
};




