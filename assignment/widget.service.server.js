var app = require("../express");

var widgets = [
    { "_id": "123", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "GIZMODO"},
    { "_id": "234", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
    { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%",
        "url": "http://lorempixel.com/400/200/"},
    { "_id": "456", "widgetType": "HTML", "pageId": "321", "text": "<p>Three years late and costing $12.9 billion, the USS Gerald R. Ford finally gets commissioned today at Norfolk Naval Station in Virginia. The latest aircraft carrier to join the American fleet has been burdened with—and this may shock you, considering we are talking about defense spending—cost overruns and significant…</p>"},
    { "_id": "567", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "Lorem ipsum"},
    { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%",
        "url": "https://youtu.be/AM2Ivdi9c4E" },
    { "_id": "789", "widgetType": "HTML", "pageId": "321", "text": "<p>Lorem ipsum</p>"}
];

app.get("/api/user/:userId/website/:websiteId/page/:pageId/widget", findWidgetsByPageId);
app.post("/api/user/:userId/website/:websiteId/page/:pageId/widget", createWidget);
app.get("/api/user/:userId/website/:websiteId/page/:pageId/widget/:widgetId", getWidgetTypeById);
app.delete("/api/user/:userId/website/:websiteId/page/:pageId/widget/:widgetId", deleteWidget);
app.put("/api/user/:userId/website/:websiteId/page/:pageId/widget/:widgetId", updateWidget);
app.put("/api/directives/widgets", updateWidgets);

function updateWidgets(req, res){
    var initial = req.query.initial;
    var final = req.query.final;
    widgets.splice(final, 0, widgets.splice(initial, 1)[0]);
    res.sendStatus(200);
    return;
}


var multer = require('multer'); // npm install multer --save
var upload = multer({ dest: __dirname+'/../public/uploads' });

app.post ("/api/upload", upload.single('myFile'), uploadImage);

function uploadImage(req, res) {

    var widgetId      = req.body.widgetId;
    var width         = req.body.width;
    var myFile        = req.file;

    var userId = req.body.userId;
    var websiteId = req.body.websiteId;
    var pageId = req.body.pageId;

    var originalname  = myFile.originalname; // file name on user's computer
    var filename      = myFile.filename;     // new file name in upload folder
    var path          = myFile.path;         // full path of uploaded file
    var destination   = myFile.destination;  // folder where file is saved to
    var size          = myFile.size;
    var mimetype      = myFile.mimetype;

    widget = getWidgetById(widgetId);
    widget.url = '/uploads/'+filename;

    var callbackUrl   = "/assignment/index.html#!/user/"+userId+"/website/"+websiteId+"/page/"+pageId+"/widget/"+widgetId;

    res.redirect(callbackUrl);
}

function getWidgetById(widgetId){
    for(var w in widgets){
        if(widgets[w]._id === widgetId){
            return widgets[w];
        }
    }
    return null;
}

function updateWidget(req, res){
    var widgetId = req.params.widgetId;
    var widget = req.body;
    for(var w in widgets){
        if(widgets[w]._id == widgetId){
            widgets[w].widgetType = widget.widgetType;
            widgets[w].text = widget.text;
            widgets[w].size = widget.size;
            widgets[w].width = widget.width;
            widgets[w].url = widget.url;
            res.send(widgets);
            return;
        }
    }
}

function    deleteWidget(req, res){
    var widgetId = req.params.widgetId;
    var widget = widgets.find(function (widget){
        return widget._id === widgetId;
    });
    var index = widgets.indexOf(widget);
    widgets.splice(index, 1);
    res.send(widgets);
    return;
}

function getWidgetTypeById(req, res){
    var widgetId = req.params.widgetId;
    for(var w in widgets){
        if(widgets[w]._id === widgetId){
            res.send(widgets[w]);
            return;
        }
    }
}

function createWidget(req, res){
    var widget = req.body;
    widgets.push(widget);
    res.send(widgets);
    return;
}


function findWidgetsByPageId(req, res){
    var pageId = req.params.pageId;
    var _widgets = [];

    for(var w in widgets){
        if(widgets[w].pageId === pageId){
            if(widgets[w].widgetType == "HEADING"){
                if(!(widgets[w].text == null && widgets[w].size == null)){
                    _widgets.push(widgets[w]);

                }
            }else if((widgets[w].widgetType == "IMAGE") || (widgets[w].widgetType == "YOUTUBE")){
                if(!(widgets[w].width == null && widgets[w].url == null)){
                    _widgets.push(widgets[w]);

                }
            }else if(widgets[w].widgetType == "HTML"){
                _widgets.push(widgets[w]);
            }
        }
    }
    res.send(_widgets);
    return;
}