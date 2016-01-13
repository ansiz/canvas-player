# canvas-player.js

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

If you want to play sprite images in canvas-player,you should use ImageMagicks [montage](http://www.imagemagick.org/script/montage.php) to stich all the frames into one big image:

```
montage -border 0 -geometry 320x -tile 10x -quality 60% frames/*.jpg output.jpg
```





