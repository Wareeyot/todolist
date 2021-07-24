const express = require("express");
const path = require("path");
const app = express();
const TodoTask = require("./models/TodoTask");
const mongoose = require('mongoose')
require('dotenv').config()


mongoose
.connect(process.env.MONGO_URI, {useNewUrlParser: true })
.then(()=> console.log('DB Connect'))
.catch(err => console.error(err));
//require('dotenv').config()
//app.get('/' ,(req,res)=>res.send('DD'))
//console.log(__dirname);
//app.use("/static", express.static("public"));

app.use(express.static('public'));
app.set("view engine", "ejs"); 

app.use(express.urlencoded({extended: true}));
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
    res.render("todo.ejs", { todoTasks: tasks });
    });
    });


app.post('/',async (req, res) => {
        const todoTask = new TodoTask({
        content: req.body.content 
        });
        try {
        await todoTask.save();
        res.redirect("/");
        } catch (err) {
        res.redirect("/");
        }
        });

app.route("/edit/:id")
        .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
        })
        .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
        });
        });

//DELETE
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });

app.listen(8008, () => console.log("Server Up and running"));
