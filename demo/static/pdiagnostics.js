function Init() {
}

Init();

// jQuery.get('/static/data', function(data) {
//     debugger;
// });

let dataPrefix = '/static/data/';
let imageOriPrefix = dataPrefix + 'image_ori/';
var oriImages = [];
var newImages = [];
// var image = {
//     img: "",
//     name: "",
//     section: -1,
//     route: -1,
//     date: "",
//     platform: -1,
//     size: "",
//     state: ""
// };

$.ajax({
    url: dataPrefix + "image_ori/list.txt",
    success: function(data) {
        var names = data.trim().split('\n');
        for (i in names) {
            getImageMeta(names[i]);
        }
    }
});

function getImageMeta(name) {
    var meta = name.split('.')[0] + '.meta.txt';
    $.ajax({
        url: imageOriPrefix + meta,
        success: function(data) {
            oriImages.push({
                img: imageOriPrefix + name,
                name: name,
                state: data.trim()
            })
            addRow([1, '<img src="' + imageOriPrefix + name + '">', name, -1, -1, 2018-10-12, -1, '100X200', data.trim()])
        },
    });
}

function addRow(data) {
    var t = $('#datatable').DataTable();
    t.row.add(data).draw(false);
}

function initDatatable() {
    var table = $('#datatable').DataTable( {
        columnDefs: [
            { sortable: false, "class": "index", targets: 0 },
            { sortable: false, targets: 1 }
        ],
        order: [[ 2, 'asc' ]]
    } );

    table.on( 'order.dt search.dt', function () {
        table.column(0, {search:'applied', order:'applied'}).nodes().each( function (cell, i) {
            cell.innerHTML = i+1;
        } );
    } ).draw();
}

initDatatable();



// var skins = {
//   'Snapgram': {
//     'avatars': true,
//     'list': false,
//     'autoFullScreen': false,
//     'cubeEffect': true
//   },
//
//   'VemDeZAP': {
//     'avatars': false,
//     'list': true,
//     'autoFullScreen': false,
//     'cubeEffect': true
//   },
//
//   'FaceSnap': {
//     'avatars': true,
//     'list': false,
//     'autoFullScreen': true,
//     'cubeEffect': false
//   },
//
//   'Snapssenger': {
//     'avatars': false,
//     'list': false,
//     'autoFullScreen': true,
//     'cubeEffect': true
//   }
// };
//
// function makeRequest() {
//     var req = new XMLHttpRequest();
//     req.open('GET', 'http://10.120.14.71:7777/recommend?user=u000bcf23be9507f403cf7c514bd3cafa&n=20', true);
//     req.onreadystatechange = function (aEvt) {
//         if (req.readyState == 4) {
//             if(req.status == 200) {
//                 var contents = JSON.parse(req.responseText);
//                 var storiesContents = createStoriesContent(contents);
//                 skin = 'VemDeZAP';
//                 var stories = new Zuck('stories', {
//                   backNative: true,
//                   previousTap: true,
//                   autoFullScreen: skins[skin]['autoFullScreen'],
//                   skin: skin,
//                   avatars: skins[skin]['avatars'],
//                   list: skins[skin]['list'],
//                   cubeEffect: skins[skin]['cubeEffect'],
//                   localStorage: false,
//                   stories: storiesContents});
//
//                 // fillCardList(contents);
//
//                 document.body.style.display = 'block';
//             }
//             else
//                 dump("Error loading page\n");
//         }
//     };
//     req.send(null);
// }
//
//
// function buildCard(content) {
//     var src = content["img"],
//         title = content["title"],
//         cp = content["cp"],
//         time = timeAgo(content["created_at"]);
//
//     var card = document.createElement('div');
//     card.className = "card";
//
//     card.innerHTML = '<img src="' + src + '" alt="picture">'
//         + '<div class="text-container">'
//         + '<div class="title">' + title + '</div>'
//         + '<div class="meta">'
//         + '<p class="cp">' + cp + '</p>'
//         + '<p class="time">' + time + '</p>'
//         + '</div></div>';
//
//     $(card).animatedModal({
//         modalTarget:'animatedModal',
//         modalTarget:'animatedModal',
//         animatedIn:'bounceInUp',
//         animatedOut:'bounceOutDown',
//         color: '#EFEFEF',
//         animationDuration: '.8s',
//         beforeOpen: function() {
//             $('#animatedModal .modal-title').text(title);
//             $('#animatedModal .modal-img').attr("src", src);
//             $('#animatedModal .modal-text').html(buildModalBody(content));
//         }
//     });
//
//     return card;
// }
//
// function buildModalBody(content) {
//     var texts = parseBody(content["body"], content["img"])[0];
//     var html = "";
//     texts.forEach(function buildBody(p, idx, array) {
//         html += "<p>" + p + "</p>"
//     })
//     return html;
// }
//
//
// function fillCardList(contents) {
//     var container = document.querySelectorAll('#card-container')[0];
//     contents.forEach(function fill(content, idx, array) {
//         container.appendChild(buildCard(content));
//     });
// }
//
//
// function createStoriesContent(contents) {
//     var stories = [];
//     contents.forEach(function parseContent(content, idx, array) {
//         var tmp = parseBody(content["body"], content["img"]),
//             bTexts = tmp[0],
//             bImgs = tmp[1];
//
//         stories.push({
//             id: "story-" + String(idx),
//             photo: content["img"],
//             name: String(content["title"]),
//             cp: content["cp"],
//             link: "",
//             lastUpdated: content["created_at"],
//             items: createItems(bTexts, bImgs, String(content["title"]).slice(0, 5), content["created_at"])
//         });
//     });
//
//     return stories;
// }
//
// function createItems(texts, imgs, name, timestamp) {
//     var items = [];
//
//     let imgs_num = imgs.length;
//     texts.forEach(function addItem(t, idx, array) {
//         items.push(
//             buildItem(name + "-" + String(idx), "photo", 3, imgs[idx%imgs_num], t, imgs[idx%imgs_num], "", false, false, timestamp)
//         );
//     });
//
//     return items;
// }
//
// function parseBody(body, default_img) {
//     var texts = [];
//     var imgs = [default_img];
//
//     body = JSON.parse(body);
//     body.forEach(function parseBody(comp, idx, array) {
//         if (comp["type"] == "text"){
//             comp["text"].split("\n").forEach(function tmp(t, i, a) {
//                 if (t.length != 0)
//                     texts.push(t);
//             });
//         }
//         else if (comp["type"] == "image" || comp["type"] == "youtube")
//             imgs.push(comp["image_url"]);
//     });
//
//     return [texts, imgs];
// }
//
// function buildItem(id, type, length, src, text, preview, link, linkText, seen, time){
//   return {
//     "id": id,
//     "type": type,
//     "length": length,
//     "src": src,
//     "text": text,
//     "preview": preview,
//     "link": link,
//     "linkText": linkText,
//     "seen": seen,
//     "time": time};
// }
//
// var initDemo = function(){
//     makeRequest();
// };
//
// initDemo();
