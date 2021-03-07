jsPlumbBrowserUI.ready(function () {

    var canvas = document.getElementById("canvas");

    // setup some defaults for jsPlumb.
    var instance = jsPlumbBrowserUI.newInstance({
        endpoint: {type:"Dot", options:{radius: 2}},
        connector:"StateMachine",
        hoverPaintStyle: {stroke: "#1e8151", strokeWidth: 2 },
        connectionOverlays: [
            {
                type:"Arrow",
                options:{
                    location: 1,
                    id: "arrow",
                    length: 14,
                    foldback: 0.8
                }
            },
            { type:"Label", options:{ label: "FOO", id: "label", cssClass: "aLabel" }}
        ],
        container: canvas
    });

    instance.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });

    var windows = document.querySelectorAll(".statemachine-demo .w");

    // bind a click listener to each connection; the connection is deleted. you could of course
    // just do this: instance.bind("click", instance.deleteConnection), but I wanted to make it clear what was
    // happening.
    instance.bind("click", function (c) {
        instance.deleteConnection(c);
    });

    // bind a connection listener. note that the parameter passed to this function contains more than
    // just the new connection - see the documentation for a full list of what is included in 'info'.
    // this listener sets the connection's internal
    // id as the label overlay's text.
    instance.bind("connection", function (info) {
        info.connection.getOverlay("label").setLabel(info.connection.id);
    });

    // bind a double click listener to "canvas"; add new node when this occurs.
    instance.on(canvas, "dblclick", function(e) {
        newNode(e.offsetX, e.offsetY);
    });

    //
    // initialise element as connection targets and source.
    //
    var initNode = function(el) {

        instance.makeSource(el, {
            filter: ".ep",
            anchor: "Continuous",
            connectorStyle: { stroke: "#5c96bc", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
            connectionType:"basic",
            extract:{
                "action":"the-action"
            },
            maxConnections: 2,
            onMaxConnections: function (info, e) {
                alert("Maximum connections (" + info.maxConnections + ") reached");
            }
        });

        instance.makeTarget(el, {
            anchor: "Continuous",
            allowLoopback: true
        });
    };

    var newNode = function(x, y) {
        var d = document.createElement("div");
        var id = instance.uuid();
        d.className = "w";
        d.id = id;
        d.innerHTML = id.substring(0, 7) + "<div class=\"ep\"></div>";
        d.style.left = x + "px";
        d.style.top = y + "px";
        instance.getContainer().appendChild(d);
        initNode(d);
        return d;
    };

    // suspend drawing and initialise.
    instance.batch(function () {
        for (var i = 0; i < windows.length; i++) {
            initNode(windows[i], true);
        }
        // and finally, make a few connections
        instance.connect({ source: document.getElementById("opened"), target: document.getElementById("phone1"), type:"basic" });
        instance.connect({ source: document.getElementById("phone1"), target: document.getElementById("phone1"), type:"basic" });
        instance.connect({ source: document.getElementById("phone1"), target: document.getElementById("inperson"), type:"basic" });

        instance.connect({
            source:document.getElementById("phone2"),
            target:document.getElementById("rejected"),
            type:"basic"
        });
    });

});
