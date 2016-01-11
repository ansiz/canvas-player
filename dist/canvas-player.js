(function (cp) {
	'use strict';
	cp.initPlayer = function (params, callback) {
		cp.player = this;
		this.defaultOpts = {
				fps: 25,
				width: 320,
				height: 240,
				scale: 1,
				selector: 'canvas-player',
				audio: 'audio',
				poster: '',
				loop: false,
				buffer: 50, //define how many frames should be buffered
				resources: [{
					type: 'images', //images ,bigImg or video
					src: "",
					count: 0,
					bit: 0,
					wildcard: "",
					fileType: "",
					manifest: [],
				}]
			},
			this.status = {
				loaded: false,
				playing: false,
				played: false,
				paused: false,
				buffering: false,
				end: function () {
					// console.log('video end');
					// cp.player.status.playedTimes++;
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
			this._image = {},
			this.el = typeof this._opts.selector === 'string' ? document.querySelector('#' + this._opts.selector) : this._opts.selector,
			this.ela = typeof this._opts.audio === 'string' ? document.querySelector('#' + this._opts.audio) : this._opts.audio;
		if (!this.el) {
			return console.warn('Error. No element found for selector', this._opts.selector);
		}
		this.init();
		if (!this.ela) {
			return console.warn('Error. No audio element found', this._opts.audio);
		}
		if (typeof callback === "function") {
			callback();
		}
		return this;
	};

	cp.initPlayer.prototype = {
		load: function (callback) {
			if (cp.player.status.loaded) return;
			cp.player.status.loaded = true;
			for (var i = 0; i < this._opts.resources.length; i++)
				manifestGen(this._opts.resources[i]);
			this.preload = new createjs.LoadQueue(true);
			this.preload.on('fileload', this.handleFileLoad);
			this.preload.on('progress', this.handleLoadProgress);
			this.preload.on('complete', this.handleLoadComplete);
			this.preload.on('error', this.loadError);
			if (this._opts.resources.manifest === 0) {
				console.error("Has no specified resources!");
				return;
			}
			for (var i = 0; i < this._opts.resources.length; i++)
				this.preload.loadManifest(this._opts.resources[i].manifest);
			if (typeof callback === "function") {
				callback();
			}
			return this;
		},
		play: function (index, callback) {
			var p = cp.player;
			var s = p.status;
			p.audio = document.getElementById(p._opts.audio);
			if (p.status.playing === true) return;
			switch (p._opts.resources[0].type) {
			case 'images':
				if (index) {
					console.log('call play at ' + this.status.last);
				} else {
					var ctx = p.canvas.getContext('2d');
					p.timer = window.setInterval(function () {
						if (p.status.current >= p._opts.resources[0].count) {
							p.pause();
							p.ended();
							return;
						}
						if (s.current + p._opts.buffer < p._opts.resources[0].manifest.length) {
							p._image = p.preload.getResult(p._opts.resources[0].manifest[s.current + p._opts.buffer].id);
							if (p._image === undefined) {
								p.buffering();
								return;
							}
						}
						p._image = p.preload.getResult(p._opts.resources[0].manifest[p.status.current++].id);
						var images = new createjs.Bitmap(p._image);
						ctx.drawImage(images.image, 0, 0, p.canvas.width, p.canvas.height);
					}, 1000 / p._opts.fps);
					p.audio.play();
					p.status.played = true;
					p.status.playing = true;
				}
				break;
			case 'bigImg':
				var c = p.resources[0]; //c means config
				var s = p.status;
				if (index) {
					console.log('call play at ' + this.status.last);
				} else {
					var ctx = p.canvas.getContext('2d');
					p._image = p.preload.getResult(p._opts.resources[0].manifest[s.current + p.buffer].id);
					if (p._image === undefined) {
						p.buffering();
						return;
					}
					p._image = p.preload.getResult(p._opts.resources[0].manifest[s.current++].id);
					var images = new createjs.Bitmap(p._image);
					p.timer = window.setInterval(function () {
						if (s.current >= p._opts.resources[0].count) {
							p.pause();
							p.ended();
							return;
						}
						s.currentX += c.width;
						p.stauts.currentCol++;
						if (s.currentCol > c.col) {
							s.currentCol = 0;
							s.currentX = 0
							s.currentRow++;
							p.currentY += c.height
						}
						ctx.drawImage(images.image, x, y, p.canvas.width, p.canvas.height);
					}, 1000 / p._opts.fps);
					p.audio.play();
					s.played = true;
					s.playing = true;
				}
				break;
			case 'video':
				break;
			default:
				console.error('unsupport source type!');
				return;
			}
		},
		pause: function (callback) {
			this.status.last = this.status.current;
			this.status.playing = false;
			this.audio.pause();
			window.clearInterval(this.timer);
			if (typeof callback === "function") {
				callback();
			}
		},
		buffering: function (callback) {
			if (typeof this.bufferCallback === "function") {
				this.bufferCallback();
			}
			this.status.buffering = true;
			this.pause();
			this.timer = setInterval(function () {
				if (cp.player.preload.getResult(cp.player._opts.resources[0].manifest[cp.player.status.current + cp.player._opts.buffer].id)) {
					cp.player.status.buffering = false;
					clearInterval(cp.player.timer);
					cp.player.play();
				}
			}, 200);
			if (typeof callback === "function") {
				callback();
			}
		},
		ended: function (callback) {
			this.audio.currentTime = 0;
			if (this._opts.resources.length > 1) {
				this._opts.resources.splice(0, 1);
				this.status.current = 0;
				this.play();
				return;
			}
			if (typeof callback === "function") {
				callback();
			}
		},
		init: function (callback) {
			this.canvas = document.getElementById(this._opts.selector);
			this.canvas.width = this._opts.width;
			this.canvas.height = this._opts.height;
			if (!this.canvas.getContext) {
				console.log("Canvas not supported. Please install a HTML5 compatible browser.");
				return;
			}
			this.stage = new createjs.Stage(canvas);
			this.stage.scaleX = this._opts.scale;
			this.stage.scaleY = this._opts.scale;
			if (typeof callback === "function") {
				callback();
			}
		},
		handleFileLoad: function (evt) {

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
		handleTick: function (evt) {

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