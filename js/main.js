var spartan = {};

(function($){
    var imgWidth, imgHeight;

    spartan.init = function(){
        spartan.image = $('.cropper');

        $('.instruction1 .cta').on('click', spartan.selectImage);
        $('#image_upload_form').submit(spartan.uploadImage);

        $('.instruction2 .cancel').on('click', spartan.cancelCropImage);
        $('.instruction2 .next').on('click', function(){ $('#image_crop_form').submit(); });
        $('#image_crop_form').submit(spartan.cropImage);

        $('.instruction3 .cancel').on('click', spartan.cancelWriteImage);
        $('.instruction3 .next').on('click', spartan.writeImage);

        $('.instruction4 .cancel').on('click', spartan.cancelEraseImage);
        $('.instruction4 .next').on('click', function(){ $('#erase_image_form').submit(); });
        $('.instruction4 .clear').on('click', spartan.eraseClear);
        $('#erase_image_form').submit(spartan.eraseImage);

        var container = $('.image-border').get(0);
        var hammer = Hammer(container, {
            swipe: false,
            hold: false
        }).on('drag', spartan.dragImage);

        hammer.on('release', spartan.releaseImage);

        $('.zoomIn').on('click', spartan.zoomIn);
        $('.zoomOut').on('click', spartan.zoomOut);

        $(document).on('touchmove',function(evt){
            evt.preventDefault();
        });

        $('.writing-text input').on('touchstart touchmove touchend', function(evt){
            evt.stopPropagation();
        });

        $('#file').change(function() { 
            $('#image_upload_form').submit(); 
        });

        spartan.canvas = $('#erase_canvas').get(0);
        spartan.ctx = spartan.canvas.getContext('2d');
        spartan.ctx.fillStyle = '#B71D35';

        spartan.canvasOverlay = $('#erase_canvas_overlay').get(0);
        spartan.ctxOverlay = spartan.canvasOverlay.getContext('2d');
        spartan.ctxOverlay.globalAlpha = .6;
        spartan.ctxOverlay.fillStyle = '#B71D35';

        $('#erase_canvas_overlay').on('mousedown mousemove touchstart touchmove', spartan.erase);
        $('.container').on('mousemove mouseup', spartan.eraseStop);
    };

    spartan.selectImage = function(){
        $('#file').click();
    };

    spartan.uploadImage = function(){
        if(spartan.processing){
            return;
        }

        spartan.processing = true;

        $('#upload_iframe').unbind().load(function(){
            var img = $('#upload_iframe').contents().find('body').html();
            
            if(img.indexOf('uperror') < 0){
                $('#image_crop_form').find('.img_src').attr('value', img);

                spartan.image.css({width: '', height: '', marginLeft: '', marginTop: ''});
                spartan.image.attr('src', img).unbind().load(function(){
                    spartan.processing = false;

                    var $this = $(this).show(),
                        $parent = $this.parent();

                    var height = $this.height(),
                        width = $this.width(),
                        ratio = width / height,
                        data = {},
                        aspectRatio = 1;

                    $('.instruction2').show().siblings().hide();
                    $('.cropped-image').hide();
                    $('.overlay').show();
                    $('.image-overlay').show();

                    imgWidth = $parent.width();
                    imgHeight = $parent.height();

                    spartan.originalHeight = height;
                    spartan.originalWidth = width;
                    spartan.imageRatio = ratio;

                    if(ratio < aspectRatio) {
                        var newWidth = imgWidth*1.1;

                        $this.width(newWidth).css({
                            marginLeft : -newWidth * 0.05,
                            marginTop : -newWidth*(aspectRatio/ratio - 1)/2,
                        });

                        spartan.imageWidth = newWidth;
                        spartan.imageHeight = newWidth*aspectRatio/ratio;
                    } else {
                        var newHeight = imgHeight*1.1;

                        $this.height(newHeight).css({
                            marginTop : -newHeight * 0.05,
                            marginLeft : -newHeight*(ratio/aspectRatio - 1)/2,
                        });

                        spartan.imageWidth = newHeight*ratio/aspectRatio;
                        spartan.imageHeight = newHeight;
                    }

                    $this.css({ top: '', left: '' });
                    $('.controls').show();
                });

                $('.image-border').addClass('crop');
            }
            else{
                // error output
                spartan.processing = false;
                spartan.cancelCropImage();
            }
            
            $('#image_upload_form').find('#file').val('');
        });
    };

    spartan.cancelCropImage = function(evt){
        if(spartan.processing){
            return false;
        }

        $('.image-border').removeClass('crop');
        $('.instruction1').show().siblings().hide();
        $('.controls').hide();
        $('.overlay').hide();
        $('.image-overlay').hide();

        spartan.image.hide();

        return false;
    };

    spartan.dragImage = function(evt){
        if($(this).hasClass('crop')){
            var params = evt.gesture;

            var marginLeft = parseInt(spartan.image.css('marginLeft'), 10);
            var minX = -(spartan.imageWidth-imgWidth)-marginLeft;
            var maxX = -marginLeft;

            var marginTop = parseInt(spartan.image.css('marginTop'), 10);
            var minY = -(spartan.imageHeight-imgHeight)-marginTop;
            var maxY = -marginTop;

            spartan.image.css({
                left: Math.min(Math.max(params.deltaX, minX), maxX),
                top: Math.min(Math.max(params.deltaY, minY), maxY)
            });
        }
    };

    spartan.releaseImage = function(evt){
        if($(this).hasClass('crop')){
            spartan.image.css({
                marginLeft: '+=' + parseInt(spartan.image.css('left'), 10),
                marginTop: '+=' + parseInt(spartan.image.css('top'), 10),
                top: '',
                left: ''
            });
        }
    };

    spartan.zoomIn = function(evt){
        var scale = (evt.gesture && evt.gesture.scale ? evt.gesture.scale : 1.05);

        spartan.imageHeight = spartan.image.height()*scale;
        spartan.imageWidth = spartan.image.width()*scale;

        spartan.image.css({
            height: spartan.imageHeight,
            width: spartan.imageWidth
        });
    };

    spartan.zoomOut = function(evt){
        var scale = (evt.gesture && evt.gesture.scale ? evt.gesture.scale : 1.05);

        spartan.imageHeight = Math.max(spartan.image.height()/scale, imgHeight);
        spartan.imageWidth = Math.max(spartan.image.width()/scale, imgWidth);

        if(spartan.imageHeight == imgHeight){
            spartan.imageWidth = imgHeight * spartan.imageRatio;
        } else if(spartan.imageWidth == imgWidth) {
            spartan.imageHeight = imgWidth / spartan.imageRatio;
        }

        var marginLeft = parseInt(spartan.image.css('marginLeft'), 10);
        var minX = -(spartan.imageWidth-imgWidth);
        var maxX = 0;

        var marginTop = parseInt(spartan.image.css('marginTop'), 10);
        var minY = -(spartan.imageHeight-imgHeight);
        var maxY = 0;

        spartan.image.css({
            height: spartan.imageHeight,
            width: spartan.imageWidth,
            marginLeft: Math.min(Math.max(marginLeft, minX), maxX),
            marginTop: Math.min(Math.max(marginTop, minY), maxY)
        });
    };

    spartan.cropImage = function(){
        if(spartan.processing){
            return;
        }

        var image_crop_form = $('#image_crop_form');
        var scale = spartan.originalWidth / spartan.imageWidth;
        image_crop_form.find('.x1').val(-parseInt(spartan.image.css('marginLeft'), 10)*scale);
        image_crop_form.find('.y1').val(-parseInt(spartan.image.css('marginTop'), 10)*scale);
        image_crop_form.find('.width').val(imgWidth * scale);
        image_crop_form.find('.height').val(imgHeight * scale);

        $('.image-border').removeClass('crop');
        $('.controls').hide();

        spartan.processing = true;

        $('#upload_iframe').unbind().load(function(){
            var img = $('#upload_iframe').contents().find('body').html();

            if(img.indexOf('uperror') < 0){
                $('#erase_image_form').find('.img_src').attr('value', img);

                $('.cropped-image').attr('src', img).unbind().load(function(){
                    spartan.processing = false;

                    $('.instruction3').show().siblings().hide();
                    $('.writing-text').show();
                    $('.overlay').hide();
                    spartan.image.hide();
                    $('.image-overlay').hide();

                    var $this = $(this);
                    $this.show();
                });

                // we have to remove the values
                image_crop_form.find('.width, .height, .x1, .y1').val('');
            } else{
                // error output
                spartan.processing = false;
                spartan.cancelWriteImage();
            }               
        });
    };

    spartan.cancelWriteImage = function(evt){
        if(spartan.processing){
            return false;
        }

        $('.writing-text').hide().children().val('');
        $('.cropped-image').hide();
        $('.image-border').addClass('crop');
        $('.controls').show();
        $('.instruction2').show().siblings().hide();
        $('.image-overlay').show();

        spartan.image.show();

        return false;
    };

    spartan.writeImage = function(){
        if($('.write1').val() != ''){
            spartan.eraseShow();
        } else {
            spartan.showDownload();
        }

        return false;
    };

    spartan.cancelEraseImage = function(evt){
        if(spartan.processing){
            return false;
        }

        $('.writing-text').show();
        $('#erase_canvas, #erase_canvas_overlay').hide();
        $('.instruction3').show().siblings().hide();

        return false;
    };

    spartan.eraseShow = function(){
        spartan.canvas.width = $('.sub-container').width();
        spartan.canvas.height = $('.sub-container').height();
        spartan.canvasOverlay.width = $('.sub-container').width();
        spartan.canvasOverlay.height = $('.sub-container').height();

        spartan.ctx.fillStyle = '#B71D35';

        spartan.ctxOverlay.globalAlpha = .6;
        spartan.ctxOverlay.fillStyle = '#B71D35';
        spartan.ctxOverlay.strokeStyle = '#FFFFFF';

        spartan.ctx.clearRect(0, 0, spartan.canvas.width, spartan.canvas.height);
        spartan.ctxOverlay.clearRect(0, 0, spartan.canvasOverlay.width, spartan.canvasOverlay.height);

        $('.instruction4').show().siblings().hide();
        $('#erase_canvas, #erase_canvas_overlay').show();
        spartan.eraseData = [];
    };

    spartan.erase = function(evt){
        var x, y, touch, canvasOffset = $('#erase_canvas_overlay').offset();

        if(evt.type != 'mousemove'){
            spartan.erasing = true;
        }

        if(evt.type.indexOf('mouse') >= 0) {
            x = evt.offsetX;
            y = evt.offsetY;
        } else {
            touch = evt.originalEvent.touches[0];
            x = touch.pageX - canvasOffset.left;
            y = touch.pageY - canvasOffset.top;
        }

        var ratio = 600/spartan.canvas.width;
        var brushSize = 10;
        
        if(spartan.erasing){
            spartan.ctx.beginPath();
            spartan.ctx.arc(x, y, brushSize/ratio, 0, Math.PI*2);
            spartan.ctx.fill();

            spartan.eraseData.push({ x:x*ratio, y:y*ratio });
        } 

        if(evt.type == 'mousemove') {
            spartan.ctxOverlay.clearRect(0, 0, spartan.canvasOverlay.width, spartan.canvasOverlay.height);
            spartan.ctxOverlay.beginPath();
            spartan.ctxOverlay.arc(x, y, brushSize/ratio, 0, Math.PI*2);
            spartan.ctxOverlay.fill();
            spartan.ctxOverlay.stroke();
        }

        evt.stopPropagation();
        return false;
    };

    spartan.eraseStop = function(){
        spartan.ctxOverlay.clearRect(0, 0, spartan.canvasOverlay.width, spartan.canvasOverlay.height);
        spartan.erasing = false;
    };

    spartan.eraseClear = function(){
        if(spartan.processing){
            return;
        }

        spartan.ctx.clearRect(0, 0, spartan.canvas.width, spartan.canvas.height);
        spartan.eraseData = [];
    };

    spartan.eraseImage = function(){
        if(spartan.processing){
            return;
        }

        var image_erase_form = $('#erase_image_form');
        image_erase_form.find('.text1').val($('.write1').val());
        image_erase_form.find('.values').val(JSON.stringify(spartan.eraseData));

        spartan.processing = true;

        $('#upload_iframe').unbind().load(function(){
            var img = $('#upload_iframe').contents().find('body').html();

            if(img.indexOf('uperror') < 0){
                spartan.processing = false;
                $('.cropped-image').attr('src', img).unbind();
                spartan.showDownload();
            } else{
                // error output
                spartan.processing = false;
                $('.instruction4').show().siblings().hide();
            }               
            
            // we have to remove the values
            image_erase_form.find('.values').val('');
        });
    };

    spartan.showDownload = function(img){
        $('.instruction5').show().siblings().hide();
        $('#erase_canvas, #erase_canvas_overlay').hide();
        $('.writing-text').hide();
        $('.download-file').attr('href', $('.cropped-image').attr('src'));
        $('.title').addClass('end');
    };

    spartan.startOver = function(){
        $('.title').removeClass('end');

        spartan.cancelWriteImage();
        spartan.cancelCropImage();

        return false;
    };

    // Start of application
    $(function(){
        spartan.init();
    });
}(jQuery));