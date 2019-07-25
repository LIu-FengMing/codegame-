// model/users.js
//先載入我們要的library
var mongoose = require('mongoose')

//創造資料庫需要的欄位(schema)
var GameMapSchema = mongoose.Schema({
    level:{ type: Number, "default": 0 },
    versionID:{ type: String },
    data:{ type: Array, "default": [
        {
            versionID:{ type: String },
            versionName:{ type: String },
            description:{
                mainGrammar:{ type: Array, "default": [
                        {
                            innerGrammar:{ type: String }
                        }
                    ]
                },
                description:{ type: String },
            },
            canUseInstruction:{ type: Array, "default": [
                {
                    name:{ type: String },
                    usable:{ type: Array, "default": [
                        {
                            value:{ type: String }
                        }
                    ]}
                }
            ]},
            mainCodeDescription:{
                mode:{ type: Number, "default": 0 },
                textarea1:{ type: String },
                textarea2:{ type: String },
                textarea3:{ type: String },
                textarea4:{ type: String },
                textarea5:{ type: String },
                textarea6:{ type: String },
                textarea5:{ type: String },
                textarea6:{ type: String },
                textarea7:{ type: String },
                textarea8:{ type: String },
                img1:{ type: String },
                img2:{ type: String },
                img3:{ type: String },
                img4:{ type: String },
                img5:{ type: String },
                img6:{ type: String },
                img7:{ type: String }
            },
            map:{ type: String }
        }
    ]}
})
