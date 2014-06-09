var spartan = {};

(function($){
    var imgWidth, imgHeight;

    spartan.init = function(){
        spartan.image = $('.cropper');

        $('#image_upload_form').submit(spartan.uploadImage);
        $('#image_crop_form .cancel').on('click', spartan.cancelCropImage);
        $('#image_crop_form').submit(spartan.cropImage);
        $('#write_image_form .cancel').on('click', spartan.cancelWriteImage);
        $('#write_image_form').submit(spartan.writeImage);
        $('#erase_image_form .cancel').on('click', spartan.cancelEraseImage);
        $('#erase_image_form').submit(spartan.eraseImage);
        $('.start-over').on('click', spartan.startOver);

        var container = $('.image-border').get(0);
        var hammer = Hammer(container, {
            swipe: false,
            hold: false
        }).on('drag', spartan.dragImage);

        hammer.on('touch', spartan.selectImage);
        hammer.on('release', spartan.releaseImage);

        $('.zoomIn').on('click', spartan.zoomIn);
        $('.zoomOut').on('click', spartan.zoomOut);

        $('.sub-container').on('touchstart touchmove touchend', function(){
            return false;
        });

        $('#file').change(function() { 
            $('#image_upload_form').submit(); 
        });

        spartan.canvas = $('#erase_canvas').get(0);
        spartan.ctx = spartan.canvas.getContext('2d');
        //spartan.ctx.globalAlpha = .6;
        spartan.ctx.fillStyle = '#B71D35';

        spartan.canvasOverlay = $('#erase_canvas_overlay').get(0);
        spartan.ctxOverlay = spartan.canvasOverlay.getContext('2d');
        spartan.ctxOverlay.globalAlpha = .6;
        spartan.ctxOverlay.fillStyle = '#B71D35';

        $('#erase_canvas_overlay').on('mousedown mousemove touchstart touchmove', spartan.erase);
        $('.container').on('mousemove mouseup', spartan.eraseStop);
    };

    spartan.selectImage = function(){
        if($(this).hasClass('upload')){
            $('#file').click();
        }
    };

    spartan.uploadImage = function(){
        $('.image-border').removeClass('upload').html('Uploading...');

        $('#upload_iframe').unbind().load(function(){
            var img = $('#upload_iframe').contents().find('body').html();
            
            if(img.indexOf('uperror') < 0){
                $('#image_crop_form').show().find('.img_src').attr('value', img);

                $('.cropped-image').hide();

                spartan.image.css({width: '', height: '', marginLeft: '', marginTop: ''});
                spartan.image.attr('src', img).unbind().load(function(){
                    var $this = $(this).show(),
                        $parent = $this.parent();

                    var height = $this.height(),
                        width = $this.width(),
                        ratio = width / height,
                        data = {},
                        aspectRatio = 1;

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

                $('.image-border').addClass('crop').html('Crop');
            }
            else{
                // error output
                spartan.cancelCropImage();  
            }
            
            // we have to remove the values
            $('#image_upload_form').find('#file').val('');
        });
    };

    spartan.cancelCropImage = function(evt){
        $('.image-border').addClass('upload').html('Click to Upload');
        $('#image_crop_form').hide()
        $('.controls').hide();

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
        //} else if($(this).hasClass('erase')){
        } else {
            spartan.erase(evt);
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
        var image_crop_form = $('#image_crop_form');
        var scale = spartan.originalWidth / spartan.imageWidth;
        image_crop_form.find('.x1').val(-parseInt(spartan.image.css('marginLeft'), 10)*scale);
        image_crop_form.find('.y1').val(-parseInt(spartan.image.css('marginTop'), 10)*scale);
        image_crop_form.find('.width').val(imgWidth * scale);
        image_crop_form.find('.height').val(imgHeight * scale);

        image_crop_form.hide();
        $('.image-border').removeClass('crop');

        $('#upload_iframe').unbind().load(function(){
            var img = $('#upload_iframe').contents().find('body').html();

            if(img.indexOf('uperror') < 0){
                $('#erase_image_form').find('.img_src').attr('value', img);
                $('#write_image_form').show();

                $('.writing-text').show();
                $('.image-border').html('');

                //done cropping
                spartan.image.hide();
                $('.controls').hide();

                $('.cropped-image').attr('src', img).unbind().load(function(){
                    var $this = $(this);
                    $this.show();
                });

                // we have to remove the values
                image_crop_form.find('.width, .height, .x1, .y1').val('');
            } else{
                // error output
                spartan.cancelWriteImage();
            }               
        });
    };

    spartan.cancelWriteImage = function(evt){
        $('.writing-text').hide().children().val('');
        $('.cropped-image').hide();
        $('#write_image_form').hide()
        $('.image-border').addClass('crop');
        $('#image_crop_form').show();
        $('.controls').show();

        spartan.image.show();

        return false;
    };

    spartan.writeImage = function(){
        var image_write_form = $('#write_image_form');
        // image_write_form.find('.text1').val($('.title1').val());
        // image_write_form.find('.text2').val($('.title2').val());
        image_write_form.hide();

        // $('#upload_iframe').unbind().load(function(){
        //     var img = $('#upload_iframe').contents().find('body').html();

        //     if(img.indexOf('uperror') < 0){
        //         $('#erase_image_form').show().find('.img_src').attr('value', img);

        //         spartan.eraseShow();
        //         spartan.oldImg = $('.cropped-image').attr('src');

        //         $('.writing-text').hide();
        //         $('.cropped-image').attr('src', img);
        //     } else{
        //         // error output
        //         spartan.cancelEraseImage();
        //     }               
            
        //     // we have to remove the values
        //     image_write_form.find('.text1, .text2').val('');
        // });

        spartan.eraseShow();

        return false;
    };

    spartan.cancelEraseImage = function(evt){
        $('.writing-text').show();
        $('#write_image_form').show();
        $('#erase_image_form').hide();
        $('#erase_canvas, #erase_canvas_overlay').hide();
        $('.image-border').html('');

        return false;
    };

    spartan.eraseShow = function(){
        spartan.ctx.clearRect(0, 0, spartan.canvas.width, spartan.canvas.height);
        spartan.ctxOverlay.clearRect(0, 0, spartan.canvasOverlay.width, spartan.canvasOverlay.height);

        $('#erase_image_form').show()
        $('#erase_canvas, #erase_canvas_overlay').show();
        $('.image-border').html('Erase');
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

        if(spartan.erasing){
            spartan.ctx.beginPath();
            spartan.ctx.arc(x, y, 15, 0, Math.PI*2);
            spartan.ctx.fill();

            spartan.eraseData.push({ x:x, y:y });
        } 

        if(evt.type == 'mousemove') {
            spartan.ctxOverlay.clearRect(0, 0, spartan.canvasOverlay.width, spartan.canvasOverlay.height);
            spartan.ctxOverlay.beginPath();
            spartan.ctxOverlay.arc(x, y, 15, 0, Math.PI*2);
            spartan.ctxOverlay.fill();
        }

        evt.stopPropagation();
    };

    spartan.eraseStop = function(){
        spartan.ctxOverlay.clearRect(0, 0, spartan.canvasOverlay.width, spartan.canvasOverlay.height);
        spartan.erasing = false;
    };

    spartan.eraseImage = function(){
        var image_erase_form = $('#erase_image_form');
        image_erase_form.find('.text1').val($('.title1').val());
        image_erase_form.find('.text2').val($('.title2').val());
        image_erase_form.find('.values').val(JSON.stringify(spartan.eraseData));
        image_erase_form.hide();

        $('#upload_iframe').unbind().load(function(){
            var img = $('#upload_iframe').contents().find('body').html();

            if(img.indexOf('uperror') < 0){
                $('.download-file-container').show();
                $('.download-file').attr('href', img);
                $('.download-file img').attr('src', img);

                $('#erase_canvas, #erase_canvas_overlay').hide();
                $('.writing-text').hide();
                $('.cropped-image').attr('src', img);
            } else{
                // error output
                image_erase_form.show();
            }               
            
            // we have to remove the values
            image_erase_form.find('.values').val('');
        });
    };

    spartan.startOver = function(){
        $('.download-file-container').hide();

        spartan.cancelWriteImage();
        spartan.cancelCropImage();

        return false;
    };

    // Start of application
    $(function(){
        spartan.init();
    });
}(jQuery));