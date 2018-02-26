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
    

$(document).ready(function () {
    var pstyle = 'border: 1px solid #dfdfdf; padding: 0px;';
    $('#main').w2layout({
        name: 'layout_main',
        panels: [
            {
                type: 'top', size: 36, resizable: false, style: pstyle,
                toolbar: {
                    style: 'background-color: #ccc !important;',
                    items: [
                        { type: 'check', id: 'mn_aricle', caption: 'Article', icon: 'fa fa-th', checked: true },
                        { type: 'check', id: 'mn_photo', caption: 'Photo', icon: 'fa fa-image', checked: false },
                        { type: 'spacer' },
                        { type: 'check', id: 'mn_update', caption: 'Update', icon: 'fa fa-floppy-o', checked: false },
                        { type: 'check', id: 'mn_history', caption: 'History', icon: 'fa fa-history', checked: false },
                        {
                            type: 'menu', id: 'item2', caption: '', icon: 'fa fa-user-o', items: [
                              { id: 'mn_setting', text: 'Setting', icon: 'fa fa-wrench' },
                              { id: 'mn_change_pass', text: 'Change password', icon: 'fa fa-key' },
                              { id: 'mn_logout', text: 'LogOut', icon: 'fa fa-power-off' },
                            ]
                        }
                    ],
                    onClick: function (event) {
                        var id = event.target;
                        if (id.indexOf(':') != -1) id = id.substring(id.indexOf(':') + 1, id.length);
                        console.log(id, event);
                        var check = false;
                        switch (id) {
                            case 'mn_aricle':
                                check = event.item.checked;
                                w2ui['layout_main'].toggle('left', window.instant);
                                break;
                            case 'mn_photo':
                                check = event.item.checked;
                                w2ui['layout_main'].toggle('bottom', window.instant);
                                break;
                            case 'mn_setting':
                                break;
                            case 'mn_change_pass':
                                break;
                            case 'mn_logout':
                                break;
                        }
                    }
                }
            },
            {
                type: 'left', size: 320, resizable: false, hidden: false, style: pstyle, content: 'left',
                toolbar: {
                    style: 'background-color: whitesmoke !important;',
                    items: [
                         {
                             type: 'html', id: 'item5',
                             html: function (item) {
                                 var html =
                                   '<div style="padding: 3px 0 3px 0px;">' +
                                   '<input placeholder="Article" size="10" style="padding: 3px; border-radius: 2px; border: 1px solid silver" value=""/>' +
                                   '</div>';
                                 return html;
                             }
                         },
                        { type: 'check', id: 'mn_search', caption: '', icon: 'fa fa-search', checked: false },
                        { type: 'spacer' },
                        { type: 'check', id: 'mn_photo', caption: '', icon: 'fa fa-plus-circle', checked: false },
                        { type: 'check', id: 'mn_aricle', caption: '', icon: 'fa fa-trash', checked: false },
                        {
                            type: 'menu', id: 'item2', caption: '', icon: '', items: [
                              { id: 'mn_setting', text: 'Setting', icon: 'fa fa-wrench' },
                              { id: 'mn_change_pass', text: 'Change password', icon: 'fa fa-key' },
                              { id: 'mn_logout', text: 'LogOut', icon: 'fa fa-power-off' },
                            ]
                        }
                    ],
                    onClick: function (event) {
                        var id = event.target;
                        if (id.indexOf(':') != -1) id = id.substring(id.indexOf(':') + 1, id.length);
                        console.log(id, event);
                        var check = false;
                        switch (id) {
                            case 'mn_aricle':
                                check = event.item.checked;
                                w2ui['layout_main'].toggle('left', window.instant);
                                break;
                            case 'mn_photo':
                                check = event.item.checked;
                                w2ui['layout_main'].toggle('bottom', window.instant);
                                break;
                            case 'mn_setting':
                                break;
                            case 'mn_change_pass':
                                break;
                            case 'mn_logout':
                                break;
                        }
                    }
                }
            },
            { type: 'main', style: pstyle + 'border-top: 0px;', content: 'main' },
            {
                type: 'right', size: 250, resizable: false, style: pstyle, content: 'right',
                toolbar: {
                    style: 'background-color: whitesmoke !important;',
                    items: [
                         {
                             type: 'html', id: 'item5',
                             html: function (item) {
                                 var html =
                                   '<div style="padding: 3px 0 3px 0px;">' +
                                   '<input placeholder="History" size="10" style="padding: 3px; border-radius: 2px; border: 1px solid silver" value=""/>' +
                                   '</div>';
                                 return html;
                             }
                         },
                        { type: 'check', id: 'mn_search', caption: '', icon: 'fa fa-search', checked: false },
                        { type: 'spacer' },
                        { type: 'check', id: 'mn_photo', caption: '', icon: 'fa fa-plus-circle', checked: false },
                        { type: 'check', id: 'mn_aricle', caption: '', icon: 'fa fa-trash', checked: false },
                        {
                            type: 'menu', id: 'item2', caption: '', icon: '', items: [
                              { id: 'mn_setting', text: 'Setting', icon: 'fa fa-wrench' },
                              { id: 'mn_change_pass', text: 'Change password', icon: 'fa fa-key' },
                              { id: 'mn_logout', text: 'LogOut', icon: 'fa fa-power-off' },
                            ]
                        }
                    ],
                    onClick: function (event) {
                        var id = event.target;
                        if (id.indexOf(':') != -1) id = id.substring(id.indexOf(':') + 1, id.length);
                        console.log(id, event);
                        var check = false;
                        switch (id) {
                            case 'mn_aricle':
                                check = event.item.checked;
                                w2ui['layout_main'].toggle('left', window.instant);
                                break;
                            case 'mn_photo':
                                check = event.item.checked;
                                w2ui['layout_main'].toggle('bottom', window.instant);
                                break;
                            case 'mn_setting':
                                break;
                            case 'mn_change_pass':
                                break;
                            case 'mn_logout':
                                break;
                        }
                    }
                }
            },
            {
                type: 'bottom', size: '30%', resizable: false, hidden: true, style: pstyle, content: 'bottom',
                toolbar: {
                    style: 'background-color: whitesmoke !important;',
                    items: [
                         {
                             type: 'html', id: 'item5',
                             html: function (item) {
                                 var html =
                                   '<div style="padding: 3px 0 3px 0px;">' +
                                   '<input placeholder="Photo" size="10" style="padding: 3px; border-radius: 2px; border: 1px solid silver" value=""/>' +
                                   '</div>';
                                 return html;
                             }
                         },
                        { type: 'check', id: 'mn_search', caption: '', icon: 'fa fa-search', checked: false },
                        { type: 'spacer' },
                        { type: 'check', id: 'mn_photo', caption: '', icon: 'fa fa-plus-circle', checked: false },
                        { type: 'check', id: 'mn_aricle', caption: '', icon: 'fa fa-trash', checked: false } 
                    ],
                    onClick: function (event) {
                        var id = event.target;
                        if (id.indexOf(':') != -1) id = id.substring(id.indexOf(':') + 1, id.length);
                        console.log(id, event);
                        var check = false;
                        switch (id) {
                            case 'mn_aricle':
                                check = event.item.checked;
                                w2ui['layout_main'].toggle('left', window.instant);
                                break;
                            case 'mn_photo':
                                check = event.item.checked;
                                w2ui['layout_main'].toggle('bottom', window.instant);
                                break;
                            case 'mn_setting':
                                break;
                            case 'mn_change_pass':
                                break;
                            case 'mn_logout':
                                break;
                        }
                    }
                }
            }
        ],
        onContent: function (event) {
            console.log('content changed for ' + event.panel);

            event.onComplete = function(ev){
                console.log('w2ui layout panel ' + ev.target + ' finished content loading');
            };
        },
        onRender: function (event) {
            console.log('onRender = ', event);
            //event.preventDefault();
            event.onComplete = function () {
                //w2ui['layout_main'].toggle('left', window.instant);
            }
        }
    });
});



function showMessage(panel) {
    w2ui.layout.message('main', {
        width: 300,
        height: 150,
        body: '<div class="w2ui-centered">Some Text ' + (new Date()).getTime() + '</div>',
        buttons: '<button class="w2ui-btn" onclick="w2ui.layout.message(\'main\')">Ok</button>'
    })
}