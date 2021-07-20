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
        }],
    iceCandidatePoolSize: 10,
    iceTransportPolicy: 'all'
}