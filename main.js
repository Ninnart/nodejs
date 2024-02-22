const express = require('express');
const bodyParser = require('body-parser');
const database = require('./database.js');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

database.connect()
    .then(() => {
     console.log('Connected to the db ');
    })
    .catch(err => {
      console.log('Error connecting to the database', err);
      throw err; 
    });

    app.use(cors());

app.post('/Login', async (req, res) => {
      console.log("req" , req);
  try {
    const { username, password } = req.body;
    const params = [username, password];
    const a = await database.query('SELECT * FROM public.users WHERE username=$1 AND password=$2', params);
    console.log(params);

    if (a.rowCount) {
      console.log('ถูกต้อง');
      const userData = {
        validation: true,
      };
      return res.status(200).json(userData);
    } else {
      return res.status(200).json({ msg: 'รหัสไม่ถูก' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message }); // แสดงข้อความข้อผิดพลาดที่เกิดขึ้น

  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.post('/signup', async (req, res) => {
  try {
    const { fullname, username, mail, phone , pass } = req.body;

    const sql = 'INSERT INTO users (fullname,username,email,phone_number,password) VALUES ($1, $2, $3, $4,$5)';
    const values = [fullname, username, mail, phone , pass ];
    await database.query(sql, values);

    console.log('Data inserted successfully');

    // กำหนดส่งค่า 'Access-Control-Allow-Origin' ให้กับ response header เพื่ออนุญาตการเข้าถึง API จากทุกๆ โดเมน
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    res.status(201).json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error.message);
    res.status(500).json({ message: 'Error inserting data' });
  }
});

app.post('/create', async (req, res) => {
  try {
    const {pic , menuname , des , select , ing , ste} = req.body;
    const sqla = 'INSERT INTO recipe (photo , menu_name , description , type , ingredient , step) VALUES ($1, $2 , $3 ,$4 , $5 , $6)';
    const valuesa = [pic , menuname , des , select , ing , ste];
    console.log(valuesa)
    await database.query(sqla, valuesa);
    
    console.log('Data inserted successfully');
    res.status(201).json({ message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error.message);
    res.status(500).json({ message: 'Error inserting data' });
  }
});

// app.post('/create', async (req, res) => {
//     const { pic } = req.body;
//     console.log('Received Base64 Image:');
//     // ทำอะไรกับ Base64 Image ที่ได้รับ ตรวจสอบฐานข้อมูลหรือประมวลผลอื่น ๆ
//     res.status(200).send('Image received and processed');
// });

// app.get('/foodlist', async (req, res) => {
//   try {
//     const sql = 'SELECT * FROM recipe WHERE type = "Food"';
//     const result = await database.query(sql);
    
//     // ตรวจสอบว่ามีข้อมูลหรือไม่
//     if (result.length > 0) {
//       res.status(200).json(result); // ส่งข้อมูลกลับไปให้ client
//     } else {
//       res.status(404).json({ message: 'ไม่พบข้อมูลที่ตรงกับคำขอ' }); // ถ้าไม่มีข้อมูล
//     }
//   } catch (error) {
//     console.error("GET Error", error);
//     res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' }); // ในกรณีที่เกิด error
//   }
// });
app.get('/foodlist', (req, res, next ) => {
  const sql = "SELECT * FROM recipe "
  const parms = []
  database.query(sql,parms,(err,rows)=>{
    if (err){
      res.status(400).json(err)
    }
    res.json(rows.rows)
  }) 

});