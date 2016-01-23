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
				currentCol: 0,
				currentRow: 0,
				counter: 0,
				total: 0,
				error: null,
				loadProgress: 0,
				loadComplete: false,
				playedTimes: 0,
			},
			this.cache = {},
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
			for (i = 0; i < this._opts.resources.length; i++)
				this.preload.loadManifest(this._opts.resources[i].manifest);
			if (typeof callback === "function") {
				callback();
			}
			return this;
		},
		play: function (index, callback) {
			var p = cp.player;
			var s = p.status;
			p.audio = document.getElementById(p._opts.audio + index);
			if (!index) {
				index = 0;
			}
			p.now = p._opts.resources[index];
			p.videoid = index;
			if (p.status.playing === true) return;
			switch (p.now.type) {
			case 'images':
				var ctx = p.canvas.getContext('2d');
				p.timer = window.setInterval(function () {
					if (p.status.current >= p.now.count) {
						p.pause();
						p.ended();
						return;
					}
					if (s.current + p._opts.buffer < p.now.manifest.length) {
						p._image = p.preload.getResult(p.now.manifest[s.current + p._opts.buffer].id);
						if (p._image === undefined) {
							p.buffering();
							return;
						}
					}
					p._image = p.preload.getResult(p.now.manifest[p.status.current++].id);
					var images = new createjs.Bitmap(p._image);
					ctx.drawImage(images.image, 0, 0, p.canvas.width, p.canvas.height);
				}, 1000 / p._opts.fps);
				if (p.audio) {
					p.audio.play();
				}
				p.status.played = true;
				p.status.playing = true;
				break;
			case 'bigImg':
				var c = p.now; //c means config
				p._opts.buffer = 1;
				var ctx = p.canvas.getContext('2d');
				//init counter
				if (s.current === 0) {
					s.currentY = 0;
					s.currentX = 0;
				}
				if (s.current + 1 < p.now.manifest.length) {
					p._image = p.preload.getResult(p.now.manifest[s.current + 1].id);
					if (p._image === undefined) {
						p.buffering();
						return;
					}
				}
				p.timer = window.setInterval(function () {
					if (cp.player.status.current >= c.count) {
						cp.player.pause();
						cp.player.ended();
						return;
					}

					var fx = Math.floor(cp.player.status.counter % c.col) * cp.player._opts.width,
						fy = Math.floor(cp.player.status.counter / c.col) * cp.player._opts.height;

					if (fy > cp.player._opts.height * c.row) {
						s.current++;
						cp.player.status.counter = 0;
					}
					p._image = p.preload.getResult(p.now.manifest[s.current].id);
					var images = new createjs.Bitmap(p._image);
					ctx.clearRect(0, 0, cp.player._opts.width, cp.player._opts.height); // clear frame
					ctx.drawImage(images.image, fx, fy, cp.player._opts.width, cp.player._opts.height, 0, 0, cp.player._opts.width, cp.player._opts.height);

					cp.player.status.counter++;
				}, 1000 / p._opts.fps);
				if (p.audio) {
					p.audio.play();
				}
				s.played = true;
				s.playing = true;

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
			if (this.audio) {
				this.audio.pause();
			}
			window.clearInterval(this.timer);
			if (typeof callback === "function") {
				callback();
			}
		},
		jumpto: function (index, keep, callback) {
			if (this._opts.resources[index] === undefined || index === undefined || index === null || index === '') {
				console.log('Specified resources is not exist. Please set a valid index value');
				return;
			}
			this.pause();
			this.now = this._opts.resources[index];
			if (!keep) {
				this.status.current = 0;
			}
			this.play(index);
		},
		next: function (callback) {
			this.jumpto(++this.videoid);
		},
		previous: function (callback) {
			this.jumpto(--this.videoid);
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
			if (this._opts.resources.length > this.videoid) {
				this.status.current = 0;
				this.play(++this.videoid);
				return;
			}
			this.status.current = 0;
			console.log('ended');
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