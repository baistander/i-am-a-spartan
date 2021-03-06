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
		echo '<p class="uperror">Please upload again. Maximum file size exceeded.</p>';
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
	$thumb_width = 560;
	$thumb_height = 560;

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
		$overlay = imagecreatefrompng('img/image-overlay-new.png');

		// Resize and crop
		imagecopyresampled($thumb, $image, 0 - ($new_width - $thumb_width) / 2, 0 - ($new_height - $thumb_height) / 2, $x, $y, $new_width, $new_height, $width, $height);

		//add overlay
		imagecopy($thumb, $overlay, 0, 0, 0, 0, $thumb_width, $thumb_height);

		imagejpeg($thumb, $filename, 100);
		imagedestroy($image);
	} elseif(isset($arr['erase']) && $arr['erase'] === true){
		$values = json_decode($arr['values']);
		$data_vals = array();
	
		for ($i=0; $i<$thumb_width; $i++) {
			$data_vals[$i] = array();
		}

		$brushSize = 10 * $arr['size'];

		for ($i=0; $i<count($values); $i++) {
			$x = $values[$i]->X;
			$y = $values[$i]->Y;

			for($j=-$brushSize; $j<=$brushSize; $j++){
				for($k=-$brushSize; $k<=$brushSize; $k++){
					$dist = sqrt($j*$j+$k*$k);
					if($dist <= $brushSize){
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

		//$text1 = imagettfbbox(76, 0, $font_path, $arr['text1']);

		$texts1 = explode("\n", $arr['text1']);
		$texts2 = array();
		$texts2Count = 0;
		$lines = 0;

		for($i=0; $i<count($texts1) && $lines < 6; $i++){
			$text = $texts1[$i];
			$text_data = imagettfbbox(76, 0, $font_path, $text);
			$split_text = false;
			$split_index = 0;
			$lines++;

			if($text_data[2] > 520){
				$split_text = true;
			}

			while($text_data[2] > 520){
				$space = false;
				if(strpos($text, ' ')){
					$split_index = strrpos($text, ' ');
					$space = true;
				} else {
					$split_index = strlen($text)-1;
				}

				$text = substr($text, 0, $split_index);
				$text_data = imagettfbbox(76, 0, $font_path, $text);

				if(!$space){
					$split_index--;
				}
			}

			$texts2[$texts2Count] = $text;
			$texts2Count++;

			if($split_text){
				$texts1[$i] = substr($texts1[$i], $split_index+1);
				$i--;
			}
		}

		// Print Text On Image
		for($i=0; $i<count($texts2); $i++){
			imagettftext($thumb, 76, 0, 21, 14+78+$i*80, $white, $font_path, $texts2[$i]);
		}

		// Erase part of image
		$eraseSize = 1;

		for ($i=0; $i<$thumb_width-$eraseSize; $i++) {
			for($j=0; $j<$thumb_height; $j++){
				if(isset($data_vals[$i][$j])){
					imagecopy($thumb, $image, $i, $j, $i, $j, $eraseSize, $eraseSize);
				}
			}
		}

		imagejpeg($thumb, $filename, 100);
		imagedestroy($image);
	} else{
		$exif = exif_read_data($arr['temp_uploadfile']);

		if(!empty($exif['Orientation'])) {
		    switch($exif['Orientation']) {
		        case 8:
		            $image = imagerotate($image, 90, 0);
		            break;
		        case 3:
		            $image = imagerotate($image, 180, 0);
		            break;
		        case 6:
		            $image = imagerotate($image, -90, 0);
		            break;
		    }
		}

		imagejpeg($image, $filename, 100);
		imagedestroy($image);
	}
	
	// echo $user_id;
	// delete old file
	echo $filename;
}

?>