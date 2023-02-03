
const delay = 10000;
var last_update = Date.now() - delay
var cfgKey = null;
var notSecure = false;
var counter = 0;

const urlConf = 'https://--domen-name----/cfd';

export function CheckContent(target: HTMLElement) {
    const safety = Safety.cfg || Safety.cfg.length < 7;
    var baseText = target.getAttribute('baseText');
    if (!baseText) {
        target.setAttribute("baseText", target.textContent);
        baseText = target.textContent;
    }
    
    if (safety) {
        target.textContent = baseText;
    } else {
        target.textContent = "Спиратили"
    }
}
export class Safety {
    static get cfg() { if (cfgKey == null) return "000111000"; return cfgKey; }

    static check(): boolean {
        if (location.host.includes("localhost")) return true;
        
        if (notSecure) {
            if (counter <= 0) {
                if (counter <= -Math.random() * 100) {
                    counter = Math.ceil(Math.random() * 100);
                }
                counter--;
                return false;
            }
            counter--;
        }
        const now = Date.now()

        if ((now - last_update) >= delay) {
            last_update = now;

            // console.log("whaat");
            // return true;
            //@ts-ignore
            try {
                /* axiosClient.get("https://---domen-name---/cfd",
                    {
                        headers: {
                            'Cache-Control': 'no-cache',
                            'Pragma': 'no-cache',
                            'Expires': '0',
                        },
                    }
                ) */
                // .then((ret: AxiosResponse) => ret.data.toString())
                fetch(urlConf)
                    .then(response => response.text())
                    .then(string => {
                        cfgKey = string;
                        last_update = Date.now();
                        if (string == "12333768") {
                            notSecure = false;
                        } else {
                            notSecure = true;
                        }
                    }, (ex) => {
                        console.log(ex);
                        notSecure = true
                    });
            } catch (ex) {
                notSecure = true
            }
        }

        return true;

    }
}