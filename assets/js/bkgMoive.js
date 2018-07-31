
    var roationStatus = true;
    var phoneRotation;
    var boxNode = $('.Box');

    if (window.DeviceMotionEvent) {
        window.addEventListener("deviceorientation", orientationHandler, false);
    }


    function orientationHandler(event) {
        if (roationStatus){
            phoneRotation = {
                x : Math.round(event.gamma),
                y : Math.round(event.beta)
            }
            roationStatus = false;
        }

        var x =  Math.round(event.gamma) - phoneRotation.x;
        var y =   Math.round(event.beta) - phoneRotation.y;
        var limit = 50;

        if (x > limit) {
            x = limit
        }
        if (x < 0-limit){
            x = 0-limit
        }

        if (y > limit) {
            y = limit
        }
        if (y < 0-limit){
            y = 0-limit
        }
        boxNode.children('.bkg').children('.powder').each(function (i, el) {

            var radom  = Math.pow(0.9,i);
            x = radom * x;
            y = radom * y;
            $(el).stop().animate({'marginLeft': x + 'px','marginTop': y + 'px'}, 100)

        })
    }

    function addBKGMove(node) {
        boxNode = node;
    }

