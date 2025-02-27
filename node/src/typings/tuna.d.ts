
type TunaData = {
  status: import("../enums/tuna").PlayerStatus,
  cover: Nullable<string>;
  title: string, 
  artists: string[], 
  progress: number,
  duration: number,
  album: Nullable<string>
  albumUrl?: Nullable<string>
}