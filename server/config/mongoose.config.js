const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/restaurant', {useNewUrlParser: true, useUnifiedTopology: true})
.then( () => console.log("MongoDB connected"))
.catch(err => console.log("Error", err));