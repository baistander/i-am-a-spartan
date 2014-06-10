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

        <div class="background">
            <div class="top"></div>
            <div class="bottom"></div> 
        </div>

        <header>
            <div class="logo">
                <a href="/"><img src="img/logo.jpg" alt="Spartan Logo" /></a>
            </div>
            <div class="links">
                <a href="#" target="_blank">Gallery</a>
                <a href="#" target="_blank">Find a Race</a>
            </div>
        </header>

        <div class="title">
            <img class="title1" src="img/header.png" alt="I am a Spartan" />
            <img class="title2" src="img/header2.png" alt="You are a Spartan" />
        </div>

        <div class="instructions">
            <div class="instruction instruction1">
                <div class="contents">To Begin,<br> Upload a photo.</div>
                <div class="cta">Upload</div>
                <div class="clearfix"></div>
            </div>
            <div class="instruction instruction2">
                <div class="contents">Now,<br> Crop your photo.</div>
                <div class="cta next">Next</div>
                <div class="cancel">Cancel</div>
                <div class="clearfix"></div>
            </div>
            <div class="instruction instruction3">
                <div class="contents">Now it's time,<br> share your story.</div>
                <div class="cta next">Next</div>
                <div class="cancel">Cancel</div>
                <div class="clearfix"></div>
            </div>
            <div class="instruction instruction4">
                <div class="contents">Now you can erase<br> areas that overlap.</div>
                <div class="cta next">Next</div>
                <div class="cancel">Cancel</div>
                <div class="clear">Clear</div>
                <div class="clearfix"></div>
            </div>
            <div class="instruction instruction5">
                <div class="cta next"><a class="download-file" href="#" download="SpartanImage">Download</a></div>
                <div class="cta facebook">Facebook</div>
                <div class="cta instagram">Instagram</div>
                <div class="clearfix"></div>
            </div>
        </div>

        <div class="overlay overlay-top"></div>
        <div class="overlay overlay-bottom"></div>

        <div class="container">
            <div class="sub-container">
                <div class="image-container">
                    <img class="cropper" src="" />
                    <img class="cropped-image" src="" />
                </div>
                <div class="image-overlay"></div>
                <div class="image-overlay-rocks"></div>
                <div class="overlay overlay-left"></div>
                <div class="overlay overlay-right"></div>
                <div class="image-border"></div>
                <div class="controls">
                    <div class="zoomIn">+</div>
                    <div class="zoomOut">-</div>
                </div>
                <div class="writing-text">
                    <textarea rows="6" cols="20" class="write1" placeholder="TYPE YOUR TEXT IN HERE..."></textarea>
                </div>
                <canvas id="erase_canvas" class="erase_canvas"></canvas>
                <canvas id="erase_canvas_overlay" class="erase_canvas_overlay"></canvas>
            </div>
        </div>

        <footer>
            <div class="contents">
                <div class="sub-contents sub-contents1">
                    <h6>About Our Company</h6>
                    <p>Learn more about our company’s mission, reach out and contact us, and find information about sponsorship opportunities.</p>
                    <a href="#" target="_blank"><img src="img/button_learn_more.jpg" alt="Learn More" /></a>
                </div>
                <div class="sub-contents sub-contents2">
                    <h6>Sign Up for Updates</h6>
                    <p>Sign up to receive our daily Workout of the Day and Food of the Day mailings and register for our Newsletter to get the latest race information and discounts.</p>
                    <a href="#" target="_blank"><img src="img/button_sign_up.jpg" alt="Learn More" /></a>
                </div>
                <div class="sub-contents sub-contents3">
                    <h6>Join the Community</h6>
                    <p>Connect with us online to get the latest from Spartan HQ and the rest of the Spartan racing community.</p>
                    <div class="social">
                        <a href="#" class="twitter" target="_blank">&nbps;</a>
                        <a href="#" class="facebook" target="_blank">&nbps;</a>
                        <a href="#" class="pinterest" target="_blank">&nbps;</a>
                        <a href="#" class="instagram" target="_blank">&nbps;</a>
                        <a href="#" class="venmo" target="_blank">&nbps;</a>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="bottom">
                <div class="copyright">
                    Copyright&copy; 2001-2014 SpartanRace, Inc. All Rights Reserved.
                </div>
                <div class="links">
                    <a href="#" target="_blank">Contact</a>
                    <span>|</span>
                    <a href="#" target="_blank">Sponsors</a>
                </div>
                <div class="clearfix"></div>
            </div>
        </footer>

        <!--div class="placement"></div-->

        <form name="image_upload_form" id="image_upload_form"  method="post" enctype="multipart/form-data" action="upload.php?act=image" target="upload_iframe">
          <input name="photo" id="file" class="file" size="27" type="file" />      
          <input type="hidden" name="height" value="600" class="height" />
          <input type="hidden" name="width" value="600" class="width" />
          <input type="submit" name="action" value="Upload" />
        </form>

        <form name="image_crop_form" id="image_crop_form" method="post" action="upload.php?act=crop" target="upload_iframe">
            <input type="hidden" name="img_src" id="img_src" class="img_src" /> 
            <input type="hidden" name="height" value="0" class="height" />
            <input type="hidden" name="width" value="0" class="width" />
            <input type="hidden" id="y1" class="y1" name="y" />
            <input type="hidden" id="x1" class="x1" name="x" />
            <input type="hidden" id="y2" class="y2" name="y1" />
            <input type="hidden" id="x2" class="x2" name="x1" />
        </form>

        <form name="erase_image_form" id="erase_image_form" method="post" action="upload.php?act=erase" target="upload_iframe">
            <input type="hidden" name="img_src" id="img_src" class="img_src" /> 
            <input type="hidden" name="text1" value="0" class="text1" />
            <input type="hidden" name="values" value="0" class="values" />
        </form>

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
