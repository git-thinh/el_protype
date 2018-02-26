var m_ready = false;
var m_browserWidth = 0;
var m_browserHeight = 0;
var m_device = 'pc';
var m_tree = {};
/****************************************/
m_browserWidth = window.innerWidth || Math.max(document.documentElement.clientWidth, document.body.clientWidth);
m_browserHeight = window.innerHeight || Math.max(document.documentElement.clientHeight, document.body.clientHeight);

if (m_browserWidth < 500)
    m_device = 'mobile';
else if (m_browserWidth < 1024)
    m_device = 'tablet';
/****************************************/

var m_page = {
    top: null,
    left: { toolbar: null, grid: null },
    main: { toolbar: null, grid: null },
    preview: { toolbar: null, grid: null },
    right: { toolbar: null, grid: null },
    bottom: { toolbar: null, grid: null }
};


$().w2toolbar({
    name: 'toolbar_top',
    style: 'background-color: #ccc !important;',
    items: [
        { type: 'button', id: 'mn_category', caption: 'Menu', icon: 'fa fa-bars' },
        { type: 'spacer' },
        { type: 'button', id: 'mn_note', caption: 'Note', icon: 'fa fa-sticky-note-o' },
        {
            type: 'menu', caption: '', icon: 'fa fa-user-o', items: [
              { id: 'mn_setting', text: 'Setting', icon: 'fa fa-wrench' },
              { id: 'mn_change_pass', text: 'Change password', icon: 'fa fa-key' },
              { id: 'mn_logout', text: 'LogOut', icon: 'fa fa-power-off' },
            ]
        },
    ],
    onClick: function (event) {
        var id = event.target;
        if (id.indexOf(':') != -1) id = id.substring(id.indexOf(':') + 1, id.length);
        console.log(id, event);
        switch (id) {
            case 'mn_category':
                if (m_device == 'mobile') {
                    w2ui['layout_main'].hide('bottom');
                    w2ui['layout_main'].hide('right');
                }
                w2ui['layout_main'].toggle('left', window.instant);
                break;
            case 'mn_grammar':
                w2ui['layout_main'].toggle('bottom', window.instant);
                break;
            case 'mn_note':
                if (m_device == 'mobile') {
                    w2ui['layout_main'].hide('bottom');
                    w2ui['layout_main'].hide('left');
                }
                w2ui['layout_main'].toggle('right', window.instant);
                break;
            case 'mn_setting':
                break;
            case 'mn_change_pass':
                break;
            case 'mn_logout':
                break;
        }
    }
});

var _leftTab = '<div id="leftPanel"><div id="leftTab"></div><div id="topicTab" class="tab"></div><div id="tagTab" class="tab"></div><div id="listenTab" class="tab"></div><div id="searchTab" class="tab"></div></div>';
$().w2tabs({
    name: 'leftTab',
    active: 'topicTab',
    tabs: [
        { id: 'topicTab', caption: 'Topic' },
        { id: 'tagTab', caption: 'Tag' },
        { id: 'listenTab', caption: 'Listen' },
        { id: 'searchTab', caption: 'Search' },
    ],
    onRender: function (event) {
        event.onComplete = function () {
            $('#leftPanel .tab').hide();
            $('#leftPanel #topicTab').show();
        }
    },
    onClick: function (event) {
        $('#leftPanel .tab').hide();
        $('#leftPanel #' + event.target).show();
    }
});

var _mainTab = '<div id="mainPanel"><div id="mainTab"></div><div id="contentTab" class="tab"><div id="article"></div></div><div id="mediaTab" class="tab"></div><div id="grammarTab" class="tab"></div><div id="bookmarkTab" class="tab"></div></div>';
$().w2tabs({
    name: 'mainTab',
    active: 'contentTab',
    tabs: [
        { id: 'contentTab', caption: 'Article' },
        { id: 'mediaTab', caption: 'Media' },
        { id: 'grammarTab', caption: 'Grammar' },
        { id: 'bookmarkTab', caption: 'BookMark' },
    ],
    onRender: function (event) {
        event.onComplete = function () {
            $('#mainPanel .tab').hide();
            $('#mainPanel #contentTab').show();
        }
    },
    onClick: function (event) {
        $('#mainPanel .tab').hide();
        $('#mainPanel #' + event.target).show();
    }
});


var pstyle = 'border: 1px solid #dfdfdf; padding: 0px;';
$().w2layout({
    name: 'layout_main',
    panels: [
        { type: 'top', size: 29, resizable: false, style: pstyle },
        { type: 'left', size: 320, resizable: false, hidden: false, style: '', content: _leftTab },
        { type: 'main', style: pstyle + 'border-top: 0px;', content: _mainTab },
        { type: 'preview', size: '70%', resizable: true, hidden: true, style: pstyle, content: 'preview' },
        { type: 'right', size: 320, resizable: false, hidden: (m_device == 'mobile' ? true : false), style: pstyle, content: '', title: 'Note' },
        { type: 'bottom', size: '30%', resizable: false, hidden: true, style: pstyle, content: 'bottom' }
    ]
});








