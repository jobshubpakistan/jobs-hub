import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getDatabase, ref, push, set, get, update } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnNGcIA8c2YTco9-zlX57XGLdH_fnk9ME",
  authDomain: "jobshub-949bf.firebaseapp.com",
  projectId: "jobshub-949bf",
  storageBucket: "jobshub-949bf.firebasestorage.app",
  messagingSenderId: "424889281729",
  appId: "1:424889281729:web:871f69acdba330828f3840",
  databaseURL: "https://jobshub-949bf-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const jobs = [
 {title:"Software Developer",category:"Technology",location:"Remote",salary:"Rs. 150,000 / month",image:"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80"},
 {title:"Civil Engineer",category:"Engineering",location:"Lahore",salary:"Rs. 120,000 / month",image:"https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80"},
 {title:"Registered Nurse",category:"Healthcare",location:"Karachi",salary:"Rs. 95,000 / month",image:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80"},
 {title:"Financial Analyst",category:"Finance",location:"Islamabad",salary:"Rs. 130,000 / month",image:"https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80"},
 {title:"Graphic Designer",category:"Design",location:"Remote",salary:"Rs. 85,000 / month",image:"https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80"},
 {title:"Mechanical Engineer",category:"Engineering",location:"Faisalabad",salary:"Rs. 115,000 / month",image:"https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80"}
];

let selectedJob = null;
let selectedMethod = null;

const $ = id => document.getElementById(id);
const modal = $("modal");
const modalBody = $("modalBody");

function user(){ try{return JSON.parse(localStorage.getItem("jobshubUser"));}catch(e){return null;} }
function saveUser(data){ localStorage.setItem("jobshubUser",JSON.stringify(data)); }
function openModal(){ modal.classList.remove("hidden"); }
function closeModal(){ modal.classList.add("hidden"); }

function renderAccount(){
 const area=$("accountArea"),u=user();
 if(u){
   area.innerHTML=`<strong>Hi, ${u.name}</strong><button class="btn outline" id="logout">Logout</button>`;
   $("logout").onclick=()=>{localStorage.removeItem("jobshubUser");renderAccount();};
 }else{
   area.innerHTML=`<button class="btn outline" id="login">Sign In</button><button class="btn" id="signup">Create Account</button>`;
   $("login").onclick=showLogin;$("signup").onclick=showSignup;
 }
}

function renderJobs(){
 $("jobGrid").innerHTML=jobs.map(j=>`
 <article class="jobCard">
 <img src="${j.image}" alt="${j.title}">
 <div class="jobInfo">
 <span class="tag">${j.category}</span><span class="tag">${j.location}</span>
 <h3>${j.title}</h3><p>Explore this opportunity and continue with the JobsHub application process.</p>
 <div class="jobBottom"><span class="salary">${j.salary}</span><button class="apply" data-job="${j.title}">Apply Now</button></div>
 </div></article>`).join("");
 document.querySelectorAll(".apply").forEach(b=>b.onclick=()=>startApply(b.dataset.job));
}

function showSignup(){
 openModal();
 modalBody.innerHTML=`<p class="eyebrow">CREATE ACCOUNT</p><h2>Join JobsHub</h2>
 <form class="form" id="signupForm">
 <input id="name" placeholder="Full name" required>
 <input id="phone" placeholder="Phone number" required>
 <input id="email" type="email" placeholder="Email address" required>
 <input id="password" type="password" placeholder="Password" required>
 <button class="btn">Create Account</button></form>`;
 $("signupForm").onsubmit=e=>{
  e.preventDefault();
  saveUser({name:$("name").value.trim(),phone:$("phone").value.trim(),email:$("email").value.trim().toLowerCase(),password:$("password").value});
  closeModal();renderAccount();if(selectedJob)continueFlow();
 };
}

function showLogin(){
 openModal();
 modalBody.innerHTML=`<p class="eyebrow">WELCOME BACK</p><h2>Sign In</h2>
 <form class="form" id="loginForm">
 <input id="email" type="email" placeholder="Email address" required>
 <input id="password" type="password" placeholder="Password" required>
 <button class="btn">Sign In</button></form><div id="loginMessage"></div>`;
 $("loginForm").onsubmit=e=>{
  e.preventDefault(); const u=user();
  if(!u || u.email!==$("email").value.trim().toLowerCase() || u.password!==$("password").value){
   $("loginMessage").innerHTML='<div class="notice warning">Account not found or password is incorrect.</div>';return;
  }
  closeModal();renderAccount();if(selectedJob)continueFlow();
 };
}

async function getPayments(){
 const snap=await get(ref(db,"payments"));
 return snap.exists()?Object.entries(snap.val()).map(([id,data])=>({id,...data})):[];
}
async function getApplications(){
 const snap=await get(ref(db,"applications"));
 return snap.exists()?Object.entries(snap.val()).map(([id,data])=>({id,...data})):[];
}

function startApply(job){
 selectedJob=job;
 if(!user()){showLogin();return;}
 continueFlow();
}

async function continueFlow(){
 try{
  const u=user();
  const apps=await getApplications();
  if(apps.some(a=>a.email===u.email&&a.job===selectedJob)){
    openModal();modalBody.innerHTML=`<h2>Already Applied</h2><div class="notice">You have already submitted an application for <strong>${selectedJob}</strong>.</div>`;return;
  }
  const payments=await getPayments();
  const payment=payments.find(p=>p.email===u.email&&p.job===selectedJob);
  if(!payment){showPayment();return;}
  if(payment.status==="pending"){
    openModal();modalBody.innerHTML=`<p class="eyebrow">PAYMENT UNDER REVIEW</p><h2>Payment Submitted</h2><div class="notice">Your Rs. 500 payment reference was saved successfully and is waiting for manual confirmation.</div>`;return;
  }
  showApplication();
 }catch(err){
  console.error(err);
  alert("Firebase connection error: "+err.message);
 }
}

