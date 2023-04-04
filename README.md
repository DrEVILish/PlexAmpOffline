# PlexAmpOffline

Created to allow you to use the built-in offline feature within Plex/PlexAmp and still be able to use 3rd party applications to access and playback the offlined media. PlexAmp is incharge of the data and offlining and caching, ensuring a singular source of media.

This then adds a file system reference to the same data on the drive without duplicating data with a file extension (need to update to detect accurate file extensions) currently only supports FLAC.

Currently unable to extract names of offlined media, except metadata. Important this only works with FLAC files currently.

Designed to run on macOS, compatible with DJ Pro.

Need to implement an ability to extract the name of the Offlined item from the data stored within, /Users/[username]/Library/Application Support/Plexamp
