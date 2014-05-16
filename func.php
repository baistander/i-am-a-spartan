<?php
/**
 * AjaxCrop version 0.6
 * version 0.5
 *
 * Copyright (c) 2009-2010 Keith Levi Lumanog
 * www.keithics.com . webmaster@keithics.com
 * DUAL LICENSE - MIT (MIT.TXT) AND GNL (GNL.TXT)
 *
 * portfolio: http://keithics.com/gallery.php
 *
 *
**/

function uploadImg($arr){
	//you can change the name of the file here
	$date 		= md5(time());
	
	//////////// upload image and resize
	$uploaddir 	= $arr['uploaddir'];
	$tempdir	= $arr['tempdir'];
	
	$temp_name 	= $_FILES['photo']['tmp_name'];
	
	$img_parts 	= pathinfo($_FILES['photo']['name']);
	$new_name 	= strtolower($date . '.' . $img_parts['extension']);
	
	$ext = strtolower($img_parts['extension']);
	
	$allowed_ext = array('gif','jpg','jpeg','png');
	if(!in_array($ext, $allowed_ext)){
		echo '<p class="uperror">Please upload again. Only GIF, JPG and PNG files please.</p>';
		exit;
	}
	
	$temp_uploadfile = $tempdir . $new_name;
	$new_uploadfile = $uploaddir . $new_name;
	
	// less than 1.3MB
	if($_FILES['photo']['size'] < 2097000){
		if (move_uploaded_file($temp_name, $temp_uploadfile)) {
			// add key value to arr
			$arr['temp_uploadfile'] = $temp_uploadfile;
			$arr['new_uploadfile'] = $new_uploadfile;
			$arr['ext'] = $ext;
			
			asidoImg($arr);
			
			unlink($temp_uploadfile);
			exit;
		}
	} else {
		echo '<p class="uperror">Please upload again. Maximum filesize is 1.3MB.</p>';
		exit;
	}
}


function cropImg($arr){
	$date = md5(time());	
	$arr['temp_uploadfile'] = $arr['img_src'];
	$arr['new_uploadfile'] = $arr['uploaddir'].strtolower($date).'.jpg';
	
	asidoImg($arr);
	exit;
}

function writeImg($arr){
	$date = md5(time());	
	$arr['temp_uploadfile'] = $arr['img_src'];
	$arr['new_uploadfile'] = $arr['uploaddir'].strtolower($date).'.jpg';
	
	asidoImg($arr);
	exit;
}

function asidoImg($arr){
	include('asido/class.asido.php');

	$asido = new asido;
	$asido->driver('gd');
	
	$height		= $arr['height'];
	$width		= $arr['width'];
	$x			= $arr['x'];
	$y			= $arr['y'];

	if($arr['ext'] == 'png'){
		$image = imagecreatefrompng($arr['temp_uploadfile']);
	} elseif($arr['ext'] == 'gif') {
		$image = imagecreatefromgif($arr['temp_uploadfile']);
	} else {
		$image = imagecreatefromjpeg($arr['temp_uploadfile']);
	}

	$filename = $arr['new_uploadfile'];

	// fit and add white frame										
	if($arr['crop'] === true){
		$thumb_width = 1000;
		$thumb_height = 1000;

		$original_aspect = $width / $height;
		$thumb_aspect = $thumb_width / $thumb_height;

		if ($original_aspect >= $thumb_aspect){
		   $new_height = $thumb_height;
		   $new_width = $width / ($height / $thumb_height);
		} else {
		   $new_width = $thumb_width;
		   $new_height = $height / ($width / $thumb_width);
		}

		$thumb = imagecreatetruecolor($thumb_width, $thumb_height);

		// Resize and crop
		imagecopyresampled($thumb, $image, 0 - ($new_width - $thumb_width) / 2, 0 - ($new_height - $thumb_height) / 2, $x, $y, $new_width, $new_height, $width, $height);
		imagejpeg($thumb, $filename, 80);
		imagedestroy($image);

		//Asido::watermark($i1, 'img/watermark.jpg', ASIDO_WATERMARK_TOP_CENTER, ASIDO_WATERMARK_SCALABLE_DISABLED);
	} elseif($arr['write'] === true){
	      // Allocate A Color For The Text
	      $red = imagecolorallocate($image, 255, 0, 0);
	      $font_path = 'fonts/Arial.ttf';

	      $text1 = imagettfbbox(45, 0, $font_path, $arr['text1']);
	      $text2 = imagettfbbox(75, 0, $font_path, $arr['text2']);

	      // Print Text On Image
	      imagettftext($image, 45, 0, ceil((1000-$text1[2])/2), 20+40+24-8, $red, $font_path, $arr['text1']);
	      imagettftext($image, 75, 0, ceil((1000-$text2[2])/2), 80+60+30+4, $red, $font_path, $arr['text2']);
	      imagejpeg($image, $filename, 80);
	      imagedestroy($image);
	} else{
		imagejpeg($image, $filename, 80);
		imagedestroy($image);
	}
	
	// echo $user_id;
	// delete old file
	echo $filename;
}

?>