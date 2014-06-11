<?php
	include('func.php');

	if($_GET['act'] == 'image'){
		$arr = array(
			'uploaddir'	=> 'uploads/big/',
			'tempdir'	=> 'uploads/temp/',
			'height'	=> $_POST['height'],
			'width'		=> $_POST['width'],
			'x'			=> 0,
			'y'			=> 0
		);
		
		uploadImg($arr);
	} elseif($_GET['act'] == 'crop'){
		$arr = array(
			'uploaddir' 	=> 'uploads/crop/',
			'tempdir'		=> 'uploads/temp/',
			'height'		=> $_POST['height'],
			'width'			=> $_POST['width'],
			'x'				=> $_POST['x'],
			'y'				=> $_POST['y'],
			'img_src'		=> $_POST['img_src'],
			'crop'			=> true
		);

		cropImg($arr);
		exit;
	} elseif($_GET['act'] == 'erase'){
		$arr = array(
			'uploaddir' 	=> 'uploads/erase/',
			'tempdir'		=> 'uploads/temp/',
			'text1'			=> strtoupper($_POST['text1']),
			'values'		=> strtoupper($_POST['values']),
			'size'			=> intval($_POST['size']),
			'img_src'		=> $_POST['img_src'],
			'erase'			=> true
		);

		writeImg($arr);
		exit;
	} else{
		//
	}