$().w2grid({
    name: 'grid_main',
    show: { footer: true },
    columns: [{
        field: 'text', caption: '', size: '100%'
    }],
    records: [],
    onRender: function (event) {
        event.onComplete = function () {
            $(w2ui['layout_main'].el('main')).addClass('grid2LINE');
        }
    }
});

$().w2grid({
    name: 'grid_left',
    show: {
        footer: true,
        //lineNumbers: true
    },
    //reorderRows: true,
    columns: [
        { field: 'name', caption: 'Category', size: '30%' }
    ],
    records: []
});

$().w2grid({
    name: 'grid_preview',
    show: { footer: true },
    columns: [{
        field: 'text', caption: '', size: '100%'
    }],
    records: [],
    onRender: function (event) {
        event.onComplete = function () {
            $(w2ui['layout_main'].el('preview')).addClass('grid2LINE');
        }
    }
});

function init() {

    $('#layout_main').w2render('layout_main');

    w2ui['layout_main'].on('resize', function (event) {
        if (m_ready == false) {
            m_ready = true;
            bindDataFile();
        }
    });
}

$(document).ready(function () { init(); });

function bindDataFile() {
    $('#mainTab').w2render('mainTab');
    $('#leftTab').w2render('leftTab');

    Promise.all([
        get('/tree.ashx', 'json')
    ]).then(function (rs) {
        console.clear();

        m_tree['#'] = rs[0];

        ////var cat = rs[1];
        ////var textGAM = rs[2];

        //////console.log('CAT', cat);
        //////console.log('GAM', textGAM);
        ////var gridGAM = gridGamFromText(textGAM);
        ////console.log('gridGAM', gridGAM);

        ////m_page.left.grid = cat;
        ////m_page.preview.grid = gridGAM;

        bindUI();
    })
    .catch(function (error) {
    });
}



