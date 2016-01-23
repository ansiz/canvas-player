var canvas, video, audio, timer, canvasPlayer, canvasPlayer1;


$(document).ready(function () {
	canvas = document.getElementById('canvas3');
	video = document.getElementById('video');
	// images test
	// canvasPlayer = new cp.initPlayer({
	// 	id: 'canvasPlayer1',
	// 	width: 320,
	// 	height: 240,
	// 	type: "images",
	// 	selector: 'canvas1',
	// 	resources: [{
	// 		type: "images",
	// 		src: "resources/images",
	// 		count: 341,
	// 		bit: 3,
	// 		wildcard: "out_",
	// 		fileType: "jpg",
	// 		manifest: []
	// 	}, {
	// 		type: "images",
	// 		src: "resources/images",
	// 		count: 341,
	// 		bit: 3,
	// 		wildcard: "out_",
	// 		fileType: "jpg",
	// 		manifest: []
	// 	}]
	// });

	//bigImage test
	canvasPlayer = new cp.initPlayer({
		id: 'canvasPlayer1',
		width: 320,
		height: 240,
		selector: 'canvas2',
		resources: [{
			type: "bigImg",
			col: 10,
			row: 10,
			src: "resources/images/big",
			count: 1,
			bit: 3,
			wildcard: "out_",
			fileType: "jpg",
			manifest: []
		}, {
			type: "bigImg",
			col: 10,
			row: 10,
			src: "resources/images/big",
			count: 1,
			bit: 3,
			wildcard: "out1_",
			fileType: "jpg",
			manifest: []
		}]
	});

	$('#btn-video-play').click(function () {
		video.play();
	});
	$('#btn-video-pause').click(function () {
		video.pause();
	});

	$('#btn-images-play').click(function () {
		canvasPlayer.load();
		canvasPlayer.play();
	});

	$('#btn-images-pause').click(function () {
		canvasPlayer.pause();
	});

	$('#btn-big-play').click(function () {
		canvasPlayer.load();
		canvasPlayer.play();
	});

	$('#btn-big-pause').click(function () {
		canvasPlayer.pause();
	});

	$('#btn-big-previous').click(function () {
		canvasPlayer.jumpto(0);
	});


	$('#btn-big-next').click(function () {
		canvasPlayer.jumpto(1);
	});
	// $('#btn-big-play').click(function () {
	// 	canvasPlayer1.load();
	// 	canvasPlayer1.play();
	// });
	// $('#btn-big-pause').click(function () {
	// 	canvasPlayer1.pause();
	// });
	//video source canvas
	var v = document.getElementById("video");
	var canvas3 = document.getElementById("canvas3");
	ctx = canvas3.getContext('2d');
	v.addEventListener('play', function () {
		timer = window.setInterval(function () {
			ctx.drawImage(v, 0, 0, 320, 240);
		}, 20);
	}, false);
	v.addEventListener('pause', function () {
		window.clearInterval(timer);
	}, false);
	v.addEventListener('ended', function () {
		clearInterval(timer);
	}, false);

});