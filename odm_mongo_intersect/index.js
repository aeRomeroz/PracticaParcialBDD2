import mongoose from 'mongoose';
import {getdata} from './api.js';
const { Schema, model } = mongoose;
let uri = 'mongodb://127.0.0.1:27017/practicaParcial';
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
  intersect: ["DARWIN"], // Ahora es un array de strings
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
    
   const courseSchema = new mongoose.Schema({
    course_id: {type: String, required: true},
    title: {type: String, required: true},
    dept_name: {type: String, required: true},
    credits: {type: Number, required: true},
   });

   const takesSchema = new mongoose.Schema({
		ID: {type:String, required: true},
    course_id: {type:String, required: true},
    sec_id: {type:String, required: true},
    semester: {type:String, required: true},
    year: {type:Number, required: true},
    grade: {type:String},
   });

   takesSchema.index({course_id:1, year: -1});

   const totcreditsSchema = new mongoose.Schema({
    sum: {type: String, required: true},
   });

  ///////    MODELOS   ///////

   let Course = mongoose.model('Course', courseSchema);
   let Takes = mongoose.model('Takes', takesSchema);
   let TotCredits = mongoose.model('TotCredits', totcreditsSchema);

  ///////    AGREGACIONES   ///////

  let CoursesByDept = mongoose.model(
    'CoursesByDept', new mongoose.Schema({
      _id: String, totalCursos: Number
    })
  );
  
  let CoursesPerYear = mongoose.model(
    'CoursesPerYear', new mongoose.Schema({
      _id: mongoose.Types.Decimal128, totalCursos: Number
    })
  );

   console.log(Takes)
   try {

    await Course.insertMany(query.course);
    await Takes.insertMany(query.takes);
    await TotCredits.insertMany(query.total_credits)

    console.log('Datos insertados correctamente')

    /////////// AGREGACIONES EN MongoDB ///////////

    //// 1. Obtener cursos de 4 creditos agrupados por departamento ////
    const CoursesByDept = await Course.aggregate ([
      { $match : {credits: 4}},
      { $group : {_id: "$dept_name", totalCursos: {$sum: 1 }}},
      { $sort : {totalCursos: -1}}
    ])
    console.log('Cursos de 4 creditos por departamento: ', CoursesByDept)

    ///// Guardar resultados en MongoDB /////
    await Promise.all(CoursesByDept.map(async (doc) => {
      await CoursesByDept.updateOne({_id: doc._id}, {$set :{ totalCursos: doc.totalCursos }
      }, {upsert: true});
    }))
    console.log('Cursos de 4 creditos insertados en Compass')

    ///// 2. Contar el numero de cursos tomados por año /////
    const coursesPerYear = await Takes.aggregate([
      {$group: {_id: "$year", totalCursos: { $sum : 1}}},
      {$sort: {_id:1}}
    ])
    console.log('Numero de cursos tomados por año:', coursesPerYear)

    ///// Guardar resultados en MongoDB /////
    await Promise.all(coursesPerYear.map(async (doc)=> {
      await CoursesPerYear.updateOne({ id: doc._id}, {$set: {totalCursos: doc.totalCursos}
      }, {upsert: true})
    }))
    
	 process.exit(0);
	} catch (e) {
	 console.log('Some error');
	 console.log(e);
	 process.exit(0);
	}
   