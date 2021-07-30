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
        },
        {
            urls: ["stun:ss-turn1.xirsys.com"]
        }, {
            username: "hj9Rc3Q-bRAerupsfCdqy80NHXeO936VLkK6xnGNZSGFB3brvQuG7k-S6Nw7ijCBAAAAAGEDXDxsbXN0dXJuNA==",
            credential: "51171e30-f0d9-11eb-b7fa-0242ac140004",
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