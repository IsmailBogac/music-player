// Şarkı bilgileri ni içeren constructor
function Song(title, artist, file, photo) {
  this.title = title;
  this.artist = artist;
  this.file = file;
  this.photo = photo;
}

// Çalan şarkı bilgilerini veren prototype
Song.prototype.getInfo = function () {
  return `${this.title} - ${this.artist}`;
};

// Şarkı adresini tutan constructor
function MusicPlayer() {
  this.playList = [];
  this.currentIndex = 0;
  this.audio = document.getElementById("audio");
}

// play liste gelen şarkıyı push yapan prototype
MusicPlayer.prototype.addSong = function (song) {
  this.playList.push(song);
  this.saveToLS();
};

// şarkıları LS 'a kaydediyoruz.

MusicPlayer.prototype.saveToLS = function () {
  const playListData = JSON.stringify(this.playList);
  localStorage.setItem("playlist", playListData);
};

// şarkıları LS 'dan getirme

MusicPlayer.prototype.getFromLS = function () {
  const playListData = localStorage.getItem("playlist");
  if (playListData) {
    try {
      const  parsed = JSON.parse(playListData) 
      this.playList = parsed.map(obj => new Song(obj.title,obj.artist,obj.file,obj.photo));
    } catch (error) {
      console.error("LS verisi geçerli bir JSON değil", error);
      // this.playList=[];
    }
  }
};

// şarkıyı çalan prototype

MusicPlayer.prototype.playCurrent = function () {
  if (this.playList.length === 0) return;
  const currentSong = this.playList[this.currentIndex];
  this.audio.src = currentSong.file;
  this.audio.play()

  if(this.playList.length > 0){

    this.audio.play()
    .then(() => {
      document.getElementById("cover").src = currentSong.photo;
      document.getElementById(
        "current"
      ).innerText = ` Şu an çalan: ${currentSong.getInfo()}`;
    
      document.querySelectorAll('.item').forEach((item) => {
        item.classList.remove('playing');
      });

      const currentItem = document.querySelector(`.item[data-index="${this.currentIndex}"]`)
      if(currentItem){
        currentItem.classList.add('playing')

      }

      document.getElementById('play').innerText = 'Pause';

    })
    .catch((error) => { 
      console.log("Şarkı çalarken hata oluştu", error);
    });
  }

  
};

// şarkıyı durduran prototype

// MusicPlayer.prototype.pause = function () {
//   if (this.audio.paused) {
//     this.audio.play();
//   } else {
//     this.audio.pause();
//   }
// };

MusicPlayer.prototype.next = function () {
  if (this.currentIndex < this.playList.length - 1) {
    this.currentIndex++;
  } else {
    this.currentIndex = 0;
  }

  this.playCurrent();
};

const song1 = new Song(
  "Utanmazsan Unutmam",
  "Adamlar",
  "music/sarki1.mp3",
  "photo/adamlar.jpg"
);
const song2 = new Song(
  "Sabah Fabrikam",
  "Sagopa Kajmer",
  "music/sarki2.mp3",
  "photo/sabah-fabrikam.png"
);
const song3 = new Song(
  "Maskeli Balo",
  "Sagopa Kajmer",
  "music/sarki3.mp3",
  "photo/maskeli-balo.jpg"
);
const song4 = new Song(
  "Kendime Yalan Söyledim",
  "Seksendört",
  "music/sarki4.mp3",
  "photo/seksendört.jpg"
);

const player = new MusicPlayer();
// player.getFromLS(); // Şarkıları LS ' den getirme.

player.addSong(song1);
player.addSong(song2);
player.addSong(song3);
player.addSong(song4);

const audio = document.getElementById("audio");
const range = document.getElementById("range");
const list = document.getElementById("play-list");

player.playList.map(function (song, index) {
  const div = document.createElement("div");
  div.className = "item";
  div.innerText = `${song.title}-${song.artist}`;
  div.setAttribute("data-index", index);
  list.appendChild(div);
});



document.getElementById("play").addEventListener("click", function (e) {
  e.stopPropagation();



  if((audio.src === "" || player.audio.src.endsWith('/'))){
      player.playCurrent();
  }
else if(player.audio.paused){
    player.audio.play();
    this.innerText = 'Pause'
  }else{
    player.audio.pause();
    this.innerText = 'Play'
  }
});

document.getElementById("next").addEventListener("click", function (e) {
  e.stopPropagation();
  player.next();
});

// Kendi oluşturduğum progress bar audio objesini block ettim ve audio'ya göre ilerler.
range.value = 0;
audio.addEventListener("timeupdate", function () {
  range.value = (audio.currentTime / audio.duration) * 100;
});

// bir sonraki şarkıya otomatik geçer
audio.addEventListener('ended',function(){
  player.next();
})
// oluşturulan progress bar elle şarkıyı ilerletir

range.addEventListener("input", function () {
  audio.currentTime = (range.value / 100) * audio.duration;
});
const addPlaying = list.addEventListener("click",function  (e) {
  if (e.target.classList.contains("item")) {
    document.querySelectorAll('.item').forEach((item)=>{
      item.classList.remove('playing')
    })

    e.target.classList.add('playing');

    const index = e.target.getAttribute("data-index");
    player.currentIndex = Number(index);
    player.playCurrent();
    e.target.classList.add("playing");
  }
});
