<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

        <!-- Place favicon.ico and apple-touch-icon.png in the root directory -->

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">
        <link rel="stylesheet" href="css/cropper.css">
        <link rel="stylesheet" href="css/styles.css">
        <script src="js/vendor/modernizr-2.6.2.min.js"></script>
    </head>
    <body>
        <!--[if lt IE 9]>
            <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
        <![endif]-->

        <div class="container">
            <div class="background background-top"></div>
            <div class="background background-bottom"></div>
            <div class="sub-container">
                <div class="image-container">
                    <img class="cropper" src="" />
                    <img class="cropped-image" src="" />
                </div>
                <div class="background background-left"></div>
                <div class="background background-right"></div>
                <canvas id="erase_canvas" class="erase_canvas"></canvas>
                <div class="image-border upload">Click to Upload</div>
                <div class="controls">
                    <div class="zoomIn">+</div>
                    <div class="zoomOut">-</div>
                </div>
                <div class="writing-text">
                    <input type="text" class="title1" placeholder="WRITE WHAT YOU" />
                    <input type="text" class="title2" placeholder="WANT HERE" />
                </div>
                <canvas id="erase_canvas_overlay" class="erase_canvas_overlay"></canvas>
            </div>
        </div>

        <div id="image_upload">
            <form name="image_upload_form" id="image_upload_form"  method="post" enctype="multipart/form-data" action="upload.php?act=image" target="upload_iframe">
              <label for="photo"><input name="photo" id="file" class="file" size="27" type="file" /></label>         
              <input type="hidden" name="height" value="500" class="height" />
              <input type="hidden" name="width" value="500" class="width" />
              <input type="submit" name="action" value="Upload" />
            </form>
        </div>

        <div id="image_crop" class="image_crop">
            <form name="image_crop_form" id="image_crop_form" method="post" action="upload.php?act=crop" target="upload_iframe">
                <input type="hidden" name="img_src" id="img_src" class="img_src" /> 
                <input type="hidden" name="height" value="0" class="height" />
                <input type="hidden" name="width" value="0" class="width" />
                <input type="hidden" id="y1" class="y1" name="y" />
                <input type="hidden" id="x1" class="x1" name="x" />
                <input type="hidden" id="y2" class="y2" name="y1" />
                <input type="hidden" id="x2" class="x2" name="x1" />
                <input type="submit" class="cancel" value="cancel crop" />
                <input type="submit" value="finish crop" />
            </form>
        </div>

        <div id="write_image" class="write_image">
            <form name="write_image_form" id="write_image_form" method="post" action="upload.php?act=write" target="upload_iframe">
                <input type="hidden" name="img_src" id="img_src" class="img_src" /> 
                <input type="hidden" name="text1" value="0" class="text1" />
                <input type="hidden" name="text2" value="0" class="text2" />
                <input type="submit" class="cancel" value="cancel writing text" />
                <input type="submit" value="finish writing text" />
            </form>
        </div>

        <div id="erase_image" class="erase_image">
            <form name="erase_image_form" id="erase_image_form" method="post" action="upload.php?act=erase" target="upload_iframe">
                <input type="hidden" name="img_src" id="img_src" class="img_src" /> 
                <input type="hidden" name="text1" value="0" class="text1" />
                <input type="hidden" name="text2" value="0" class="text2" />
                <input type="hidden" name="values" value="0" class="values" />
                <input type="submit" class="cancel" value="cancel erasing" />
                <input type="submit" value="finish erasing" />
            </form>
        </div>

        <div class="download-file-container">
            <a class="start-over" href="#">Start Over</a>
            <a class="download-file" href="#" download="SpartanImage">
                Download
            </a>
        </div>

        <iframe id="upload_iframe" class="upload_iframe" name="upload_iframe" src=""></iframe>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.10.2.min.js"><\/script>')</script>
        <script src="js/plugins.js"></script>
        <script src="js/main.js"></script>

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
        <script>
            (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='//www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
            ga('create','UA-XXXXX-X');ga('send','pageview');
        </script>
    </body>
</html>
