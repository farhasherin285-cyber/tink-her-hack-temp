// Simple sensor + notify simulator (Node/Express)
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// simple CORS for local file testing
app.use((req,res,next)=>{ res.setHeader('Access-Control-Allow-Origin','*'); res.setHeader('Access-Control-Allow-Headers','Content-Type'); next(); });

// GET /sensor -> returns simulated sensor reading
app.get('/sensor', (req,res)=>{
  const dehydration = Math.round(20 + Math.random()*70);
  const temp = +(36 + Math.random()*4).toFixed(1);
  res.json({ dehydration, temp });
});

// POST /notify -> accept notification payload
app.post('/notify', (req,res)=>{
  console.log('Notify payload', req.body);
  res.json({ ok:true, message:'notify received (simulated)'});
});

app.listen(port, ()=>console.log(`TinkCare simulator running on http://localhost:${port}`));
