console.log("lets do js");

var currentSong = new Audio(); 
var x;
let songs;
var currFolder;
let link="https://github.com/Rohit-Rasal/Spotify-clone-json/blob";

function convertSecondsToMinutesSeconds(totalSeconds) {
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = parseInt(totalSeconds % 60);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

async function getSongs(folder) {
    currFolder = folder;

    // let a = await fetch("http://127.0.0.1:5500/Project/Spotify/songs/");
    // let a = await fetch(`http://192.168.17.32:5500/songs/${folder}/`);
    // let a = await fetch(`http://192.168.17.32:5500/songs/${currFolder}/`);
    // let a = await fetch(`http://172.20.10.3:5500/Spotify/songs/${currFolder}/`);
    // let a = await fetch(`http://172.16.7.196:5500/songs/currFolder}/`);
    
    // let a = await fetch("Project\Spotify\songs");
    
    let a = await fetch(`${link}/songs/${currFolder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}/`)[1]);
        }
    }

    // show all songs in playlist

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = "";
    for (const song of songs) {

        songUL.innerHTML = songUL.innerHTML + `<li>          
        <img  class="invert " src="./assets/music.svg" alt="">
        <div class="info">
            <div>  ${song.replaceAll("%20", " ")} </div>
            <div>Song Artist</div>
        </div>
        <div class="playNow">
        <img  class="invert" src="./assets/playnow.svg" alt="">
        </div>
        </li>`;
    }
        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
            e.addEventListener('click', element => {
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    
            })
        })
        return songs;
    }

    const playMusic = (track, pause = false) => {
        currentSong.src = `/songs/${currFolder}/` + track;
        // 

        if (!pause) {
            currentSong.play()
            play.src = "./assets/pause.svg"
        }
        document.querySelector(".songinfo").innerHTML = `<marquee>${decodeURI(track)}</marquee>`

        document.querySelector(".songtime").innerHTML = "0.00/0.00";

    }

    async function displayAlbums(){
        let a = await fetch(`${link}/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let array= Array.from(anchors) 

    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
        if(e.href.includes("/songs/"))
        {

            let folder = e.href.split('/').slice(-1)[0];
            // get the meta data of the folder
            let a = await fetch(`${link}/songs/${folder}/info.json`);
            let response = await a.json();
            let cardcontainer=document.querySelector(".cardcontainer")
            cardcontainer.innerHTML=cardcontainer.innerHTML+`  <div  data-folder="${folder}" class="card ">
            <img src="${link}/songs/${folder}/cover.jpg" alt="cover">
            <div class="play">
                <img src="./assets/play.svg" alt="">
            </div>
            <h2>${response.title}</h2>
            <p>
                ${response.description}
            </p>
        </div>`
            
        }
    }

      // load the playlist whenever the card is clicked
        Array.from(document.querySelectorAll(".card")).forEach(e => {
        e.addEventListener("click", async item => {

            await getSongs(`${item.currentTarget.dataset.folder}`)
            playMusic(songs[0]);
        })
    })
    
    }


    async function main() {
        await getSongs("Romantic");
        playMusic(songs[0], true);
    

    // to add playlist dynamically
    displayAlbums();

    // playbar cha play pause saathi

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "./assets/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "./assets/musicplay.svg"
        }
    })

    // song cha time chi info update honya saathi
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutesSeconds(currentSong.currentTime)}/${convertSecondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // seekbar update karnya saathi
    document.querySelector(".seekbar").addEventListener("click", (e) => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;

    })

// hamburgur
document.querySelector(".hamburgur").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0px";
})

let crosss = document.getElementsByClassName('cross');
console.log(crosss);
for (let i = 0; i < crosss.length; i++) {
    crosss[i].addEventListener('click', () => {
        console.log('hello');
    });
}
    
   

    // eventlistner for previous song
    previous.addEventListener("click", () => {
        index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    })

    // eventlistner for next song
    next.addEventListener("click", () => {
        index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    })

    // to adjust the volume of the song
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = e.target.value / 100;
    })
    
    // To mute the song
     let mute=document.querySelector(".volume>img");
     mute.addEventListener("click",(e)=>{
        if(e.target.src.includes("volume.svg"))
        {
            e.target.src = e.target.src.replace("volume.svg","mute.svg");
            // currentSong.muted=true
            currentSong.volume=0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg");
            currentSong.volume=0.1;
        }

        
    })

  



    }


main();
