//note : all files that were changed , added are as follows : App.jsx, download.jsx, app.css , 
// other is just the structure of the project.
// it is built with react and vite.


import { useEffect, useRef, useState } from 'react'
import quranNasheed25 from '../i_read_quran-background-nasheed-25-499776.mp3'
import quranNasheed27 from '../i_read_quran-background-nasheed-27-499783.mp3'
import nasheed from '../nasheed.mp3'
import './App.css'
const tracks = [ //this function is used to create a list of tracks that will be displayed in the app. 
  //Each track has an id, title, artist, genre, duration, audio file, and color associated with it.
  { id: 1, title: 'Background Nasheed 25', artist: 'I Read Quran', genre: 'Nasheed', duration: '--:--', audio: quranNasheed25, color: '#e8a66b' },
  { id: 2, title: 'Background Nasheed 27', artist: 'I Read Quran', genre: 'Nasheed', duration: '--:--', audio: quranNasheed27, color: '#76a59b' },
  { id: 3, title: 'Nasheed', artist: 'Your library', genre: 'Nasheed', duration: '--:--', audio: nasheed, color: '#907ca8' },
]
const formatTime = (seconds) => { //this function is used 
  //to format the time in seconds into a string in the format of minutes:seconds.

  if (!Number.isFinite(seconds)) return '0:00' //if the input is not a finite number, 
  //return '0:00' as the formatted time.
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` //format the time into minutes:seconds
}

function App() { //this is the main component of the app. It manages the state and behavior of the music player.
  //const vs var vs let: const is used to declare variables that cannot be reassigned, while var and let can be reassigned.

  const [currentTrackId, setCurrentTrackId] = useState(1)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(68)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [search, setSearch] = useState('')
  const [activeGenre, setActiveGenre] = useState('All tracks')
  const [trackDurations, setTrackDurations] = useState({})
  const audioRef = useRef(null)

  const currentTrack = tracks.find((track) => track.id === currentTrackId) ?? tracks[0]
  // Get a list of all unique genres in the tracks array
  const genres = ['All tracks', ...new Set(tracks.map((track) => track.genre))]
  const visibleTracks = tracks.filter((track) => { //works when user searches for a track or filters by genre. 
    //It checks if the track's title or artist includes the search term (case-insensitive) and if the track's genre matches the active genre filter.

    const matchesSearch = `${track.title} ${track.artist}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (activeGenre === 'All tracks' || track.genre === activeGenre)
  })

  useEffect(() => { // This effect runs whenever the current track, play state, or volume changes.
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume / 100
    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [currentTrackId, isPlaying, volume])

  useEffect(() => {
    tracks.forEach((track) => {
      const audio = new Audio(track.audio)
      audio.addEventListener('loadedmetadata', () => {
        setTrackDurations((prev) => ({ ...prev, [track.id]: formatTime(audio.duration) }))
      })
    })
  }, [])

  const selectTrack = (trackId) => { // This function is used to select a track and start playing it.
    setCurrentTrackId(trackId)
    setCurrentTime(0)
    setDuration(0)
    setIsPlaying(true)
  }

  const changeTrack = (direction) => { // This function is used to 
  // change the current track based on the direction (1 for next, -1 for previous).
    const currentIndex = tracks.findIndex((track) => track.id === currentTrackId)
    const nextIndex = (currentIndex + direction + tracks.length) % tracks.length
    selectTrack(tracks[nextIndex].id)
  }

  const togglePlayback = () => setIsPlaying((playing) => !playing)
// This function is used to toggle the playback state (play/pause) of the current track.
  const seek = (event) => {
    const nextTime = Number(event.target.value)
    setCurrentTime(nextTime)
    if (audioRef.current) audioRef.current.currentTime = nextTime
  }

  const downloadTrack = () => {
    const link = document.createElement('a')
    link.href = currentTrack.audio
    link.download = `${currentTrack.title}.mp3`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  return ( //basically the return statement is used to render the UI of the app. 
    //It includes the main structure of the app, including the header, hero section, 
    // playlist panel, and now playing section.
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">♫</span><span>sonora</span></div>
        <nav aria-label="Main navigation"><a className="active" href="#discover">Discover</a><a href="#library">Your library</a></nav>
        <button className="profile-button" aria-label="Open profile">JD</button>
      </header>

      <section className="hero-section" id="discover">
        <div>
          <p className="eyebrow">Your daily soundtrack</p>
          <h1>Find your<br /><em>frequency.</em></h1>
          <p className="hero-copy">Good music, carefully curated. Tune in to something that feels like you.</p>
        
        </div>
        <div className="hero-art" aria-hidden="true"><span>x</span><span>◌</span><span>✧</span></div>
      </section>

      <section className="content-grid">
        <div className="playlist-panel" id="library">
          <div className="section-heading"><div><p className="eyebrow">The collection</p><h2>Browse tracks</h2></div><span className="track-count">{tracks.length} tracks</span></div>
          <label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search artists or songs" aria-label="Search artists or songs" /></label>
          <div className="genre-list" aria-label="Filter by genre">{genres.map((genre) => <button className={activeGenre === genre ? 'genre active' : 'genre'} key={genre} onClick={() => setActiveGenre(genre)}>{genre}</button>)}</div>
          <div className="track-list">
            {visibleTracks.length ? visibleTracks.map((track, index) => <button className={track.id === currentTrackId ? 'track-row selected' : 'track-row'} key={track.id} onClick={() => selectTrack(track.id)}>
              <span className="track-number">{track.id === currentTrackId && isPlaying ? '♫' : String(index + 1).padStart(2, '0')}</span><span className="track-cover" style={{ backgroundColor: track.color }}>{track.title.charAt(0)}</span><span className="track-info"><strong>{track.title}</strong><small>{track.artist}</small></span><span className="track-genre">{track.genre}</span><span className="track-duration">{trackDurations[track.id] || track.duration}</span><span className="more">···</span>
            </button>) : <p className="empty-state">No tracks match that search.</p>}
          </div>
        </div>

        <aside className="now-playing">
          <div className="now-playing-label"><span className="live-dot"></span>Now playing</div>
          <div className="album-art" style={{ backgroundColor: currentTrack.color }}><span>{currentTrack.title.charAt(0)}</span><i>✦</i></div>
          <p className="eyebrow">{currentTrack.genre}</p><h2>{currentTrack.title}</h2><p className="artist-name">{currentTrack.artist}</p>
          <input className="progress" type="range" min="0" max={duration || 0} step="0.1" value={currentTime} onChange={seek} aria-label="Track progress" />
          <div className="time-row"><span>{formatTime(currentTime)}</span><span>{formatTime(duration)}</span></div>
          <div className="player-controls"><button onClick={() => changeTrack(-1)} aria-label="Previous track">◀◀</button><button className="play-button" onClick={togglePlayback} aria-label={isPlaying ? 'Pause' : 'Play'}>{isPlaying ? 'Ⅱ' : '▶'}</button><button onClick={() => changeTrack(1)} aria-label="Next track">▶▶</button></div>
          <label className="volume-control"><span>⌁</span><input type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(event.target.value)} aria-label="Volume" /><span>{volume}%</span></label>
          <button className="download-button" onClick={downloadTrack}>↓ Download track</button>
          <audio ref={audioRef} src={currentTrack.audio} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)} onEnded={() => changeTrack(1)} />
        </aside>
      </section>
    </main>
  )
}

export default App
