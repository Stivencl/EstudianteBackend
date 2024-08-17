const express = require("express"); 
const cors = require("cors");
const mongoose = require("mongoose");
const send = require("send");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

//Conexion a la DB
const mongoUri = process.env.MONGODB_URI;

try{
    mongoose.connect(mongoUri);
    console.log("¡Conexion exitosa!");
}catch(error){
    console.log("Error de conexion a la DB", error);
}

//Esquema de la DB
const estudiantEsquema = new mongoose.Schema({
    id_Estudiante: Number,
    nombre: String,
    
});

const Estudiantes = mongoose.model("estudiante", estudiantEsquema);

//Ruta para consultar estudiantes en al DB
   app.get("/estudiante", async (req, res) =>{
    try{
        const estudiante = await Estudiantes.find();
        res.json(estudiante);
    }catch(error){
        res.status(500).send("Error al realizar la consulta de estudiantes",error);

    }
   });

   //Token
app.use((req, res, next) => {
    const authtoken = req.headers["authorization"];
    if(authtoken === "miTokensecreto123"){
          next();
    }else{
       res.status(401).send("Acceso no autorizado");
    }
 });

// Ruta Crear un estudiante nuevo 

app.post("/estudiante", async (req, res) =>{
    const estudiante = new Estudiantes({
        id_Estudiante: req.body.id_Estudiante,
        nombre: req.body.nombre
    })
    try{
        await estudiante.save();
        res.json(estudiante);
    }catch(error){
        res.status(500).send("Error, no se puedo guardar el estudiante en la DB",error);

    }
});


//Ruta para actualizar estudiante
 
app.put("/estudiante/:id", async (req, res) =>{
    try{
        let id = req.params.id;
        const estudiante = await Estudiantes.findByIdAndUpdate(id, {id_Estudiante:req.body.id_Estudiante, nombre:req.body.nombre}, {new:true});
        if(estudiante){
            res.json(estudiante);
        }else{
            res.status(404),send("Estudiante no actualizado");
        }
    }catch(error){
        res.status(500).send("Error al actualizar el estudiante",error);
    }
});

//RUTA PARA ELIMINAR ESTUDIANTE
 app.delete("/estudiante/:id", async (req, res) =>{
    try{
        let id = req.params.id;
        const estudiante = await Estudiantes.findByIdAndDelete(id);
        if(estudiante){
            res.json(estudiante);
        }else{
            res.status(404).send("No es encontro el estudiante para ser eliminado");
        }
    }catch(error){
        res.status(404).send("Error al eliminar el estudiante", error);
    }
 });
// Para consultar por ID
  app.get("/estudiante/:id", async (req, res) =>{
        try{
            let id = req.params.id;
            const estudiante = await Estudiantes.findById(id);
            if(estudiante){
                res.json(estudiante);
            }else{
                res.status(404).send("El estudiante no existe en la DB");
            }
        }catch(error){
            res.status(404).send("Estdudiante no se encuentra en la DB",error);

        }
  });

app.listen(3000, () =>{
    console.log("Server => http://localhost:3000/");
});