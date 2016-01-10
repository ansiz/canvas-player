(function (cp) {
	'use strict';
	// var a = new cp.player({
	// 	type: "test",
	// 	resources: {
	// 		src: "resources/images",
	// 		count: 341,
	// 		bit: 3,
	// 		wildcard: "out_",
	// 		fileType: "jpg",
	// 		manifest:[]
	// 	}
	// })
	cp.initPlayer = function (params) {
		cp.player = this;
		this.defaultOpts = {
				fps: 25,
				width: 320,
				height: 240,
				scale: 1,
				type: 'images', //images ,bigImg or video
				selector: '#canvas-player',
				audio: '#audio',
				poster: '',
				loop: false,
				buffer: 50, //define how many frames should be buffered
				resources: {
					src: "",
					count: 0,
					bit: 0,
					wildcard: "",
					fileType: "",
					manifest: [],
				}
			},
			this.status = {
				loaded: false,
				playing: false,
				played: false,
				paused: false,
				end: function () {
					console.log('video end');
					cp.player.status.playedTimes++;
				},
				last: 0,
				current: 0,
				total: 0,
				error: null,
				loadProgress: 0,
				loadComplete: false,
				playedTimes: 0,
			},
			this.preload = {},
			this._opts = merge(this.defaultOpts, params),
			this.el = typeof this._opts.selector === 'string' ? document.querySelector(this._opts.selector) : this._opts.selector,
			this.ela = typeof this._opts.audio === 'string' ? document.querySelector(this._opts.audio) : this._opts.audio;
		if (!this.el) {
			return console.warn('Error. No element found for selector', this._opts.selector);
		}
		this.initCanvas();
		if (!this.ela) {
			return console.warn('Error. No audio element found', this._opts.audio);
		}
		return this;
	};

	cp.initPlayer.prototype = {
		load: function () {
			if (cp.player.status.loaded) return;
			cp.player.status.loaded = true;
			manifestGen(this._opts.resources);
			this.preload = new createjs.LoadQueue(true);
			this.preload.on('fileload', this.handleFileLoad);
			this.preload.on('progress', this.handleLoadProgress);
			this.preload.on('complete', this.handleLoadComplete);
			this.preload.on('error', this.loadError);
			if (this._opts.resources.manifest === 0) {
				console.error("Has no specified resources!");
				return;
			}
			this.preload.loadManifest(this._opts.resources.manifest);
			return this;
		},
		play: function (index) {
			var p = cp.player;
			if (index) {
				console.log('call play at ' + this.status.last);
			} else {
				var ctx = p.canvas.getContext('2d');
				p.timer = window.setInterval(function () {
					if (p.status.current >= p._opts.resources.count) {
						p.pause();
						p.status.end();
						return;
					}
					var _image = p.preload.getResult(p._opts.resources.manifest[p.status.current++].id);
					var images = new createjs.Bitmap(_image);
					ctx.drawImage(images.image, 0, 0, p.canvas.width, p.canvas.height);
				}, 1000 / p._opts.fps);
				// playAudio('#audio1');
				p.status.played = true;
				p.status.playing = true;

			}
		},
		pause: function () {
			this.status.last = this.status.current;
			window.clearInterval(this.timer);
		},
		buffering: function () {

		},
		initCanvas: function () {
			this.canvas = $(this._opts.selector)[0];
			this.canvas.width = this._opts.width;
			this.canvas.height = this._opts.height;
			if (!this.canvas.getContext) {
				console.log("Canvas not supported. Please install a HTML5 compatible browser.");
				return;
			}
			this.stage = new createjs.Stage(canvas);
			this.stage.scaleX = this._opts.scale;
			this.stage.scaleY = this._opts.scale;
		},
		handleFileLoad: function () {

		},
		handleLoadProgress: function (evt) {
			cp.player.status.loadProgress = evt.progress;
		},
		handleLoadComplete: function (evt) {
			cp.player.status.loadComplete = true;
		},
		loadError: function (evt) {
			cp.player.status.error = evt;
		},
		handleTick: function () {

		}
	};

	function manifestGen(src) {
		var content, i, fileName;
		for (i = 0; i < src.count; i++) {
			var number = PrefixInteger(i, src.bit);
			fileName = src.wildcard + number;
			content = {
				src: src.src + '/' + fileName + '.' + src.fileType,
				id: fileName
			};
			src.manifest.push(content);
		}
	}

	function PrefixInteger(num, length) {
		return (Array(length).join('0') + num).slice(-length);
	}

	//Play when resources loaded 25%+
	function handlePreplay() {
		$('#loading').addClass('hidden');
		timerA = window.setInterval(function () {
			handleTick("manifest", timerA);
		}, 1000 / properties.fps);
		playAudio('#audio1');
	}

	//load complete
	function handleComplete(evt) {
		// $('#loading').addClass('hidden');
		// console.log('load complete!');
		// console.log(Date());
		// timerA = window.setInterval(function () {
		// 	handleTick("manifest");
		// }, 1000 / properties.fps);
	}

	function loadError() {
		console.log('load error');
	}

	function handleTick(target, timer) {
		if (pauseCount !== -1 && counter !== -2) {
			counter = pauseCount;
			pauseCount = -1;
		}
		if (canvas.pause === true)
			return;
		_image = preload.getResult(properties[target][counter].id);
		if (counter + 100 < properties[target].length - 1) {
			nextImage = preload.getResult(properties[target][counter + 100].id);
			if (nextImage === undefined) {
				window.clearInterval(timer);
				canvas.pause = true;
				pauseCount = counter;
				pauseFunc(target, timer);
				return;
			}
		}
		images = new createjs.Bitmap(_image);
		ctx = canvas.getContext("2d");
		ctx.drawImage(images.image, 0, 0, canvas.width, canvas.height);
		counter++;
		if (counter > properties[target].length - 1) {
			stage.play = false;
			counter = 0;
			window.clearInterval(timerA);
			window.clearInterval(timerB);
			window.clearInterval(timerC);
			window.clearInterval(timerPause);
			if (target === "manifestC") {
				document.removeEventListener('touchmove', touchMoveFunc, false);
				$('#canvas-input').toggleClass('hidden');
			}
			if (target === "manifestE" || target === "manifestD") {
				document.addEventListener('touchend', function () {
					window.location.href = 'http://m.sjawards.com';
				}, false);
				counter = -2;
			}
			document.addEventListener('touchmove', touchMoveFunc, false);
		}
	}

	function pauseFunc(target, timer) {
		$("#progress").addClass("hidden");
		$("#loading").toggleClass("hidden");
		$("#progressC").toggleClass("hidden");
		progressText = "已加载 " + (preload.progress * 100 | 0) + " %";
		$('#progressC').text(progressText);
		if (target == "manifestD") {
			pauseAudio("#audio3");
		}
		if (target == "manifestE") {
			pauseAudio("#audio2");
		}
		timerPause = window.setInterval(function () {
			if (counter + 100 < properties[target].length - 1) {
				cacheImage = preload.getResult(properties[target][counter + 100].id);
				if (cacheImage) {
					if (canvas.pause === false)
						return;
					$("#loading").toggleClass("hidden");
					window.clearInterval(timerPause);
					//console.log(timerPause);
					if (target == "manifestD") {
						playAudio('#audio3');
					}
					if (target == "manifestE") {
						playAudio('#audio2');
					}
					timer = window.setInterval(function () {
						handleTick(target, timer);
					}, 1000 / properties.fps);
					canvas.pause = false;
				}

			}
		}, 2000);
	}

	function merge() {
		var obj = {},
			key;
		for (var i = 0; i < arguments.length; i++) {
			for (key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) {
					obj[key] = arguments[i][key];
				}
			}
		}
		return obj;
	}



})(window.cp || (window.cp = {}));