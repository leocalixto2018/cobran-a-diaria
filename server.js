const express=require("express"),{Pool}=require("pg"),path=require("path");
const url=process.env.DATABASE_URL||"";
const pool=new Pool({connectionString:url,ssl:/sslmode=require|neon\.tech/.test(url)?{rejectUnauthorized:false}:false});
const app=express();app.use(express.json());
app.get("/api/ov",async(_,res)=>{try{const r=await pool.query("select k,v from overrides");res.json(Object.fromEntries(r.rows.map(x=>[x.k,x.v])))}catch(e){res.status(500).json({})}});
app.post("/api/ov",async(req,res)=>{const{k,v}=req.body||{};if(typeof k!=="string"||typeof v!=="boolean")return res.sendStatus(400);
 try{await pool.query("insert into overrides(k,v) values($1,$2) on conflict(k) do update set v=$2",[k,v]);res.sendStatus(204)}catch(e){res.sendStatus(500)}});
app.use(express.static(__dirname));
pool.query("create table if not exists overrides(k text primary key, v boolean not null)").then(()=>app.listen(process.env.PORT||3000,()=>console.log("ok")));
