var m_cache = {};

function get(url, type) {
    return new Promise(function (resolve, reject) {
        var key = url.split('/').join('_').split('.').join('_').split('-').join('_').split(' ').join('_');
        var dataCache = m_cache[key];
        if (dataCache) {
            console.log(key, dataCache);
            resolve(dataCache);
            return;
        }

        var req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function () {
            if (req.status == 200) {
                var data = req.responseText;
                if (type == 'json')
                    data = JSON.parse(req.response);
                m_cache[key] = data;
                resolve(data);
            } else
                reject(req.statusText);
        };
        /* Handle network errors */
        req.onerror = function () {
            reject('Network Error');
        };
        req.send();
    });
}


function formatArticle(content) {
    ////var a = content.split('\r');
    ////if (a.length == 1) a = content.split('\n');
    content = content.split('...').join('|||');

    var a = content.split(/[\n.—]+/);

    var aHead = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    //console.log(a);
    var bi = [];

    var ki = 0;
    var langPrev = '', conPrev = '';
    for (var i = 0; i < a.length; i++) {
        var gi = a[i].trim();
        //gi = gi
        //    .split('Cấu trúc:').join('')
        //    .split('Ví dụ:').join('')
        //    .split('Ví dụ').join('')
        //    .split('Hiện tại:').join('')
        //    .split('Quá khứ:').join('')
        //    .split('So sánh:').join('')
        //    .split('tình huống:').join('')
        //    .split('Tình huống:').join('')
        //    .trim();

        if (gi != '') {
            var lang = 'en';
            if (gi.length > gi.replace(/[^\x20-\x7E]+/g, '').length) lang = 'vi';
            console.log(ki + '[' + lang + ']', gi);
            if (ki == 0)
                bi.push('<h1>' + gi + '</h1>');
            else {
                gi = gi.split('|||').join('...');

                if (aHead.indexOf(gi) != -1) {
                    if (langPrev == 'en')
                        bi.push('<p class=en>' + conPrev + '</p>');
                    else
                        bi.push('<p class=vi>' + conPrev + '</p>');

                    if ((i + 1) < a.length) {
                        bi.push('<h3>' + gi + '. ' + a[i + 1].split('|||').join('...') + '</h3>');
                        i = i + 1;
                        langPrev = '';
                        conPrev = '';
                        ki++;
                    }
                } else {
                    if (gi.length == 1) continue;

                    if (langPrev == '') {
                        langPrev = lang;
                        conPrev = gi;
                    } else {
                        if (langPrev == lang) {
                            conPrev += '. ' + gi;
                        } else {
                            if (langPrev == 'en')
                                bi.push('<p class=en>' + conPrev + '</p>');
                            else
                                bi.push('<p class=vi>' + conPrev + '</p>');

                            langPrev = lang;
                            conPrev = gi;
                        }
                    }
                }
            }
            ki++;
        }
    }
    if (langPrev == 'en')
        bi.push('<p class=en>' + conPrev + '</p>');
    else
        bi.push('<p class=vi>' + conPrev + '</p>');

    return '<div class=Article>' + bi.join('') + '</div>';
}


