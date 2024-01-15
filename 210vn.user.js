// ==UserScript==
// @name         HentaiVN Tools
// @namespace    Hth4nh
// @version      0.3.2.2
// @description  Some additional features for HentaiVN website
// @author       Hth4nh
// @match        http*://hentaivn.tv/*
// @include      http*://hentaivn.*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=210vn.net
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @resource     xx33    https://static.htvncdn.net/css/css-xx33-main.min.css?cache=4
// @resource     107     https://static.htvncdn.net/css/css-107-all.min.css?cache=2
// @run-at       document-idle
// @noframes
// ==/UserScript==

/* eslint-env browser, es6 */

// Add title & CSS to random page (./list-random.php)
if (window.location.pathname == '/list-random.php') {
	document.head.insertAdjacentHTML('afterbegin', '<title>Random</title>');
    GM_addStyle(GM_getResourceText("xx33") + GM_getResourceText("107"));
}

// Group categories alphabetically
if (window.location.pathname == '/forum/search-plus.php') {
	let chars = [];
	let origin = document.querySelector(".ul-search");
	let elems = document.querySelectorAll(".ul-search > li");

	let tmpUl;
	for (let elem of elems) {
		let char = elem.innerText[0];

        if (chars.includes(char)) {
            let ul = document.querySelector(`.ul-search.char-${char}`);
			ul.insertBefore(elem, null);
            continue;
        }

        chars.push(char);
        tmpUl = document.createElement('ul');
        tmpUl.className = `ul-search char-${char}`;
        tmpUl.insertBefore(elem, null);
        origin.parentNode.insertBefore(tmpUl, origin);
	}

	origin.parentNode.insertBefore(tmpUl, origin);
	origin.remove();
}

// Change tags color
function changeTagsColor(tagArr = [], background = "rgba(33,150,243,.78)", color = "white") {
	let queries = [];
	for (let tag of tagArr) {
		queries.push(`a[href^="/the-loai-${tag}-"]`);
		if (isSelectorValid(':has(a)')) queries.push(`li:has(input[value="${tag}"])`);
	}

	let style = `background-color: ${background}; color: ${color};`;
	addStyle(queries.join(", "), style);

	return tagArr;
}

// Check if CSS query is valid or not
function isSelectorValid(selector) {
	try {
		document.createDocumentFragment().querySelector(selector);
	}
	catch {
		return false;
	}
	return true;
}

// Add CSS
function addStyle(query = "", style = "") {
    GM_addStyle(query + '{' + style + '}');
}

function removeElems(...queries) {
	let style = 'display: none';
	addStyle(queries.join(", "), style);
}

// Highlight & group some popular tags
let lgbt = changeTagsColor([92, 96, 50, 52], "purple");
let ntr = changeTagsColor([68, 98, 51, 41, 211, 253], "tomato");
let netori = changeTagsColor([1, 34], "yellow", "black");
let horror = changeTagsColor([55, 122, 26, 66, 207, 128, 89, 119], "maroon");
let furry = changeTagsColor([202, 25, 127, 22], "darkslateblue");
let favorite = changeTagsColor([37, 99], "green");


// Enchance site
addStyle(".bar-title-episode", 'margin: 20px auto 10px auto;');
addStyle("#head, .nav-login, .bot-episode, #inner-watchxemthongtin, .head-nav, .footer > p", 'max-width: calc(100% - 10px); margin: auto;');
addStyle(".buttonhide, .chon-chap", 'margin-bottom: 15px;');
addStyle(".head-nav > ul", 'width: auto; height: 35px;');
addStyle("#showcmt", 'min-width: 14%');
addStyle(".right_ps", 'float: none; margin:auto;');
addStyle(".ul-search > li", 'margin: 1px 2.3%; width: 20%');
addStyle(".ul-search", 'border: #777 0.5px solid; border-bottom: 0; margin-bottom: 0; padding: 10px');
addStyle(".ul-search:last-of-type", 'border-bottom: #777 0.5px solid; margin-bottom: 10px');
addStyle(".view-top-1 > a", 'color: #44b9fa');
addStyle(".des-same > a:visited, .box-description > a:visited, .view-top-1 > a:visited, .box-description h2 a:first-child:visited, .box-description > p > a:first-child:visited", 'color: #9e9e9e');

// Enchance image container
let size = 60;
addStyle("#image", `width: ${size}%; max-width: calc(100% - 10px); padding: 0; margin:auto; border: 5px solid cyan;`);
addStyle("#image > p", 'padding: 0 !important');
addStyle("#image img:not(.lazyload, .lazyloading)", 'border: 0; background-color: red; max-width: 100%; min-width: 100%; min-height: 20px; margin-bottom: 0; border-bottom: 5px solid cyan;');
addStyle("#image img:last-of-type", 'border-bottom : 0');

// Minimize all .gif inside image container
addStyle('#image img[src*="NZu1ULpbbwovv"]:not(:hover), #image img[src*="gif"]:not(:hover)', 'width: 10vw; min-width: auto; border: 10px double red;');

// Remove ads
removeElems("#qxx", ".right_ps > p", "#qx-300x250", ".qx_main", ".qx_main2", '#image [src="https://api.hentalk.org/"]');




// Resize image container
function resize(diff = 0) {
	let sum = size + diff;
	if (sum < 20 || sum > 100) return;

	let img = document.getElementById('image');
	if (!img) return;

    size += diff;
    img.style.width = `${size}%`;

	let imgScrolled = window.scrollY - img.offsetTop;
	let oldHeight = img.scrollHeight;

	let newScrollY = imgScrolled * img.scrollHeight / oldHeight + img.offsetTop;
	window.scrollTo(0, newScrollY);
}

// Add shortcut to resize image container
document.body.addEventListener('keydown', event => {
	if (event.shiftKey && event.code == 'NumpadAdd') {
		resize(+10);
	}
	if (event.shiftKey && event.code == 'NumpadSubtract') {
		resize(-10);
	}
});


// Open random h*ntai in new tab
let aArr = document.querySelectorAll('.page-random a');
for (let a of aArr) {
	a.target = '_blank';
}



// let gifArr = document.querySelectorAll('#image > img[src*="gif"]');
// for (const gif of gifArr) {
// 	gif.onclick = () => {
// 		gif.classList.add('clicked');
// 	}
// }