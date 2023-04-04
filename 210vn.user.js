// ==UserScript==
// @name         HentaiVN Tools
// @namespace    https://github.com/hth4nh/HentaiVN-Tools
// @version      0.3.1
// @description  Some additional features for HentaiVN website
// @author       Hth4nh
// @include      http*://hentaivn.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=210vn.net
// @grant        none
// ==/UserScript==

/**
 *
 * Bấm Shift + (+) hoặc Shift + (-) để chỉnh size ảnh
 * Bấm PageUp hoặc PageDown để di chuyển lên/xuống
 *
 */
if (window.location.pathname == '/list-random.php') {
    document.head.insertAdjacentHTML('beforeend', '<link href="https://static.htvncdn.net/css/css-xx33-main.min.css?cache=4" rel="stylesheet" type="text/css"><link href="https://static.htvncdn.net/css/css-106-all.min.css?cache=2" rel="stylesheet" type="text/css">');
}
let css = document.createElement('style');
document.head.insertAdjacentElement('beforeend', css);



if (window.location.pathname == '/forum/search-plus.php') {
    let chars = [];
    let origin = document.querySelector(".ul-search");
    let elems = document.querySelectorAll(".ul-search > li");
    let ul;
    for (let elem of elems) {
        let char = elem.innerText[0];
        if (!chars.includes(char)) {
            chars.push(char);
            ul = document.createElement('ul');
            ul.className = `ul-search char-${char}`;
            ul.insertBefore(elem, null);
            origin.parentNode.insertBefore(ul, origin);
        }
        else {
            let ul = document.querySelector(`.ul-search.char-${char}`);
            ul.insertBefore(elem, null);
        }
    }
    origin.parentNode.insertBefore(ul, origin);
    origin.remove();
}

function changeTagsColor(tagArr = [], background = "rgba(33,150,243,.78)", color = "white", border = "#111 0.5px solid") {
    let queries = [];
    for (let tag of tagArr) {
        queries.push(`a[href^="/the-loai-${tag}-"], li:has(input[value="${tag}"])`);
    }
    let style = `background-color: ${background}; color: ${color};`;
    changeStyle(queries.join(", "), style);
    return tagArr;
}

function changeStyle(query = "", style = "") {
    const someStyle = "\n" + query + '{' + style + '}';
    css.innerHTML += someStyle;
}

function removeElems(...queries) {
    let style = 'display: none';
    changeStyle(queries.join(", "), style);
}

function resize(diff = 0) {
    let sum = size + diff;
    if (sum < 0 || sum > 100) return;
    size += diff;
    let img = document.getElementById('image');
    if (!img) return;
    let imgScrolled = window.scrollY - img.offsetTop;
    let oldHeight = img.scrollHeight;
    img.style.width = `${size}%`;
    let newScrollY = imgScrolled * img.scrollHeight / oldHeight + img.offsetTop;
    window.scrollTo(0, newScrollY);
}

let scrolling = 0;
let scrollTmp = 0;
function scroll(diff = 0) {
    if (scrolling) {
        window.scrollTo(0, scrollTmp + diff);
        scrolling = 0;
        return;
    }
    scrolling = 1;

    setTimeout(() => {
        scrolling = 0;
    }, 300);


    scrollTmp = window.scrollY + diff;

    window.scrollTo({
        top: scrollTmp,
        behavior: 'smooth'
    });
}

let lgbt = changeTagsColor([92, 96, 50, 52], "purple");
let ntr = changeTagsColor([68, 98, 51, 41, 211, 253], "tomato");
let netori = changeTagsColor([1, 34], "yellow", "black");
let horror = changeTagsColor([55, 122, 26, 66, 207, 128, 89, 119], "maroon");
let furry = changeTagsColor([202, 25, 127, 22], "darkslateblue");
let favorite = changeTagsColor([37, 99], "green");

changeStyle("#image", 'max-width: calc(100% - 10px); padding: 0; margin:auto; border: 5px solid cyan; border-bottom : 0');
changeStyle("#image > img", 'border: 0; background-color: red; max-width: 100%; min-width: 100%; min-height: 20px; margin-bottom: 0; border-bottom: 5px solid cyan;');
changeStyle("#head, .nav-login, .bot-episode, #inner-watchxemthongtin, .head-nav, .footer > p", 'max-width: calc(100% - 10px); margin: auto;');
changeStyle(".buttonhide, .chon-chap", 'margin-bottom: 15px;');
changeStyle(".head-nav > ul", 'width: auto; height: 35px;');
changeStyle("#showcmt", 'min-width: 14%');
changeStyle(".right_ps", 'float: none; margin:auto;');
changeStyle(".ul-search > li", 'margin: 1px 2.3%; width: 20%');
changeStyle(".ul-search", 'border: #777 0.5px solid; border-bottom: 0; margin-bottom: 0; padding: 10px');
changeStyle(".ul-search:last-of-type", 'border-bottom: #777 0.5px solid; margin-bottom: 10px');

removeElems("#qxx", ".right_ps > p", "#qx-300x250", ".qx_main", ".qx_main2");







let size = 60;
resize();

document.body.addEventListener('keydown', event => {
    //console.log(event);
    if (event.code == 'PageDown') {
        event.preventDefault();
        scroll(400);
    }
    if (event.code == 'PageUp') {
        event.preventDefault();
        scroll(-400);
    }
    if (event.shiftKey && event.code == 'NumpadAdd') {
        resize(+10);
    }
    if (event.shiftKey && event.code == 'NumpadSubtract') {
        resize(-10);
    }
});
