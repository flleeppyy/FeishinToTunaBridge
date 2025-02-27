import WebSocket from "ws";
import untypedConfig from "../config.json";
import {
	FeishinRepeatState,
	PlayerStatus as FeishinPlayerStatus,
} from "./enums/feishin";
import { FeishinWSEvent } from "./enums/feishin.websocket";
import { PlayerStatus as TunaPlayerStatus } from "./enums/tuna";

const config = untypedConfig as FeiTunaConfig;

const FeishinState: FeishinState = {
	song: null,
	position: null,
	volume: 0,
	status: FeishinPlayerStatus.PAUSED,
	repeat: FeishinRepeatState.NONE,
	shuffle: true,
};

async function connect() {
	const FeishinAuthHeader = `Basic ${Buffer.from(`${config.credentials.feishin.username}:${config.credentials.feishin.password}`).toString("base64")}`;
	const FeishinWS: WebSocket = new WebSocket(config.baseUrls.feishin);

	FeishinWS.onmessage = async (wsevent) => {
		const fEvent = JSON.parse(wsevent.data.toString()) as FeishinWSEventObject;
		switch (fEvent.event) {
			case FeishinWSEvent.STATE: {
				const event = fEvent as FeishinWSEventObject<FeishinWSEventState>;
				feishinPostProcessSong(event.data.song);
				Object.assign(FeishinState, event.data);
				break;
			}
			case FeishinWSEvent.PLAYBACK: {
				const event = fEvent as FeishinWSEventObject<FeishinWSEventPlayback>;
				FeishinState.status = event.data;
				break;
			}
			case FeishinWSEvent.POSITION: {
				const event = fEvent as FeishinWSEventObject<FeishinWSEventPosition>;
				FeishinState.position = event.data;
				break;
			}
			case FeishinWSEvent.REPEAT: {
				const event = fEvent as FeishinWSEventObject<FeishinWSEventRepeat>;
				FeishinState.repeat = event.data;
				break;
			}
			case FeishinWSEvent.SHUFFLE: {
				const event = fEvent as FeishinWSEventObject<FeishinWSEventShuffle>;
				FeishinState.shuffle = event.data;
				break;
			}
			case FeishinWSEvent.SONG: {
				const event = fEvent as FeishinWSEventObject<FeishinWSEventSong>;

				FeishinState.song = event.data;
				break;
			}
			case FeishinWSEvent.VOLUME: {
				const event = fEvent as FeishinWSEventObject<FeishinWSEventVolume>;
				FeishinState.volume = event.data;
				break;
			}
		}

		console.log(`Recieved event ${fEvent.event}`, fEvent.data);
		await sendDataToTuna(FeishinState);
	};

	FeishinWS.onopen = async (_event) => {
		FeishinWS.send(
			JSON.stringify({
				event: "authenticate",
				header: FeishinAuthHeader,
			}),
		);
	};

	FeishinWS.onclose = async (event) => {
		console.warn(
			"Socket is closed. Reconnect will be attempted in 1 second.",
			event.reason,
		);

		setTimeout(() => {
			connect();
		}, 1000);
	};
}

function feishinPostProcessSong(song: FeishinSong) {
	if (song.createdAt !== null) song.createdAt = new Date(song.createdAt);
	if (song.updatedAt !== null) song.updatedAt = new Date(song.updatedAt);
	if (song.lastPlayedAt !== null)
		song.lastPlayedAt = new Date(song.lastPlayedAt);
	if (song.releaseDate !== null) song.releaseDate = new Date(song.releaseDate);

	// Default is 100 from Feishin, 256 or 512 is more acceptable
	song.imageUrl = song.imageUrl.replace(/width=\d*&/, "width=256&");
	song.imagePlaceholderUrl = song.imagePlaceholderUrl?.replace(
		/width=\d*&/,
		"width=256&",
	);

	return song;
}

let tunaFailureCount = 0;
let tunaLastState: TunaData;
async function sendDataToTuna(state: FeishinState) {
	const data: TunaData = {
		status: getStatusForTuna(),
		cover: state.song.imageUrl || state.song.imagePlaceholderUrl,
		title: state.song.name,
		artists: state.song.artists.map((e) => e.name),
		progress: Math.floor(state.position * 1000),
		duration: Math.floor(state.song.duration),
		album: state.song.album,
	};

	if (state.status !== "playing" && tunaLastState.status === data.status)
		return;

	// TODO: Only send updated data, instead of the whole state

	const headers = new Headers();
	headers.set("Accept", "application/json");
	headers.set("Content-Type", "application/json");
	headers.set("Access-Control-Allow-Headers", "*");
	headers.set("Access-Control-Allow-Origin", "*");

	try {
		const response = await fetch(config.baseUrls.tuna, {
			method: "POST",
			headers,
			body: JSON.stringify({
				data,
				hostname: "FeiTunaBridge",
				date: Date.now(),
			}),
		});
		console.info("Pushed tuna status", data);
		tunaLastState = data;

		if (!response.ok) {
			console.warn("Tuna pushing was not okay", response);
		}
	} catch (e) {
		tunaFailureCount++;
		console.error("Tuna push failed", e);
	}
}

function getStatusForTuna(): TunaPlayerStatus {
	let status: TunaPlayerStatus;
	// Assume that position 0 and paused means the user hit stop.
	if (
		FeishinState.position === 0 &&
		FeishinState.status === FeishinPlayerStatus.PAUSED
	)
		status = TunaPlayerStatus.UNKNOWN;
	else if (
		FeishinState.position !== 0 &&
		FeishinState.status === FeishinPlayerStatus.PAUSED
	)
		status = TunaPlayerStatus.STOPPED;
	else if (FeishinState.status === FeishinPlayerStatus.PAUSED)
		status = TunaPlayerStatus.STOPPED;
	else status = TunaPlayerStatus.PLAYING;

	return status;
}

connect();