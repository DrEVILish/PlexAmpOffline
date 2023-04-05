#!/usr/bin/env node
var fs = require("fs")
var path = require("path")
const { isBuffer } = require("util")

var plexAmpOffline = "/Users/DrEVILish/Library/Application Support/Plexamp/Offline/"
var plexAmpOfflineFLAC = "/Users/DrEVILish/Music/PlexAmp"

function songFileNameFromGUID(json,guid){
  const item = json.items.find((i) => i.guid == guid)
  if (!item) return false

  return item.title.replace(/\//g, '') + " - " + item.grandparentTitle.replace(/\//g, '') + " - " + item.parentTitle.replace(/\//g, '') + "." + item.media[0].parts[0].key.split('.').pop()
}


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

        // NEW PLAYLIST FOLDER
        fs.mkdir(path.join(plexAmpOfflineFLAC,playlist),(err)=>{ if (err) throw err })

        const json = JSON.parse(fs.readFileSync(path.join(plexAmpOffline,playlist,"index.json")))

        fs.readdir(path.join(plexAmpOffline,playlist),(err,songs)=>{
          songs.forEach((song,j,songs)=>{
            if(song.includes(".")) return
            if(song.includes("-")) return
            var songTitleDotExt = songFileNameFromGUID(json,song)
            if(!songTitleDotExt) return
            console.log(song)
            console.log(songTitleDotExt)
            fs.link(path.join(plexAmpOffline,playlist,song),path.join(plexAmpOfflineFLAC,playlist,songTitleDotExt),(err)=>{
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
