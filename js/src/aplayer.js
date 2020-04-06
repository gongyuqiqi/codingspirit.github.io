const ap = new APlayer({
  container: document.getElementById('aplayer'),
  autoplay: false,
  audio: [
    {
      name: 'Falling Into A Dream',
      artist: 'Brian Tyler',
      url: 'https://blog-music-host.oss-cn-shanghai.aliyuncs.com/music/Brian%20Tyler%20-%20Falling%20Into%20A%20Dream.mp3',
      cover: 'https://p2.music.126.net/m-zAYKAjy0lb1qBKl_RhiA==/109951164856034586.jpg',
    },
    {
      name: 'Flemington',
      artist: 'Tom Day',
      url: 'https://blog-music-host.oss-cn-shanghai.aliyuncs.com/music/Tom%20Day%20-%20Flemington-128k.mp3',
      cover: 'https://p2.music.126.net/qPWC3bJDmtdDf8QTxipu4Q==/5937362790308604.jpg',
    }
  ]
});