function formatPhrasePopular(content) {
    content = content.split('‘').join('’');
    content = content.split('’').join('^');
    ////var a = content.split('\r');
    ////if (a.length == 1) a = content.split('\n');

    var a = content.split(/[\n\r]+/);

    //console.log(a);
    var bi = [];

    var ki = 0;
    var langPrev = '', conPrev = '';
    for (var i = 0; i < a.length; i++) {
        var gi = a[i].trim();

        if (gi != '') {
            var lang = 'en';
            if (gi.length > gi.replace(/[^\x20-\x7E]+/g, '').length) lang = 'vi';
            gi = gi.split('^').join('’');

            //console.log(ki + '[' + lang + ']', gi);
            if (ki == 0)
                bi.push('<h1>' + gi + '</h1>');
            else {
                gi = gi.trim();

                if (gi.indexOf(':') != -1) {
                    if (conPrev != '') {
                        if (langPrev == 'en')
                            bi.push('<p class=en>' + conPrev + '</p>');
                        else
                            bi.push('<p class=vi>' + conPrev + '</p>');
                    }

                    var ah3 = gi.split(':');
                    var mean = ah3[ah3.length - 1].trim();
                    var phrase = gi;
                    if (mean != '') phrase = gi.substring(0, gi.indexOf(mean));

                    bi.push('<h3><b>' + phrase + '</b><em>' + mean + '<em></h3>');
                    langPrev = '';
                    conPrev = '';
                    ki++;
                } else {
                    if (gi.length == 1) continue;

                    if (langPrev == '') {
                        langPrev = lang;
                        conPrev = gi;
                    } else {

                        //////if (lang == 'vi' && (gi.indexOf("'") != -1 || gi.indexOf("~") != -1)) {
                        //////    gi = gi.split('~').join('’');

                        //////    console.log(gi);

                        //////    var a2 = gi.split(/[.:(]+/);
                        //////    var bxi = [];
                        //////    for (var x = 0; x < a2.length; x++) {
                        //////        var it = a2[x].trim();
                        //////        if (it.length > it.replace(/[^\x20-\x7E]+/g, '').length)
                        //////            bxi.push('<p class=vi>' + it + '</p>');
                        //////        else
                        //////            bxi.push('<p class=en>' + it + '</p>');
                        //////    }
                        //////    bi.push(bxi.join(''));
                        //////    continue;
                        //////}



                        if (langPrev == lang) {
                            conPrev += '. ' + gi;
                        } else {
                            if (langPrev == 'en')
                                bi.push('<p class=en>' + conPrev + '</p>');
                            else
                                bi.push('<p class=vi>' + conPrev + '</p>');

                            langPrev = lang;
                            conPrev = gi;
                        }
                    }
                }
            }
            ki++;
        }
    }
    if (langPrev == 'en')
        bi.push('<p class=en>' + conPrev + '</p>');
    else
        bi.push('<p class=vi>' + conPrev + '</p>');

    return '<div class=PhrasePopular>' + bi.join('') + '</div>';
}
















function gridGamFromText(textGAM) {
    var listGAM = [];
    var a = textGAM.split('\r');
    if (a.length == 1) a = textGAM.split('\n');

    //console.log(a);

    var ki = 0;
    for (var i = 0; i < a.length; i++) {
        var gi = a[i].trim();
        gi = gi
            .split('Cấu trúc:').join('')
            .split('Ví dụ:').join('')
            .split('Ví dụ').join('')
            .split('Hiện tại:').join('')
            .split('Quá khứ:').join('')
            .split('So sánh:').join('')
            .split('tình huống:').join('')
            .split('Tình huống:').join('')
            .trim();

        if (gi != '') {
            ki++;
            var lang = 'en';
            if (gi.length > gi.replace(/[^\x20-\x7E]+/g, '').length) lang = 'vi';
            //console.log(ki + '[' + lang + ']', gi);
            listGAM.push({ id: ki, lang: lang, text: gi });
        }
    }

    //console.log('listGAM', listGAM);

    var gridGAM = [];
    var gam = null, en = '', vi = '';
    ki = 1;
    for (var i = 0; i < listGAM.length; i++) {
        var it = listGAM[i];
        var lang = it.lang;
        if (gam == null && lang == 'vi') continue;
        if (lang == 'en') {
            vi = '';
            if (gam == null) gam = { recid: ki };
            en += ' ' + it.text;
            gam['text'] = en.trim();
        }
        if (gam != null && lang == 'vi') {
            vi += ' ' + it.text;

            if (i < listGAM.length - 1) {
                var lang2 = listGAM[i + 1]['lang'];
                if (lang2 == 'en') {
                    gam['w2ui'] = {};
                    gam['w2ui']['style'] = 'font-weight: bold;color: #000;';
                    var kii = parseInt(ki.toString() + '1');
                    gam['w2ui']['children'] = [{ recid: kii, text: vi.trim(), w2ui: { children: [], style: 'font-weight: normal;color: #aaa;' } }];
                    gridGAM.push(gam);
                    vi = '';
                    en = '';
                    gam = null;
                    ki++;
                }
            }
        }
    }

    return gridGAM;
}

function loading(close) {
    if (close == false) {
        $('#loading').animate({ width: 'hide' }, 500);
    } else {
        document.getElementById('loading').style.display = 'block';
    }
}
