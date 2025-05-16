type FeishinState = {
    status: import("../enums/feishin").PlayerStatus,
    repeat: import("../enums/feishin").FeishinRepeatState,
    shuffle: boolean,
    volume: number,
    song: FeishinSong
    position: number,
    lastPosition: number,
}

type FeishinWSEventObject<T = FeishinWSEventAny> = {
  data: T;
  event: import("../enums/feishin.websocket").FeishinWSEvent;
} 

type FeishinWSEventAny =
  FeishinWSEventPosition |
  FeishinWSEventSong |
  FeishinWSEventState |
  FeishinWSEventPlayback |
  FeishinWSEventVolume |
  FeishinWSEventShuffle |
  FeishinWSEventRepeat

type FeishinWSEventPosition = number;
type FeishinWSEventSong = FeishinSong;
type FeishinWSEventState = FeishinState;
type FeishinWSEventPlayback = import("../enums/feishin").PlayerStatus;
type FeishinWSEventVolume = number;
type FeishinWSEventShuffle = boolean;
type FeishinWSEventRepeat = import("../enums/feishin").FeishinRepeatState;
