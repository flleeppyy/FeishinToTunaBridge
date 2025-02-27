interface FeishinSong {
  id: string;
  itemType: import("../enums/feishin").FeishinLibraryItem.SONG;
  uniqueId: string;
  name: string;
  // In milliseconds
  duration: number;

  artistName: string;
  genres: FeishinGenre[];
  artists: FeishinArtist[]
  albumArtists: FeishinArtist[];
  albumId: string;
  album: string;

  discNumber: number;
  discSubtitle: Nullable<string>;
  trackNumber: number;
  bpm: Nullable<number>;

  imageUrl: Nullable<string>;
  imagePlaceholderUrl: Nullable<string>;
  releaseDate: Date;
  releaseYear: string;

  streamUrl: string;

  serverId: string;
  serverType: FeishinServerType;
  createdAt: Date;
  /* Path on the servers disk to the song */
  path: string;
  // In bytes
  size: number;
  updatedAt: Date;

  userFavorite: boolean;
  // ???
  userRating: Nullable<string>;
  playCount: number;
  lastPlayedAt: Nullable<Date>;

  // ???
  peak: Nullable<FeishinGaininfo>;
  gain: Nullable<FeishinGaininfo>;
  /* Bitrate in KB */
  bitRate: number;
}

interface FeishinArtist {
  id: string;
  name: string;
  imageUrl: Nullable<string>;
}

interface FeishinGenre {
  id: string;
  name: string;
  imageUrl: Nullable<string>;
  itemType: "genre",
}

interface FeishinGaininfo {
  // In Decibels
  track?: number;
  album?: number;
}


type FeishinServerType = "jellyfin" | "navidrome" | "subsonic"

