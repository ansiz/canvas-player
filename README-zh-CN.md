# canvas-player.js

**canvas-player** 是一个使用preloadJS加载资源的基于canvas的视频、图片、精灵图为一体的播放器

* **为什么要使用canvas来进行播放?**
  因为video在iOS的safari浏览器下会被全屏播放，在许多应用软件中也是如此，并且在很多安卓设备上由于各家厂商的设计差异，video的接口和表现都有差异，兼容性上存在很多问题，所以我们试试canvas

* **支持音频吗?**
  支持!

## 资源准备

首先你应该使用工具将你的视频切分成帧序列图片，以ffmpeg为例，你可以使用下述命令轻松完成视频的切分工作。 [ffmpeg](https://www.ffmpeg.org/):

```
mkdir frames
ffmpeg -i SampleVideo.mp4 -vf scale=640:-1 -r 24 frames/%04d.jpg
```

如果你想使用这个小插件播放精灵图，那么你还应该使用montage将上述帧序列图片拼接成大图， [montage下载戳这里](http://montage.ipac.caltech.edu/docs/download.html)  montage命令如下:

```
montage -border 0 -geometry 320x -tile 10x -quality 60% frames/*.jpg output.jpg
```

##简单使用

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
```javascript






