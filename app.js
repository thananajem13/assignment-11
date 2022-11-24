import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import 'dotenv/config' 
// dotenv.config({ path: path.join(__dirname, './config/.env') })
console.log({env:process.env.api_key});
import express from 'express'
import session from 'express-session'
import MongoDBStore from 'connect-mongodb-session'
import flash from 'connect-flash'
import * as authController from './src/modules/auth/controller/auth.js'
const mongoSession = MongoDBStore(session);

import * as indexRouter from './src/modules/index.router.js'

import { connectDB } from './DB/connection.js'
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, './src/views/utils')))
 
app.use(express.json())
var store = new mongoSession({
    uri: process.env.DBURI,
    collection: 'mySessions'
});
app.use(session({
    secret: `${process.env.sessionKeyAuth}`,
    resave: false,
    saveUninitialized: true,
    store
}))

app.use(flash())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './src/views'))


app.use('/auth', indexRouter.authRouter)
app.use('/user', indexRouter.userRouter)
app.use('/note', indexRouter.noteRouter)
app.use('/', authController.displayHomepage)
app.use('*',(req,res)=>{
    res.status(400).json({message:"invalid url or method or both)"})
})
connectDB()
app.listen(port, () => console.log(`Example app listening on port ${port}!`))