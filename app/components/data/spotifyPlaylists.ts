export type SpotifyPlaylist = {
  id: string
  title: string
  description: string
  playlistId: string
}

export const spotifyPlaylistUrl = (playlistId: string) =>
  `https://open.spotify.com/playlist/${playlistId}`

export const spotifyPlaylistEmbedUrl = (playlistId: string) =>
  `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`

export const dnbDoctorSpotifyPlaylists: SpotifyPlaylist[] = [
  {
    id: 'monthly-neurofunk',
    title: 'Monthly Neurofunk Selection',
    description: 'Fresh, heavy neurofunk picks updated regularly — built for late-night headphones and club systems.',
    playlistId: '5VPtC2C3IO8r9oFT3Jzj15',
  },
  {
    id: 'dnb-doctor-exclusives',
    title: 'DNB Doctor Exclusives',
    description: 'Cuts from DNB Doctor artists and affiliates — dark rollers, surgical tech, and label energy.',
    playlistId: '2GD72ly17HcWc9OAEtdUBP',
  },
]

