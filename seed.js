var Message = require('./database/schemas/Message');

Message.create({
    "room_slug" : "aab",
    "message" : "tien dzai nhat tren the gioi",
    "owner_info" : {
        "owner_id" : "5a20703a6800d66b6fa264e7",
        "first_name" : "Tien",
        "last_name" : "Pham"
    },
    "created_at" : 121223
})
