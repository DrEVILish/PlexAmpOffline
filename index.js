var fs = require("fs")
var path = require("path")
const { isBuffer } = require("util")

var plexAmpOffline = "/Users/DrEVILish/Library/Application Support/Plexamp/Offline/"
var plexAmpOfflineFLAC = "/Users/DrEVILish/Music/PlexAmp"

clearPlaylists = () => {
  return new Promise((resolve, reject) => {
    console.log("start")

    fs.readdir(plexAmpOfflineFLAC, (err, playlists) => {
      if (err) { 
          reject(err)
          return
      }

      playlists.forEach((playlist, i) => {
        if (playlist.startsWith('.')) return;
        fs.rmSync(path.join(plexAmpOfflineFLAC, playlist), { recursive: true, force: true });

        // Check if it's the last iteration of the loop
        if (i === playlists.length - 1) { 
          console.log("midpoint")
          resolve() 
        }
      })
    })
  })
}

makePlaylists = () => {
  return new Promise((resolve, reject) => {
    fs.readdir(plexAmpOffline, (err, playlists)=>{
      playlists.forEach((playlist,i,playlists)=>{
        if(playlist.startsWith(".")) return
        fs.mkdir(path.join(plexAmpOfflineFLAC,playlist),(err)=>{ if (err) throw err })
        fs.readdir(path.join(plexAmpOffline,playlist),(err,songs)=>{
          songs.forEach((song,j,songs)=>{
            if(song.includes(".")) return
            var songDotFlac = song + ".flac"
            console.log(song)
            fs.link(path.join(plexAmpOffline,playlist,song),path.join(plexAmpOfflineFLAC,playlist,songDotFlac),(err)=>{
              if(err) throw err
            })
            // Check if it's the last iteration of the loop
            if (i === playlists.length - 1 && j === songs.length - 1) { 
              console.log("ending")
              resolve() 
            }
          },playlist)
        })
      })
    })
  })
}

clearPlaylists()
.then(
  makePlaylists()
)
.catch((err)=> { console.error('An error occurred:', err) })