function showPayment(){
 openModal();
 modalBody.innerHTML=`<p class="eyebrow">APPLICATION FEE</p><h2>${selectedJob}</h2>
 <div class="notice"><strong>Required fee: Rs. 500</strong><br>Choose a payment method, send the amount manually, then enter your transaction ID.</div>
 <div class="paymentMethods">
 <button class="method" id="jazz">JazzCash<br><small>Bilal Munir</small></button>
 <button class="method" id="easy">Easypaisa<br><small>Bilal Munir</small></button>
 <button class="method" id="upaisa">UPaisa<br><small>Bilal Munir</small></button>
 </div><div class="payInfo" id="payInfo"></div>`;
 $("jazz").onclick=()=>selectMethod("JazzCash","03250555598","jazz");
 $("easy").onclick=()=>selectMethod("Easypaisa","03198682932","easy");
 $("upaisa").onclick=()=>selectMethod("UPaisa","03349953296","upaisa");
}

function selectMethod(method,number,id){
 selectedMethod=method;
 document.querySelectorAll(".method").forEach(b=>b.classList.remove("selected"));
 $(id).classList.add("selected");
 const box=$("payInfo");box.classList.add("show");
 box.innerHTML=`<div class="notice"><strong>${method}</strong><br>Account Name: <strong>Bilal Munir</strong><div class="number">${number}</div></div>
 <form class="form" id="paymentForm">
 <input id="transaction" placeholder="Transaction ID / Reference Number" required>
 <input id="paymentPhone" value="${user().phone||""}" placeholder="Your phone number" required>
 <button class="btn">Submit Payment for Review</button>
 </form>`;
 $("paymentForm").onsubmit=async e=>{
  e.preventDefault();
  try{
   const u=user(),paymentRef=push(ref(db,"payments"));
   await set(paymentRef,{
    name:u.name,email:u.email,phone:$("paymentPhone").value.trim(),
    job:selectedJob,method:selectedMethod,number:number,amount:500,
    transaction:$("transaction").value.trim(),status:"pending",
    submittedAt:new Date().toISOString()
   });
   modalBody.innerHTML=`<h2>✓ Payment Submitted</h2><div class="notice">Your payment reference has been saved to Firebase and sent for manual review. After confirmation, you can apply for the job.</div>`;
  }catch(err){console.error(err);alert("Payment save failed: "+err.message);}
 };
}

function showApplication(){
 const u=user();openModal();
 modalBody.innerHTML=`<p class="eyebrow">APPLICATION UNLOCKED</p><h2>Apply for ${selectedJob}</h2>
 <div class="notice"><strong class="green">✓ Payment Confirmed</strong><br>You can now submit your job application.</div>
 <form class="form" id="applicationForm">
 <input id="appName" value="${u.name}" required>
 <input id="appPhone" value="${u.phone}" required>
 <input id="qualification" placeholder="Qualification / Education" required>
 <textarea id="experience" rows="4" placeholder="Work experience"></textarea>
 <button class="btn">Submit Application</button></form>`;
 $("applicationForm").onsubmit=async e=>{
  e.preventDefault();
  try{
   const appRef=push(ref(db,"applications"));
   await set(appRef,{
    name:$("appName").value.trim(),email:u.email,phone:$("appPhone").value.trim(),
    job:selectedJob,qualification:$("qualification").value.trim(),
    experience:$("experience").value.trim(),submittedAt:new Date().toISOString()
   });
   modalBody.innerHTML=`<h2>🎉 Application Submitted Successfully!</h2><div class="notice"><strong>We will contact you within one week.</strong><br>Your application has been received successfully.</div>`;
  }catch(err){alert("Application save failed: "+err.message);}
 };
}

async function showAdmin(){
 openModal();
 modalBody.innerHTML=`<p class="eyebrow">ADMIN PANEL</p><h2>Payment Review</h2><div class="notice">Loading Firebase payments...</div>`;
 try{
  const payments=await getPayments();
  modalBody.innerHTML=`<p class="eyebrow">ADMIN PANEL</p><h2>Payment Review</h2>
  <div class="notice warning">Check the payment manually in your JazzCash, Easypaisa or UPaisa wallet before confirming.</div>
  ${payments.length?payments.map(p=>`<div class="review">
  <div><strong>${p.name}</strong><br><small>Job: ${p.job}</small><br><small>${p.method} | Rs. ${p.amount}</small><br><small>Transaction: ${p.transaction}</small><br><small>Phone: ${p.phone}</small><br><small>Status: ${p.status}</small></div>
  <div>${p.status==="pending"?`<button class="btn confirm" data-id="${p.id}">Confirm Payment</button>`:`<span class="green">✓ Confirmed</span>`}</div>
  </div>`).join(""):`<div class="notice">No payment submissions yet.</div>`}`;
  document.querySelectorAll(".confirm").forEach(b=>b.onclick=async()=>{
   try{await update(ref(db,"payments/"+b.dataset.id),{status:"confirmed",confirmedAt:new Date().toISOString()});showAdmin();}
   catch(err){alert(err.message);}
  });
 }catch(err){modalBody.innerHTML=`<h2>Firebase Error</h2><div class="notice warning">${err.message}</div>`;}
}

$("adminButton").onclick=showAdmin;
$("closeModal").onclick=closeModal;
$("overlay").onclick=closeModal;
renderAccount();
renderJobs();
