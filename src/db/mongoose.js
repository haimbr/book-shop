const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_KEY, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
