import { retrieveTracks, retrieveUsers, retrieveStreamings, buildTrackFromJson } from "../src/services/externalDataService";
import { User } from "../src/types/User";
import { Streaming } from "../src/types/Streaming";
import { Track } from "../src/types/Track";

describe("test retrieve tracks", () => {
    it("should retrieve the tracks", async () => {
        const tracks: Track[] = await retrieveTracks();
        expect(tracks).toBeTruthy();
        expect(tracks.length  > 0).toBe(true);
        expect(tracks[0].id).toEqual("71f4ca0346edbe5327af3885e2253928");
    });
});

describe("test retrieve users", () => {
    it("should retrieve the users", async () => {
        const users: User[] = await retrieveUsers();
        expect(users).toBeTruthy();
        expect(users.length  > 0).toBe(true);
    });
});

describe("test retrieve streamings", () => {
    it("should retrieve the streamings", async () => {
        const streamings: Streaming[] = await retrieveStreamings();
        expect(streamings).toBeTruthy();
        expect(streamings.length  > 0).toBe(true);
    });
});

describe("test buildTrackFromJson buils Track properly", () => {
    it("should build a corrrect track", async () => {
        const jsonTrack = `{
            "71700f062f1e57e4d2beea5b9db11b7b": "4c13ba007f89a425f2117885f90375ea",
            "track name 1": "track name 3",
            "label 1": "label 1"
          }
        `;
        const track: Track = buildTrackFromJson(JSON.parse(jsonTrack));
        expect(track).toBeTruthy();
        expect(track.id).toEqual("4c13ba007f89a425f2117885f90375ea");
        expect(track.name).toEqual("track name 3");
        expect(track.label).toEqual("label 1");
    });
});

describe("test  User factory method buils User properly", () => {
    it("should build a corrrect user", async () => {
        const userValues = ["7699007", "premium", "7,99", "app_store"];

        const user: User = new User(...userValues);
        expect(user).toBeTruthy();
        expect(user.id).toEqual("7699007");
        expect(user.productType).toEqual("premium");
        expect(user.fee.toString()).toEqual("7.99");
        expect(user.origin).toEqual("app_store");
    });
});

describe("test build Streamings factory buils Streaming properly", () => {
    it("should build a corrrect Streaming", async () => {
        const streamingValues: any[] = [new Date("01/03/2019"), "7699007", "US", "71700f062f1e57e4d2beea5b9db11b7b", "2263"];


        const streaming: Streaming = new Streaming(...streamingValues);
        expect(streaming).toBeTruthy();
        expect(streaming.date).toEqual(new Date("01/03/2019"));
        expect(streaming.userId).toEqual("7699007");
        expect(streaming.region).toEqual("US");
        expect(streaming.trackId).toEqual("71700f062f1e57e4d2beea5b9db11b7b");
        expect(streaming.seconds.toString()).toEqual("2263");

    });
});

