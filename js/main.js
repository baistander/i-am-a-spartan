var spartan = {};

(function($){
    var imgWidth, imgHeight;

    spartan.init = function(){
        spartan.image = $('.cropper');

        $('#image_upload_form').submit(spartan.uploadImage);
        $('#image_crop_form').submit(spartan.cropImage);
        $('#write_image_form').submit(spartan.writeImage);

        var container = $('.image-border').get(0);
        var hammer = Hammer(container, {
            swipe: false,
            hold: false
        }).on('drag', spartan.dragImage);

        hammer.on('touch', spartan.selectImage);
        hammer.on('release', spartan.releaseImage);
        // hammer.on('pinchout', spartan.zoomIn);
        // hammer.on('pinchin', spartan.zoomOut);
        // hammer.on('pinch', function(evt){
        //     console.log(evt, 'pinch')
        // });

        $('.zoomIn').on('click', spartan.zoomIn);
        $('.zoomOut').on('click', spartan.zoomOut);

        $('.sub-container').on('touchstart touchmove touchend', function(){
            return false;
        });

        $('#file').change(function() { 
            $('#image_upload_form').submit(); 
        });
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
                $('.image-border').addClass('upload').html('Click to Upload');
                $('#image_crop_form').hide();      
            }
            
            // we have to remove the values
            $('#image_upload_form').find('#file').val('');
        });
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
                $('#write_image_form').show().find('.img_src').attr('value', img);
                $('.writing-text').show();
                $('.image-border').html('');

                //done cropping
                spartan.image.hide();
                $('.controls').hide();

                $('.cropped-image').attr('src', img).unbind().load(function(){
                    var $this = $(this);
                    $this.show();
                });
            } else{
                // error output
                image_crop_form.show();
                $('.image-border').addClass('crop');
            }               
            
            // we have to remove the values
            image_crop_form.find('.width, .height, .x1, .y1').val('');
        });
    };

    spartan.writeImage = function(){
        var image_write_form = $('#write_image_form');
        image_write_form.find('.text1').val($('.title1').val());
        image_write_form.find('.text2').val($('.title2').val());
        image_write_form.hide();

        $('#upload_iframe').unbind().load(function(){
            var img = $('#upload_iframe').contents().find('body').html();

            if(img.indexOf('uperror') < 0){
                $('.download-file-container').show();
                $('.download-file').attr('href', img);
                $('.download-file img').attr('src', img);

                $('.writing-text').hide();
                $('.cropped-image').attr('src', img);
            } else{
                // error output
                image_write_form.show();
            }               
            
            // we have to remove the values
            image_write_form.find('.text1, .text2').val('');
        });
    };

    // Start of application
    $(function(){
        spartan.init();
    });
}(jQuery));