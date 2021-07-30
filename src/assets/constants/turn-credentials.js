export const TURN_CREDENTIAL = {
    iceServers: [
        {
            urls: [
                "stun:stun1.l.google.com:19302",
            ]
        },
        {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
        },
        {
            urls: ["stun:ss-turn2.xirsys.com"]
        }, {
            username: "96n6W8SV0HfX6fbvlfFP_IHXIxeCwTHfvPmFQ0tB_3tmvuThpMrbRdAXLE9ho1awAAAAAGD2nv1sbXN0dXJuMQ==",
            credential: "76344926-e941-11eb-8b89-0242ac140004",
            urls: [
                "turn:ss-turn2.xirsys.com:80?transport=udp",
                "turn:ss-turn2.xirsys.com:3478?transport=udp",
                "turn:ss-turn2.xirsys.com:80?transport=tcp",
                "turn:ss-turn2.xirsys.com:3478?transport=tcp",
                "turns:ss-turn2.xirsys.com:443?transport=tcp",
                "turns:ss-turn2.xirsys.com:5349?transport=tcp"
            ]
        },
        {
            urls: ["stun:ss-turn2.xirsys.com"]
        }, {
            username: "sVWtBirTkzIrPpgiH8yuqvrQjjuWlp7fdrm1RCqsHeLUuFQIldMd6Y9dSDGGUK53AAAAAGD5lCFsbXN0dXJuMg==",
            credential: "c0c0f2d6-eb04-11eb-9b6f-0242ac140004",
            urls: [
                "turn:ss-turn2.xirsys.com:80?transport=udp",
                "turn:ss-turn2.xirsys.com:3478?transport=udp",
                "turn:ss-turn2.xirsys.com:80?transport=tcp",
                "turn:ss-turn2.xirsys.com:3478?transport=tcp",
                "turns:ss-turn2.xirsys.com:443?transport=tcp",
                "turns:ss-turn2.xirsys.com:5349?transport=tcp"
            ]
        },
        {
            urls: ["stun:ss-turn1.xirsys.com"]
        }, {
            username: "2wZQVQjtRRCRrlFCiAiyVI2LvcdzOpHGw2-TVCBn35pcQVfklM--e61StwnknLY9AAAAAGEDW0xsbXN0dXJuMw==",
            credential: "c1f32636-f0d8-11eb-baad-0242ac140004",
            urls: [
                "turn:ss-turn1.xirsys.com:80?transport=udp",
                "turn:ss-turn1.xirsys.com:3478?transport=udp",
                "turn:ss-turn1.xirsys.com:80?transport=tcp",
                "turn:ss-turn1.xirsys.com:3478?transport=tcp",
                "turns:ss-turn1.xirsys.com:443?transport=tcp",
                "turns:ss-turn1.xirsys.com:5349?transport=tcp"
            ]
        }
    ],
    iceCandidatePoolSize: 10,
    iceTransportPolicy: 'all'
}