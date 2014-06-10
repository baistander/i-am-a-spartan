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
	if(isset($arr['height'])){
		$height		= $arr['height'];
		$width		= $arr['width'];
	}

	if(isset($arr['x'])){
		$x			= $arr['x'];
		$y			= $arr['y'];
	}

	if(isset($arr['ext']) && $arr['ext'] == 'png'){
		$image = imagecreatefrompng($arr['temp_uploadfile']);
	} elseif(isset($arr['ext']) && $arr['ext'] == 'gif') {
		$image = imagecreatefromgif($arr['temp_uploadfile']);
	} else {
		$image = imagecreatefromjpeg($arr['temp_uploadfile']);
	}

	$filename = $arr['new_uploadfile'];
	$thumb_width = 600;
	$thumb_height = 600;

	// fit and add white frame										
	if(isset($arr['crop']) && $arr['crop'] === true){
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
		$overlay = imagecreatefrompng('img/image-overlay.png');

		// Resize and crop
		imagecopyresampled($thumb, $image, 0 - ($new_width - $thumb_width) / 2, 0 - ($new_height - $thumb_height) / 2, $x, $y, $new_width, $new_height, $width, $height);

		//add overlay
		imagecopy($thumb, $overlay, 0, 0, 0, 0, $thumb_width, $thumb_height);

		imagejpeg($thumb, $filename, 80);
		imagedestroy($image);
	} elseif(isset($arr['erase']) && $arr['erase'] === true){
		$values = json_decode($arr['values']);
		$data_vals = array();
	
		for ($i=0; $i<$thumb_width; $i++) {
			$data_vals[$i] = array();
		} 

		for ($i=0; $i<count($values); $i++) {
			$x = $values[$i]->X;
			$y = $values[$i]->Y;

			for($j=-15; $j<=15; $j++){
				for($k=-15; $k<=15; $k++){
					$dist = sqrt($j*$j+$k*$k);
					if($dist <= 15){
						$newX = $x+$j;
						$newY = $y+$k;

						if($newX >= 0 && $newX <= $thumb_width && $newY >= 0 && $newY <= $thumb_height){
							$data_vals[$newX][$newY] = true;
						}
					}
				}	
			}
		} 

		// Create new image
		$thumb = imagecreatetruecolor($thumb_width, $thumb_height);
		imagecopy($thumb, $image, 0, 0, 0, 0, $thumb_width, $thumb_height);

		// Allocate A Color For The Text
		$white = imagecolorallocate($thumb, 255, 255, 255);
		$font_path = 'fonts/Veneer.ttf';

		//$text1 = imagettfbbox(85, 0, $font_path, $arr['text1']);

		// Print Text On Image
		imagettftext($thumb, 76, 0, 44, 35+78, $white, $font_path, $arr['text1']);

		// Erase part of image
		$eraseSize = 1;

		for ($i=0; $i<$thumb_width-$eraseSize; $i++) {
			for($j=0; $j<$thumb_height*2/3; $j++){
				if(isset($data_vals[$i][$j])){
					imagecopy($thumb, $image, $i, $j, $i, $j, $eraseSize, $eraseSize);
				}
			}
		}

		imagejpeg($thumb, $filename, 80);
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