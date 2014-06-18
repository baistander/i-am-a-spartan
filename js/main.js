var spartan = {};

(function($){
    var imgWidth, imgHeight;
    var loaderLeaves = 1200;
    var overlayAnimationSpeed = 400;
    var demoText = 'What do I do on weekends? Not much.';

    spartan.init = function(){
        spartan.image = $('.cropper');

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
        $('#erase_image_form').submit(spartan.eraseImage);

        var container = $('.image-border').get(0);
        var hammer = Hammer(container, {
            swipe: false,
            hold: false
        }).on('drag', spartan.dragImage);

        hammer.on('release', spartan.releaseImage);

        $('.zoomIn').on('click', spartan.zoomIn);
        $('.zoomOut').on('click', spartan.zoomOut);

        $('.container').on('touchmove',function(evt){
            if($(this).find('.image-border').hasClass('crop') || $(this).find('#erase_canvas').is(':visible')){
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

        $(window).load(spartan.initialAnimation);
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
                    $('header').css('top', -84).animate({opacity:1, top:0}, 700, 'easeOutBounce');

                    spartan.animateExampleImage();
                });
            });
        });
    };

    spartan.animateExampleImage = function(){
        var textArea = $('.writing-text').show().find('textarea').val('').attr('placeholder', '');
        var index = 0;

        $('.example2').hide();
        $('.image-overlay').show();

        spartan.animateImageTimer = setTimeout(function(){
            spartan.writingInterval = setInterval(function(){
                index++;
                textArea.val(demoText.substring(0, index));

                if(demoText.length <= index){
                    clearInterval(spartan.writingInterval);

                    $('.writing-text').animate({'opacity': .5}, 400);
                    
                    var spots = [{x:353, y:297},{x:353, y:296},{x:353, y:293},{x:355, y:289},{x:356, y:285},{x:357, y:282},{x:358, y:280},{x:358, y:279},{x:359, y:277},{x:359, y:276},{x:359, y:276},{x:360, y:274},{x:362, y:272},{x:365, y:268},{x:367, y:265},{x:368, y:263},{x:369, y:262},{x:369, y:261},{x:370, y:261},{x:370, y:260},{x:371, y:260},{x:372, y:260},{x:372, y:260},{x:373, y:260},{x:374, y:260},{x:375, y:260},{x:376, y:260},{x:378, y:260},{x:379, y:260},{x:380, y:260},{x:380, y:261},{x:380, y:262},{x:379, y:263},{x:378, y:264},{x:378, y:265},{x:376, y:266},{x:375, y:268},{x:374, y:269},{x:374, y:271},{x:373, y:271},{x:372, y:272},{x:372, y:273},{x:371, y:274},{x:371, y:275},{x:370, y:276},{x:369, y:279},{x:369, y:280},{x:367, y:282},{x:366, y:284},{x:366, y:285},{x:365, y:286},{x:365, y:287},{x:365, y:288},{x:364, y:289},{x:364, y:291},{x:364, y:292},{x:363, y:293},{x:363, y:294},{x:364, y:294},{x:365, y:294},{x:366, y:294},{x:367, y:294},{x:369, y:293},{x:372, y:292},{x:375, y:291},{x:378, y:289},{x:381, y:287},{x:384, y:285},{x:386, y:283},{x:387, y:281},{x:388, y:280},{x:389, y:279},{x:389, y:278},{x:389, y:277},{x:389, y:276},{x:389, y:275},{x:389, y:275},{x:389, y:274},{x:390, y:272},{x:392, y:270},{x:394, y:267},{x:396, y:265},{x:397, y:263},{x:399, y:262},{x:399, y:262},{x:399, y:261},{x:400, y:261},{x:401, y:261},{x:402, y:261},{x:404, y:261},{x:406, y:260},{x:408, y:260},{x:411, y:260},{x:412, y:259},{x:414, y:259},{x:414, y:259},{x:415, y:259},{x:416, y:259},{x:417, y:259},{x:420, y:259},{x:421, y:259},{x:421, y:259},{x:422, y:259},{x:423, y:259},{x:423, y:258},{x:424, y:258},{x:425, y:258},{x:426, y:258},{x:428, y:258},{x:429, y:258},{x:430, y:258}];
                    var spotIndex = 0;

                    $('.erase_canvas').show();
                    spartan.canvas.width = $('.sub-container').width();
                    spartan.canvas.height = $('.sub-container').height();
                    spartan.ctx.fillStyle = '#B71D35';
                    spartan.ctx.clearRect(0, 0, spartan.canvas.width, spartan.canvas.height);

                    spartan.eraseInterval = setInterval(function(){
                        if(spots[spotIndex]){
                            spartan.eraseSpot(spots[spotIndex].x, spots[spotIndex].y);
                            spotIndex++;
                        } else {
                            clearInterval(spartan.eraseInterval);
                            $('.example2').fadeIn();
                            $('.writing-text').animate({'opacity': 0}, 400, function(){
                                $('.writing-text').attr('style', '').hide();
                                spartan.animateImageTimer = setTimeout(function(){
                                    $('.example2').fadeOut(400, function(){
                                        spartan.animateExampleImage();
                                    });
                                }, 1500);
                            });
                            $('.erase_canvas').fadeOut();
                        }
                    }, 20);

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
                    $('.image-overlay-rocks').hide();

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

        function done(){
            $('.image-border').removeClass('crop');
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

        $('.image-border').removeClass('crop');
        $('.controls').hide();

        $('#upload_iframe').unbind().load(function(){
            var img = $('#upload_iframe').contents().find('body').html();

            if(img.indexOf('uperror') < 0){
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
                    $('.writing-text').show().find('textarea').focus();
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

        function done(){
            $('.writing-text').hide().children().val('');
            $('.cropped-image').hide();
            $('.image-border').addClass('crop');
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
        } else {
            text = 'Finishing Image!!!';
            callback = spartan.showDownload;
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

    spartan.eraseSpot = function(x, y){
        spartan.ctx.beginPath();
        spartan.ctx.arc(x, y, 10, 0, Math.PI*2);
        spartan.ctx.fill();
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

        var ratio = spartan.ratio = 600/spartan.canvas.width;
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

            if(img.indexOf('uperror') < 0){
                var cTime = (new Date()).getTime();
                if(cTime - spartan.loaderTime < loaderLeaves){
                    setTimeout(spartan.hideLoader, loaderLeaves - (cTime - spartan.loaderTime));
                } else {
                    setTimeout(spartan.hideLoader, 200);
                }
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