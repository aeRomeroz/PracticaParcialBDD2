import mongoose from 'mongoose';
import {getdata} from './api.js';
const { Schema, model } = mongoose;
let uri = 'mongodb://localhost:27017/uni_2025_ejercicio_4';
//trayendo la data del api
const query = await getdata().then(data=> {
   console.log(data);
   return data;
 }).catch(error => {
   console.log('no va');
   process.exit(0);
 });

/*Valorar el caso en que query sea un array de strins como*/ 
/*let query = {
  intersect: ["DARWIN"], // Ahora es ueln array de strings
};*/
console.log(query);
const options = {
   autoIndex: true, // Don't build indexes
   maxPoolSize: 10, // Maintain up to 10 socket connections
   serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
   socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
   family: 4 // Use IPv4, skip trying IPv6
 };
  mongoose.connect(uri, options).then(
   () => { console.log('se ha conectado exitosamente')
      },
   err => { console.log('no se ha podido conectar') }
   );
    
   const objectSchema = new mongoose.Schema({
    object_mongodb : {
      building: {type: String},
      capacity: {type: Number},
      room_number: {type: String}
    }
   });

   const jsonSchema = new mongoose.Schema({
    json: [{
      object_mongodb : {
        building: {type: String},
        capacity: {type: String},
        room_number: {type: Number}
      }
    }]
   })
   

  ///////    MODELOS   ///////

   let ObjectMdb = mongoose.model('Object', objectSchema);
   let Json = mongoose.model('Json',jsonSchema)

   console.log(query)
   try {
    //Insercion de datos en MongoDB
    console.log('main',query.json)
    await ObjectMdb.insertMany(query.json);
    // Esta linea se utiliza para cuando tengas que trabajar con json anidados.
    await Json.create({json: query.json})

    console.log('Datos insertados correctamente')
    
	 process.exit(0);
	} catch (e) {
	 console.log('Some error');
	 console.log(e);
	 process.exit(0);
	}
   