$().w2grid({
    name: 'grid1',
    columns: [
        { field: 'fname', caption: 'First Name', size: '180px' },
        { field: 'lname', caption: 'Last Name', size: '180px' },
        { field: 'email', caption: 'Email', size: '40%' },
        { field: 'sdate', caption: 'Start Date', size: '120px' }
    ],
    records: [
        { recid: 1, fname: 'John', lname: 'Doe', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
        { recid: 2, fname: 'Stuart', lname: 'Motzart', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
        { recid: 3, fname: 'Jin', lname: 'Franson', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
        { recid: 4, fname: 'Susan', lname: 'Ottie', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
        { recid: 5, fname: 'Kelly', lname: 'Silver', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
        { recid: 6, fname: 'Francis', lname: 'Gatos', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
        { recid: 7, fname: 'Mark', lname: 'Welldo', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
        { recid: 8, fname: 'Thomas', lname: 'Bahh', email: 'jdoe@gmail.com', sdate: '4/3/2012' },
        { recid: 9, fname: 'Sergei', lname: 'Rachmaninov', email: 'jdoe@gmail.com', sdate: '4/3/2012' }
    ]
});

// w2ui['layout'].show('main');
// w2ui['grid'].toolbar.enable('delete');

function treeNodeClick(event, level, type, path, text) {
    var li = $(event.target).closest('li');
    if (li.find('ul').size() > 0) {
        li.html(event.target.outerHTML);
        return;
    }

    li.html(event.target.outerHTML);
    path = path + text;
    var url = '/tree.ashx?level=' + level + '&id=' + path;
    var requestSynchronous = new XMLHttpRequest();
    requestSynchronous.open('GET', url, false);
    requestSynchronous.send(null);
    if (requestSynchronous.status === 200) {
        var text = requestSynchronous.responseText;
        var json = JSON.parse(text);
        m_tree[path] = json;
        console.log(path, json);

        var tree = '';
        for (var i = 0; i < json.length; i++) {
            var it = json[i];
            var path = it['path'];
            var icon = it['icon'];
            var type = it['type'];
            var level = it['level'];
            var text = it['text'];
            var key = it['key'];
            var cssSPAN = '';
            switch (type) {
                case 'category':
                    if (level > 1) cssSPAN = ' class="badge badge-success" ';
                    tree += '<li>' +
                        '<span' + cssSPAN + ' onclick="treeNodeClick(event,' + level + ',\'' + type + '\',\'' + path + '\',\'' + text + '\')">' +
                        '<i class="' + icon + '"></i> ' + text + '</span></li>';
                    break;
                case 'item':
                    tree += '<li class="item">' +
                        '<span onclick="openFile(event,' + level + ',\'' + type + '\',\'' + path + '\',\'' + key + '\',\'' + text + '\')">' +
                        text + '</span></li>';
                    break;
            }
        }
        if (tree != '')
            tree = '<ul>' + tree + '</ul>';

        li.append(tree);
    }
}

function bindUI() {
    var tree = '';
    for (var i = 0; i < m_tree['#'].length; i++) {
        var it = m_tree['#'][i];
        var path = it['path'];
        var icon = it['icon'];
        var type = it['type'];
        var level = it['level'];
        var text = it['text'];
        if (type == 'category')
            tree += '<li>' +
                '<span onclick="treeNodeClick(event,' + level + ',\'' + type + '\',\'' + path + '\',\'' + text + '\')">' +
                '<i class="' + icon + '"></i> ' + text + '</span></li>';
    }
    if (tree != '')
        tree = '<div class="tree"><ul>' + tree + '</ul></div>';
    $('#topicTab').html(tree);

    ////setTimeout(function () {

    ////    $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
    ////    $('.tree li.parent_li > span').on('click', function (e) {
    ////        var children = $(this).parent('li.parent_li').find(' > ul > li');
    ////        if (children.is(":visible")) {
    ////            children.hide('fast');
    ////            $(this).attr('title', 'Expand this branch').find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
    ////        } else {
    ////            children.show('fast');
    ////            $(this).attr('title', 'Collapse this branch').find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
    ////        }
    ////        e.stopPropagation();
    ////    });
    ////}, 1000);

    //console.log(m_page.left.grid);

    w2ui['layout_main'].content('top', w2ui['toolbar_top']);
    //w2ui['layout_main'].content('left', w2ui['grid_left']);
    //w2ui['layout_main'].content('main', w2ui['grid_main']);
    //////w2ui['layout_main'].content('preview', w2ui['grid_preview']);


    ////////w2ui['grid_left'].records = m_page.left.grid;
    ////////w2ui['grid_left'].refresh();
    //////w2ui['grid_preview'].records = m_page.preview.grid;
    //////w2ui['grid_preview'].refresh();

    //////for (var i = 0 ; i < m_page.preview.grid.length; i++)
    //////    w2ui['grid_preview'].expand(i + 1);

    ////////console.log('this is ready state');
    ////////w2ui['grid_left'].expand(2);
    ////////w2ui['grid_left'].expand(3);

    ////////w2ui['grid_preview'].expand(2);

}

function openFile(event, level, type, path, key, text) {
    loading();
    setTimeout(function () { openFileBind(event, level, type, path, key, text); }, 500);
}

function openFileBind(event, level, type, path, key, text) {

    path += key;
    console.log('openFile = ', path);

    var url = '/tree.ashx?id=' + path;
    var requestSynchronous = new XMLHttpRequest();
    requestSynchronous.open('GET', url, false);
    requestSynchronous.send(null);
    if (requestSynchronous.status === 200) {
        var content = requestSynchronous.responseText;
        //console.log(textGAM);

        var fcon = '';
        if (key == 'phrase-popular.txt')
            fcon = formatPhrasePopular(content);
        else
            fcon = formatArticle(content);

        document.getElementById('article').innerHTML = fcon;

        if (m_device == 'mobile')
            w2ui['layout_main'].toggle('left', window.instant);

        //////w2ui['layout_main'].hide('preview');

        //////var gridGAM = gridGamFromText(textGAM);
        //////console.log('gridGAM', gridGAM);
        //////m_page.main.grid = gridGAM;

        ////////w2ui['layout_main'].content('preview', w2ui['grid_preview']);

        //////w2ui['grid_main'].columns = [{ field: 'text', caption: text, size: '100%' }];
        //////w2ui['grid_main'].header = text;
        //////w2ui['grid_main'].records = m_page.main.grid;
        //////w2ui['grid_main'].refresh();

        ////////var len = m_page.preview.grid.length;
        ////////for (var i = 0 ; i < len; i++) {
        ////////    if (i < len) {
        ////////        try {
        ////////            w2ui['grid_main'].expand(i + 1);
        ////////        } catch (err) { }
        ////////    }
        ////////}

        jQuery('#contentTab').scrollTop(0);

        loading(false);
    }
}


function showMessage(panel) {
    w2ui.layout.message('main', {
        width: 300,
        height: 150,
        body: '<div class="w2ui-centered">Some Text ' + (new Date()).getTime() + '</div>',
        buttons: '<button class="w2ui-btn" onclick="w2ui.layout.message(\'main\')">Ok</button>'
    })
}