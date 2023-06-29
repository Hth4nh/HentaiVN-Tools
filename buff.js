let opt = {
    method: "HEAD",
    cache: 'no-cache'
}

let id = '7377-15401';

async function updateId() {
    const res = await fetch('https://raw.githubusercontent.com/Hth4nh/HentaiVN-Tools/main/code.txt');
    text = await res.text();
    id = text.trim();
}

updateId();
setInterval(updateId, 5 * 60 * 1000);

let rate = 1;
let sec_per_time = 1;

let count = 1;

let server_error = 0, server_blocked = 0;

async function req() {
    try {
        const res = await fetch(`https://hentaivn.tv/${id}-xem-truyen--${++count}.html`, opt);
        switch (Math.floor(res.status / 100)) {
            case 4:
                if (opt.method === 'HEAD') {
                    opt.method = 'GET';
                    setTimeout( _ => {
                        opt.method = 'HEAD'
                    }, 5 * 1000);
                }
                else server_blocked = 1;
                break;
            case 5:
                server_error = 1;
                break;
        }
        return (res.status);
    }
    catch(err) {
        //console.error("Request error: " + err.message);
    }
}

async function multiReq(x) {
    while (x-->1) {
        req();
    }
    return await req();
}

async function buff() {

    await req();
    while (true) {
        document.title = ` ${(count).toLocaleString("vi-VN")} | ${rate/sec_per_time} req/s `;
        if (server_error || server_blocked) {
            document.title += ' ERR';
            await setTimeout( _ => {}, 1 * 60 * 1000);
        }
        const prevTime = Date.now();
        const status = await multiReq(rate);
        rate = Math.floor(rate / (Date.now() - prevTime) * 1000 * sec_per_time);
    }

}

buff();
