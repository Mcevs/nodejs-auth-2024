require('dotenv').config()
const connectDB = require('./db/connect')
const express = require('express')
const app = express()
const authRouter =require('./routes/auth')
const adminRouter = require('./routes/admin')
const homeRouter = require('./routes/home')
const uploadImageRouter = require('./routes/image-routes')

//middleware
app.use(express.json())

//routes
app.use('/api/auth', authRouter)
app.use('/api/admin',adminRouter)
app.use('/api/home', homeRouter)
app.use('/api/image', uploadImageRouter)

const port = process.env.PORT || 3000 
const start = async ()=>{
await connectDB(process.env.MONGO_URI)  

app.listen(port, ()=>{console.log(`Server Listening at port ${port}`);
})
}

start()






