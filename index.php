<?php
    $version = 2.0;
?>

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
        <link rel="stylesheet" href="css/styles.css?v=<?php echo $version; ?>">

        <script src="js/snap.svg-min.js"></script>
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
                <a href="http://www.facebook.com/spartanrace" target="_blank">Gallery</a>
                <a href="http://www.spartan.com/races/races-results/" target="_blank">Find a Race</a>
            </div>
        </header>

        <div class="title">
            <div class="title1">
                <h1>I am a Spartan</h1>
                <h2>Share Your Spartan Story</h2>
            </div>
            <div class="title2">
                <h1>You are a Spartan</h1>
                <h2>Now Share Your Spartan Story</h2>
            </div>
        </div>

        <div class="instructions">
            <div class="instruction instruction1">
                <div class="contents">To Begin,<br> Upload a photo.</div>
                <div class="cta upload"><span class="upload">Upload</span> <span class="icon-up"></span></div>
                <div class="clearfix"></div>
            </div>
            <div class="instruction instruction2">
                <div class="contents">Now,<br> Crop your photo.</div>
                <div class="cta next"><span>Next</span></div>
                <div class="cancel"><span>Cancel</span></div>
                <div class="clearfix"></div>
            </div>
            <div class="instruction instruction3">
                <div class="contents">Now it's time,<br> share your story.</div>
                <div class="cta next"><span>Next</span></div>
                <div class="cancel"><span>Back</span></div>
                <div class="clearfix"></div>
            </div>
            <div class="instruction instruction4">
                <div class="contents">Now you can erase<br> areas that overlap.</div>
                <div class="cta next"><span>Next</span></div>
                <div class="cancel"><span>Back</span></div>
                <div class="clear">Clear <span class="icon-clear"></span></div>
                <div class="clearfix"></div>
            </div>
            <div class="instruction instruction5">
                <div class="cta next"><a class="download-file" href="#" download="SpartanImage"><span>Download</span></a></div>
                <div class="cta facebook"><span>Facebook</span></div>
                <div class="cta twitter"><span>Twitter</span></div>
                <div class="clear"><span class="icon-back"></span> Back</div>
                <div class="clearfix"></div>
            </div>
        </div>

        <div class="controls">
            <div class="zoomOut"><span class="icon-minus"></span></div>
            <div class="zoomIn"><span class="icon-plus"></span></div>
        </div>

        <div class="overlay overlay-top"></div>
        <div class="overlay overlay-bottom"></div>

        <div class="container">
            <div class="sub-container">
                <img class="example2" src="img/example2.jpg" />
                <div class="image-container">
                    <img class="cropper" src="" />
                    <img class="cropped-image" src="" />
                </div>
                <div class="image-overlay"></div>
                <div class="image-overlay-border"></div>
                <div class="image-overlay-rocks"></div>
                <div class="overlay overlay-left"></div>
                <div class="overlay overlay-right"></div>
                <div class="image-border"></div>
                <div class="writing-text">
                    <textarea rows="6" cols="20" class="write1"></textarea>
                </div>
                <canvas id="erase_canvas" class="erase_canvas"></canvas>
                <canvas id="erase_canvas_overlay" class="erase_canvas_overlay"></canvas>
            </div>
        </div>

        <div id="loader" class="pageload-overlay" data-opening="M 0,0 c 0,0 63.5,-16.5 80,0 16.5,16.5 0,60 0,60 L 0,60 Z">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 80 60" preserveAspectRatio="none">
                <path d="M 0,0 c 0,0 -16.5,43.5 0,60 16.5,16.5 80,0 80,0 L 0,60 Z"/>
            </svg>
            <div class="text"></div>
        </div>

        <footer>
            <div class="contents">
                <div class="sub-contents sub-contents1">
                    <h6>About Our Company</h6>
                    <p>Learn more about our company’s mission, reach out and contact us, and find information about sponsorship opportunities.</p>
                    <a href="http://www.spartan.com/about-our-company/" target="_blank"><img src="img/button_learn_more.jpg" alt="Learn More" /></a>
                </div>
                <div class="sub-contents sub-contents2">
                    <h6>Sign Up for Updates</h6>
                    <p>Sign up to receive our daily Workout of the Day and Food of the Day mailings and register for our Newsletter to get the latest race information and discounts.</p>
                    <a href="http://www.spartan.com" target="_blank"><img src="img/button_sign_up.jpg" alt="Learn More" /></a>
                </div>
                <div class="sub-contents sub-contents3">
                    <h6>Join the Community</h6>
                    <p>Connect with us online to get the latest from Spartan HQ and the rest of the Spartan racing community.</p>
                    <div class="social">
                        <a href="https://twitter.com/SpartanRace" class="twitter" target="_blank">&nbps;</a>
                        <a href="http://www.facebook.com/spartanrace" class="facebook" target="_blank">&nbps;</a>
                        <a href="http://pinterest.com/spartanrace/" class="pinterest" target="_blank">&nbps;</a>
                        <a href="http://instagram.com/SpartanRace/" class="instagram" target="_blank">&nbps;</a>
                        <a href="http://vimeo.com/user8045119" class="venmo" target="_blank">&nbps;</a>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="bottom">
                <div class="copyright">
                    Copyright&copy; 2001-2014 SpartanRace, Inc. All Rights Reserved.
                </div>
                <div class="links">
                    <a href="http://www.spartanrace.com/contact-new/" target="_blank">Contact</a>
                    <span>|</span>
                    <a href="http://www.spartan.com/about-our-company/sponsors/" target="_blank">Sponsors</a>
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
            <input type="hidden" name="size" value="1" class="size" />
        </form>

        <iframe id="upload_iframe" class="upload_iframe" name="upload_iframe" src=""></iframe>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.10.2.min.js"><\/script>')</script>
        <script src="js/plugins.js"></script>
        <script src="js/classie.js"></script>
        <script src="js/svgLoader.js"></script>
        <script src="js/main.js?v=<?php echo $version; ?>"></script>

        <div id="fb-root"></div>

        <script>(function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&appId=1496817263869773&version=v2.0";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));</script>

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
