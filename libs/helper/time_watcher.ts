

class TimeWatcher {
    public static time() { return (new Date()).getTime(); }
    static old = -1

    public static time_s(msg: string = null) {
        this.old = this.time();
        if (msg) {
            console.log(msg);
        }
    }
    public static time_e(msg: string) {
        console.log(msg, this.time() - this.old);
        this.old = this.time();
    }
}

export { TimeWatcher }