# canvas-player.js
[中文文档](https://github.com/ansiz/canvas-player/blob/master/README-zh-CN.md)

**canvas-player** is a tools for playback of short videos or frames images on canvas elements. Import preloadJS for resources loading.

* **Why use canvas for playing video?**
  Because video elements play video in full-screen on iOS, and some android phones or apps limit some feature of video elements, that reduce compatibility of video, why not try canvas?

* **Is that support audio?**
  Yes!

## Resouces preparation

First, convert you video into single frames using [ffmpeg](https://www.ffmpeg.org/):

```
mkdir frames
ffmpeg -i SampleVideo.mp4 -vf scale=640:-1 -r 24 frames/%04d.jpg
```

If you want to play sprite images in canvas-player,you should use montage[( download link)](http://montage.ipac.caltech.edu/docs/download.html) to stich all the frames into one big image:

```
montage -border 0 -geometry 320x -tile 10x -quality 60% frames/*.jpg output.jpg
```

##Start

```
	canvasPlayer = new cp.initPlayer({
		id: 'canvasPlayer1',
		width: 320,
		height: 240,
		type: "images",
		selector: 'canvas1',
		resources: [{
			type: "images",
			src: "resources/images",
			count: 341,
			bit: 3,
			wildcard: "out_",
			fileType: "jpg",
			manifest: []
		}, {
			type: "images",
			src: "resources/images",
			count: 341,
			bit: 3,
			wildcard: "out_",
			fileType: "jpg",
			manifest: []
		}]
	});
```
###Parameters




