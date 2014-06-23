var spartan = {};

(function($){
    var imgWidth, imgHeight;
    var loaderLeaves = 1800;
    var overlayAnimationSpeed = 400;
    var demoText = 'What do I do on weekends? Not much.';

    spartan.init = function(){
        spartan.image = $('.cropper');

        if(navigator.userAgent.toLowerCase().indexOf('msie') >= 0){
            $('body').addClass('msie');
        }

        $('.instruction1 .cta').on('click', spartan.selectImage);
        $('#image_upload_form').submit(spartan.uploadImage);

        $('.instruction2 .cancel').on('click', spartan.cancelCropImage);
        $('.instruction2 .next').on('click', function(){
            if(spartan.processing){
                return;
            }

            spartan.buttonClick(this);
            spartan.processing = true;

            spartan.loaderTimer = setTimeout(function(){
                spartan.overlay.find('.text').html('Cropping Image...');
            }, 200);
            spartan.loader.show();
            spartan.loaderTime = (new Date()).getTime();

            setTimeout(function(){
                $('#image_crop_form').submit();
            }, 600);
        });
        $('#image_crop_form').submit(spartan.cropImage);

        $('.instruction3 .cancel').on('click', spartan.cancelWriteImage);
        $('.instruction3 .next').on('click', spartan.writeImage);

        $('.instruction4 .cancel').on('click', spartan.cancelEraseImage);
        $('.instruction4 .next').on('click', function(){
            if(spartan.processing){
                return;
            }

            spartan.buttonClick(this);
            spartan.processing = true;
            spartan.loaderTimer = setTimeout(function(){
                spartan.overlay.find('.text').html('Finishing Image!!!');
            }, 200);
            spartan.loader.show();
            spartan.loaderTime = (new Date()).getTime();

            setTimeout(function(){
                $('#erase_image_form').submit(); 
            }, 600);
        });
        $('.instruction4 .clear').on('click', spartan.eraseClear);
        $('.instruction5 .clear').on('click', spartan.downloadClear);
        $('#erase_image_form').submit(spartan.eraseImage);

        var container = $('.sub-container').get(0);
        var hammer = Hammer(container, {
            swipe: false,
            hold: false
        }).on('drag', spartan.dragImage);

        hammer.on('release', spartan.releaseImage);

        $('.zoomIn').on('click', spartan.zoomIn);
        $('.zoomOut').on('click', spartan.zoomOut);

        $('.container').on('touchmove',function(evt){
            if($(this).find('.sub-container').hasClass('crop') || $(this).find('#erase_canvas').is(':visible')){
                evt.preventDefault();
            }
        });

        $('.writing-text input').on('touchstart touchmove touchend', function(evt){
            evt.stopPropagation();
        });

        $('#file').change(function() { 
            if(spartan.processing){
                return;
            }

            spartan.processing = true;

            setTimeout(function(){
                spartan.loaderTimer = setTimeout(function(){
                    spartan.overlay.find('.text').html('Uploading Image...');
                }, 200);
                spartan.loader.show();
                spartan.loaderTime = (new Date()).getTime();

                setTimeout(function(){
                    $('#image_upload_form').submit(); 
                }, 600);
            }, 400);

            if(spartan.writingInterval){
                clearInterval(spartan.writingInterval);
            }
            if(spartan.eraseInterval){
                clearInterval(spartan.eraseInterval);
            }
            if(spartan.animateImageTimer){
                clearTimeout(spartan.animateImageTimer);
            }

            $('.example2').stop(true);
            $('.writing-text').stop(true);
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

        var fbTimer;
        function openDialog(){
          clearTimeout(fbTimer);

          if(FB){
            FB.ui({
                method: 'feed',
                link: 'http://goodhamsters.com/spartan',
                picture: 'http://goodhamsters.com/spartan/' + $('.cropped-image').attr('src'),
                name: 'I am a Spartan',
                caption: '',
                description: 'Share your Spartan story.'
            }, function(response){
                // fb response
            });
          } else {
            fbTimer = setTimeout(openDialog, 100);
          }

          spartan.buttonClick(this);
        }

        $('.instruction5 .next a').on('click', function(){
            spartan.buttonClick($(this).parent().get(0));
        });
        $('.instruction5 .facebook').on('click', openDialog);
        $('.instruction5 .twitter').on('click', function(){
          spartan.buttonClick(this);
          window.open('https://twitter.com/share?text=Share your Spartan story.&url=http://goodhamsters.com/spartan', '_blank');
        });

        spartan.overlay = $('#loader');
        spartan.loader = new SVGLoader(spartan.overlay.get(0), {speedIn : overlayAnimationSpeed, easingIn : mina.easeinout});

        spartan.overlay.on('click', '.error-button', spartan.hideLoader);

        $(window).load(spartan.initialAnimation);
        $(window).resize(spartan.resize);

        spartan.resize();
    };

    spartan.resize = function(){
        var border = $('.image-overlay-border');
        var borderOffset = border.offset();
        $('.overlay-top').height(borderOffset.top);
        $('.overlay-bottom').css('top', borderOffset.top + border.outerHeight());
    };

    spartan.initialAnimation = function(){
        $('.title1 h1').css('top', 200).delay(100).animate({top: 100, opacity:1}, 800, 'easeOutQuad', function(){

            $('.title1 h1').animate({top: 50}, 800, 'easeOutQuad');
            $('.title1 h2').css('top', 125).animate({top: 50, opacity:1}, 800, 'easeOutQuad', function(){

                $('.title1 h1').animate({top: 0}, 800, 'easeOutQuad');
                $('.title1 h2').animate({top: 0}, 800, 'easeOutQuad');
                $('.instructions').css('top', 75).animate({top: 0, opacity:1}, 800, 'easeOutQuad', function(){

                    $('.container, header, footer').animate({opacity:1}, 400);
                    $('.background').fadeIn(400, function(){
                    });
                    $('header').css('top', -84).animate({opacity:1, top:0}, 700, 'easeOutQuad');

                    spartan.animateExampleImage();
                });
            });
        });
    };

    spartan.animateExampleImage = function(){
        var textArea = $('.writing-text').show().find('textarea').val('').attr('placeholder', '');
        var index = 0;

        $('.example2').hide().css('opacity', '');
        $('.image-overlay').show();
        $('.writing-text').css('opacity', '');

        spartan.animateImageTimer = setTimeout(function(){
            spartan.writingInterval = setInterval(function(){
                index++;
                textArea.val(demoText.substring(0, index));

                if(demoText.length <= index){
                    clearInterval(spartan.writingInterval);

                    $('.writing-text').animate({'opacity': .5}, 400, function(){
                        var spots = [{x:312, y:260},{x:312, y:259},{x:313, y:258},{x:314, y:258},{x:314, y:257},{x:314, y:256},{x:314, y:255},{x:314, y:255},{x:314, y:254},{x:314, y:253},{x:314, y:252},{x:315, y:252},{x:315, y:252},{x:316, y:251},{x:317, y:251},{x:318, y:250},{x:318, y:249},{x:319, y:249},{x:320, y:249},{x:320, y:249},{x:321, y:248},{x:321, y:247},{x:322, y:245},{x:323, y:244},{x:324, y:243},{x:324, y:242},{x:325, y:240},{x:325, y:237},{x:326, y:234},{x:326, y:232},{x:327, y:230},{x:327, y:229},{x:327, y:228},{x:327, y:229},{x:327, y:230},{x:327, y:231},{x:327, y:231},{x:327, y:232},{x:328, y:232},{x:329, y:232},{x:331, y:232},{x:332, y:232},{x:333, y:232},{x:334, y:232},{x:335, y:232},{x:336, y:232},{x:337, y:232},{x:339, y:232},{x:341, y:232},{x:343, y:232},{x:344, y:232},{x:345, y:232},{x:345, y:232},{x:348, y:232},{x:349, y:232},{x:351, y:232},{x:352, y:232},{x:353, y:232},{x:353, y:232},{x:354, y:232},{x:356, y:232},{x:358, y:232},{x:360, y:231},{x:361, y:231},{x:362, y:231},{x:363, y:231},{x:364, y:231},{x:365, y:231},{x:365, y:230},{x:368, y:229},{x:371, y:229},{x:374, y:228},{x:376, y:227},{x:377, y:227},{x:378, y:227},{x:377, y:227},{x:374, y:227},{x:369, y:229},{x:365, y:232},{x:362, y:233},{x:359, y:235},{x:358, y:236},{x:356, y:237},{x:355, y:238},{x:354, y:238},{x:352, y:239},{x:349, y:240},{x:347, y:241},{x:345, y:243},{x:343, y:243},{x:342, y:244},{x:341, y:244},{x:340, y:244},{x:339, y:245},{x:338, y:245},{x:335, y:246},{x:333, y:247},{x:332, y:249},{x:333, y:249},{x:336, y:249},{x:340, y:249},{x:344, y:249},{x:347, y:249},{x:348, y:249},{x:349, y:249},{x:349, y:249},{x:351, y:249},{x:355, y:249},{x:359, y:247},{x:362, y:247},{x:364, y:246},{x:370, y:246},{x:375, y:246}];
                        var ratio = 560/$('.sub-container').width();
                        var spotIndex = 0;

                        $('.erase_canvas').show();
                        spartan.canvas.width = $('.sub-container').width();
                        spartan.canvas.height = $('.sub-container').height();
                        spartan.ctx.fillStyle = '#B71D35';
                        spartan.ctx.clearRect(0, 0, spartan.canvas.width, spartan.canvas.height);

                        spartan.eraseInterval = setInterval(function(){
                            if(spots[spotIndex]){
                                spartan.eraseSpot(spots[spotIndex].x/ratio, spots[spotIndex].y/ratio, 10/ratio);
                                spotIndex++;
                            } else {
                                clearInterval(spartan.eraseInterval);
                                $('.example2').fadeIn();
                                $('.image-overlay').fadeOut();
                                $('.writing-text').animate({'opacity': 0}, 400, function(){
                                    $('.writing-text').attr('style', '').hide();
                                    spartan.animateImageTimer = setTimeout(function(){
                                        $('.example2').fadeOut(400, function(){
                                            spartan.animateExampleImage();
                                        });
                                        $('.image-overlay').fadeIn();
                                    }, 1500);
                                });
                                $('.erase_canvas').fadeOut();
                            }
                        }, 20);
                    });

                    // spartan.eraseShow();
                }
            }, 70);
        }, 700);
    };

    spartan.buttonClick = function(el){
        var _this = $(el);
        _this.addClass('active');
        setTimeout(function(){
            _this.removeClass('active');
        }, 1000);
    };

    spartan.selectImage = function(){
        spartan.buttonClick(this);
        $('#file').click();
    };

    spartan.showLoader = function(callback){
        spartan.loader.show();
        spartan.loaderTimer = setTimeout(function(){
            spartan.overlay.find('.text').html('Going Back...');
        }, 200);

        setTimeout(function(){
            callback();
        }, loaderLeaves/2);

        setTimeout(function(){
            spartan.hideLoader();
        }, loaderLeaves);
    };

    spartan.hideLoader = function(){
        clearTimeout(spartan.loaderTimer);
        spartan.loaderTimer = setTimeout(function(){
            spartan.overlay.find('.text').html('');
        }, 200);
        spartan.loader.hide();
    };

    spartan.showError = function(msg){
        spartan.overlay.find('.text').html(msg + '<div class="error-button"><span>Got it</span></div>');
    };

    spartan.uploadImage = function(){
        $('#upload_iframe').unbind().load(function(){
            var img = $('#upload_iframe').contents().find('body').html();
            
            if(img.indexOf('uperror') < 0){
                $('#image_crop_form').find('.img_src').attr('value', img);

                spartan.image.css({width: '', height: '', marginLeft: '', marginTop: ''});
                spartan.image.attr('src', img).unbind().load(function(){
                    var cTime = (new Date()).getTime();
                    if(cTime - spartan.loaderTime < loaderLeaves){
                        setTimeout(spartan.hideLoader, loaderLeaves - (cTime - spartan.loaderTime));
                    } else {
                        setTimeout(spartan.hideLoader, 200);
                    }
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
                    $('.erase_canvas').stop(true, true).hide();
                    $('.writing-text').stop(true, true).hide().find('textarea').attr('placeholder', 'TYPE YOUR TEXT IN HERE...').val('');
                    $('.example2').stop(true, true).hide();
                    $('.image-overlay').stop(true, true).hide();
                    $('.image-overlay-rocks').hide();

                    imgWidth = $parent.width();
                    imgHeight = $parent.height();

                    spartan.originalHeight = height;
                    spartan.originalWidth = width;
                    spartan.imageRatio = ratio;

                    if(ratio < aspectRatio) {
                        var newWidth = imgWidth*1.15;

                        $this.width(newWidth).css({
                            marginLeft : -imgWidth * 0.075,
                            marginTop : -(newWidth*aspectRatio/ratio - imgHeight)/2,
                        });

                        spartan.imageWidth = newWidth;
                        spartan.imageHeight = newWidth*aspectRatio/ratio;
                    } else {
                        var newHeight = imgHeight*1.15;

                        $this.height(newHeight).css({
                            marginTop : -imgHeight * 0.075,
                            marginLeft : -(newHeight*ratio/aspectRatio - imgWidth)/2,
                        });

                        spartan.imageWidth = newHeight*ratio/aspectRatio;
                        spartan.imageHeight = newHeight;
                    }

                    $this.css({ top: '', left: '' });
                    $('.controls').show();
                });

                $('.sub-container').addClass('crop');
            }
            else{
                // error output
                spartan.processing = false;
                spartan.showError(img);
                spartan.cancelCropImage();
            }
            
            $('#image_upload_form').find('#file').val('');
        });
    };

    spartan.cancelCropImage = function(evt){
        if(spartan.processing){
            return false;
        }

        function done(){
            $('.sub-container').removeClass('crop');
            $('.instruction1').show().siblings().hide();
            $('.controls').hide();
            $('.overlay').hide();
            $('.image-overlay').hide();
            $('.image-overlay-rocks').show();

            spartan.animateExampleImage();
            spartan.image.hide();
        }

        if(evt){
            spartan.buttonClick(this);
            spartan.showLoader(done);
        } else {
            done();
        }

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
        var image_crop_form = $('#image_crop_form');
        var scale = spartan.originalWidth / spartan.imageWidth;
        image_crop_form.find('.x1').val(-parseInt(spartan.image.css('marginLeft'), 10)*scale);
        image_crop_form.find('.y1').val(-parseInt(spartan.image.css('marginTop'), 10)*scale);
        image_crop_form.find('.width').val(imgWidth * scale);
        image_crop_form.find('.height').val(imgHeight * scale);

        $('.sub-container').removeClass('crop');
        $('.controls').hide();

        $('#upload_iframe').unbind().load(function(){
            var img = $('#upload_iframe').contents().find('body').html();

            $('#erase_image_form').find('.img_src').attr('value', img);

            $('.cropped-image').attr('src', img).unbind().load(function(){
                var cTime = (new Date()).getTime();
                if(cTime - spartan.loaderTime < loaderLeaves){
                    setTimeout(spartan.hideLoader, loaderLeaves - (cTime - spartan.loaderTime));
                } else {
                    setTimeout(spartan.hideLoader, 200);
                }
                spartan.processing = false;

                $('.instruction3').show().siblings().hide();
                $('.writing-text').show().find('textarea');
                $('.writing-text').css('opacity', 1);
                $('.overlay').hide();
                spartan.image.hide();
                $('.image-overlay').hide();
                $('.image-overlay-rocks').show();

                var $this = $(this);
                $this.show();
            });

            // we have to remove the values
            image_crop_form.find('.width, .height, .x1, .y1').val('');            
        });
    };

    spartan.cancelWriteImage = function(evt){
        if(spartan.processing){
            return false;
        }

        function done(){
            $('.writing-text').hide().children().val('');
            $('.cropped-image').hide();
            $('.sub-container').addClass('crop');
            $('.controls').show();
            $('.instruction2').show().siblings().hide();
            $('.image-overlay').show();

            spartan.image.show();
        }

        if(evt){
            spartan.buttonClick(this);
            spartan.showLoader(done);
        } else {
            done();
        }

        return false;
    };

    spartan.writeImage = function(){
        var text, callback;

        if($('.write1').val() != ''){
            text = 'Writing Text...';
            callback = spartan.eraseShow;
            spartan.skippedWriting = false;
        } else {
            text = 'Finishing Image!!!';
            callback = spartan.showDownload;
            spartan.skippedWriting = true;
        }

        spartan.buttonClick(this);
        spartan.loader.show();
        spartan.loaderTimer = setTimeout(function(){
            spartan.overlay.find('.text').html(text);
        }, 200);

        setTimeout(function(){
            callback();
        }, loaderLeaves/2);

        setTimeout(function(){
            spartan.hideLoader();
        }, loaderLeaves);

        return false;
    };

    spartan.cancelEraseImage = function(evt){
        if(spartan.processing){
            return false;
        }

        function done(){
            $('.writing-text').show().find('textarea').val('');
            $('.writing-text').css('opacity', 1);
            $('#erase_canvas, #erase_canvas_overlay').hide();
            $('.instruction3').show().siblings().hide();
        }

        if(evt){
            spartan.buttonClick(this);
            spartan.showLoader(done);
        } else {
            done();
        }

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

    spartan.eraseSpot = function(x, y, size){
        if(!size){
            size = 10;
        }
        spartan.ctx.beginPath();
        spartan.ctx.arc(x, y, size, 0, Math.PI*2);
        spartan.ctx.fill();
    };

    spartan.erase = function(evt){
        var x, y, touch, canvasOffset = $('#erase_canvas_overlay').offset();

        if(evt.type != 'mousemove'){
            spartan.erasing = true;
        }

        if(evt.type.indexOf('mouse') >= 0) {
            x = evt.pageX - canvasOffset.left;
            y = evt.pageY - canvasOffset.top;;
        } else {
            touch = evt.originalEvent.touches[0];
            x = touch.pageX - canvasOffset.left;
            y = touch.pageY - canvasOffset.top;
        }
        
        var ratio = spartan.ratio = 560/spartan.canvas.width;
        var brushSize = 10;

        if(spartan.erasing){
            spartan.eraseSpot(x, y);
            spartan.eraseData.push({ x:x*ratio, y:y*ratio });
        } 

        if(evt.type == 'mousemove') {
            spartan.ctxOverlay.clearRect(0, 0, spartan.canvasOverlay.width, spartan.canvasOverlay.height);
            spartan.ctxOverlay.beginPath();
            spartan.ctxOverlay.arc(x, y, brushSize, 0, Math.PI*2);
            spartan.ctxOverlay.fill();
            spartan.ctxOverlay.stroke();
        }

        $('.writing-text').css('opacity', .5);

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

        $('.writing-text').css('opacity', 1);
        spartan.ctx.clearRect(0, 0, spartan.canvas.width, spartan.canvas.height);
        spartan.eraseData = [];
    };

    spartan.eraseImage = function(){
        var image_erase_form = $('#erase_image_form');
        image_erase_form.find('.text1').val($('.write1').val());
        image_erase_form.find('.values').val(JSON.stringify(spartan.eraseData));
        image_erase_form.find('.size').val(spartan.ratio);

        $('#upload_iframe').unbind().load(function(){
            var img = $('#upload_iframe').contents().find('body').html();

            var cTime = (new Date()).getTime();
            if(cTime - spartan.loaderTime < loaderLeaves){
                setTimeout(spartan.hideLoader, loaderLeaves - (cTime - spartan.loaderTime));
            } else {
                setTimeout(spartan.hideLoader, 200);
            }
            spartan.processing = false;

            $('.cropped-image').attr('src', img).unbind();
            spartan.showDownload();
            
            // we have to remove the values
            image_erase_form.find('.values').val('');
        });
    };

    spartan.downloadClear = function(evt){
        if(spartan.processing){
            return false;
        }

        function done(){
            if(!spartan.skippedWriting){
                $('.instruction4').show().siblings().hide();
                $('.writing-text').show().css('opacity', 1);
                $('#erase_canvas, #erase_canvas_overlay').show();
                $('.title').removeClass('end');
                spartan.ctx.clearRect(0, 0, spartan.canvas.width, spartan.canvas.height);
                spartan.eraseData = [];

                $('.cropped-image').attr('src', $('#erase_image_form').find('.img_src').attr('value')).unbind();
            } else {
                $('.writing-text').show().find('textarea').val('');
                $('.writing-text').css('opacity', 1);
                $('.instruction3').show().siblings().hide();
            }
        }

        if(evt){
            spartan.showLoader(done);
        } else {
            done();
        }

        return false;
    };

    spartan.showDownload = function(img){
        $('.instruction5').show().siblings().hide();
        $('#erase_canvas, #erase_canvas_overlay').hide();
        $('.writing-text').hide();
        $('.download-file').attr('href', $('.cropped-image').attr('src'));
        $('.title').addClass('end');
    };

    spartan.startOver = function(){
        spartan.downloadClear();
        spartan.cancelWriteImage();
        spartan.cancelCropImage();

        return false;
    };

    // Start of application
    $(function(){
        spartan.init();
    });
}(jQuery));