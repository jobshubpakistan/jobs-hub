const jobs=[
 {id:1,title:"Civil Engineer",company:"BuildPro Engineering",category:"Engineering",icon:"⚙️",location:"Lahore",type:"Full-time",salary:"₨ 95,000 – ₨ 150,000 / month",qualification:"BS Civil Engineering",experience:"2–5 years",posted:"Posted today",description:"Plan, supervise and support commercial and infrastructure construction projects.",requirements:["BS in Civil Engineering","PEC registration preferred","Knowledge of AutoCAD and site supervision","Strong communication and reporting skills"]},
 {id:2,title:"Software Engineer",company:"TechNova Systems",category:"Technology",icon:"💻",location:"Remote",type:"Full-time",salary:"₨ 120,000 – ₨ 220,000 / month",qualification:"BS Computer Science",experience:"2–4 years",posted:"Posted today",description:"Build modern web applications with a collaborative engineering team.",requirements:["Degree or equivalent software experience","JavaScript and modern web frameworks","Understanding of APIs and databases","Good problem-solving skills"]},
 {id:3,title:"Registered Nurse",company:"CarePlus Hospital",category:"Healthcare",icon:"🩺",location:"Karachi",type:"Full-time",salary:"₨ 70,000 – ₨ 115,000 / month",qualification:"BS Nursing / Diploma",experience:"1–3 years",posted:"1 day ago",description:"Provide compassionate patient care and work closely with the clinical team.",requirements:["Recognized nursing qualification","Valid professional registration","Patient-care experience","Ability to work in shifts"]},
 {id:4,title:"Account Executive",company:"Prime Finance Group",category:"Finance",icon:"📊",location:"Islamabad",type:"Full-time",salary:"₨ 80,000 – ₨ 135,000 / month",qualification:"BBA / Accounting",experience:"2–4 years",posted:"1 day ago",description:"Manage financial records, reporting and daily accounting operations.",requirements:["Relevant finance qualification","Excel and reporting skills","Attention to detail","Professional communication"]},
 {id:5,title:"UI/UX Designer",company:"PixelCraft Studio",category:"Design",icon:"🎨",location:"Remote",type:"Full-time",salary:"₨ 90,000 – ₨ 170,000 / month",qualification:"Portfolio required",experience:"2–5 years",posted:"2 days ago",description:"Design intuitive digital products and polished user experiences.",requirements:["Strong UI/UX portfolio","Figma proficiency","Understanding of responsive design","User-centered design thinking"]},
 {id:6,title:"Mechanical Engineer",company:"Industrial Works Ltd.",category:"Engineering",icon:"🛠️",location:"Faisalabad",type:"Full-time",salary:"₨ 100,000 – ₨ 160,000 / month",qualification:"BS Mechanical Engineering",experience:"2–6 years",posted:"2 days ago",description:"Support design, maintenance and improvement of industrial equipment.",requirements:["BS Mechanical Engineering","Technical drawing knowledge","Problem-solving ability","Factory or industrial experience preferred"]}
];
let currentFilter="All";
const grid=document.getElementById("jobGrid");

function renderJobs(list=jobs){
 grid.innerHTML=list.map(j=>`<article class="job-card">
   <div class="job-top"><div class="company-logo">${j.icon}</div><span class="badge">Open now</span></div>
   <h3>${j.title}</h3><div class="company">${j.company}</div>
   <div class="job-meta"><span>📍 ${j.location}</span><span>🕒 ${j.type}</span></div>
   <div class="salary">${j.salary}</div>
   <div class="card-footer"><span class="posted">${j.posted}</span><button class="apply-btn" onclick="openJob(${j.id})">View & Apply →</button></div>
 </article>`).join("") || `<p>No jobs found. Try another search.</p>`;
}
renderJobs();

document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
 currentFilter=btn.dataset.filter;
 document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");
 renderJobs(currentFilter==="All"?jobs:jobs.filter(j=>j.category===currentFilter));
}));

document.getElementById("searchBtn").addEventListener("click",searchJobs);
document.getElementById("searchInput").addEventListener("keydown",e=>{if(e.key==="Enter")searchJobs()});
function searchJobs(){
 const q=document.getElementById("searchInput").value.toLowerCase().trim();
 const loc=document.getElementById("locationInput").value.toLowerCase().trim();
 const result=jobs.filter(j=>(!q||`${j.title} ${j.company} ${j.category}`.toLowerCase().includes(q))&&(!loc||j.location.toLowerCase().includes(loc)));
 document.querySelector("#jobs").scrollIntoView({behavior:"smooth"});
 renderJobs(result);
}

const modal=document.getElementById("modal"),content=document.getElementById("modalContent");
function showModal(html){content.innerHTML=html;modal.classList.remove("hidden")}
function hideModal(){modal.classList.add("hidden")}
document.getElementById("closeModal").onclick=hideModal;
document.getElementById("modalBackdrop").onclick=hideModal;

window.openJob=function(id){
 const j=jobs.find(x=>x.id===id);
 showModal(`<div class="company">${j.company}</div><h2>${j.title}</h2><p>${j.description}</p>
 <div class="detail-grid">
 <div class="detail"><span>Salary</span><strong>${j.salary}</strong></div>
 <div class="detail"><span>Location</span><strong>${j.location}</strong></div>
 <div class="detail"><span>Qualification</span><strong>${j.qualification}</strong></div>
 <div class="detail"><span>Experience</span><strong>${j.experience}</strong></div></div>
 <h3>Requirements</h3><ul class="requirements">${j.requirements.map(r=>`<li>${r}</li>`).join("")}</ul>
 <button class="primary" style="width:100%;margin-top:10px" onclick="openApplication(${j.id})">Apply for this job</button>`);
};

window.openApplication=function(id){
 const j=jobs.find(x=>x.id===id);
 showModal(`<div class="eyebrow">APPLICATION</div><h2>Apply for ${j.title}</h2><p>Create your applicant details to continue.</p>
 <form class="modal-form" id="applyForm">
 <input required placeholder="Full name" />
 <input required type="email" placeholder="Email address" />
 <input required placeholder="Mobile number" />
 <input required placeholder="Highest qualification" />
 <label class="notice">Application processing fee: <strong>₨ 500</strong><br>For a real paid website, this step must connect to a verified payment gateway and your own business account.</label>
 <button class="primary" type="submit">Continue to application</button></form>`);
 document.getElementById("applyForm").onsubmit=e=>{e.preventDefault();openPayment(j)};
};

function openPayment(j){
 showModal(`<div class="eyebrow">FINAL STEP</div><h2>Application fee</h2><p>You are applying for <strong>${j.title}</strong> at ${j.company}.</p>
 <div class="detail"><span>Amount</span><strong style="font-size:25px">₨ 500</strong></div>
 <div class="notice" style="margin:15px 0">Demo payment screen: no real money is collected by this static GitHub Pages website.</div>
 <button class="primary" style="width:100%" onclick="applicationSuccess('${j.title.replace(/'/g,"\\'")}')">Complete demo application</button>`);
}

window.applicationSuccess=function(title){
 showModal(`<div class="success"><div class="success-icon">✓</div><div class="eyebrow">APPLICATION RECEIVED</div><h2>You're all set!</h2><p>Your application for <strong>${title}</strong> has been submitted successfully.</p><div class="notice">Demo status: In a real system, an SMS/email update would require a backend plus an SMS provider.</div><button class="primary" style="margin-top:20px" onclick="hideModal()">Back to Jobs</button></div>`);
};
window.hideModal=hideModal;

function accountModal(){
 showModal(`<div class="eyebrow">WELCOME TO JOBSHUB</div><h2>Create your account</h2><p>Save your profile and apply for jobs more easily.</p><form class="modal-form" id="accountForm"><input required placeholder="Full name"><input required type="email" placeholder="Email address"><input required placeholder="Mobile number"><input required type="password" placeholder="Create password"><button class="primary" type="submit">Create Account</button><div class="account-note">Demo frontend only — account information is not stored on a server.</div></form>`);
 document.getElementById("accountForm").onsubmit=e=>{e.preventDefault();showModal(`<div class="success"><div class="success-icon">🎉</div><h2>Demo account created</h2><p>Your profile flow is ready. A real account system needs a secure backend and database.</p><button class="primary" onclick="hideModal()">Continue</button></div>`)};
}
document.getElementById("createAccountBtn").onclick=accountModal;
document.getElementById("loginBtn").onclick=accountModal;
document.getElementById("ctaBtn").onclick=accountModal;
document.getElementById("viewAllBtn").onclick=()=>{currentFilter="All";document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter==="All"));renderJobs();document.querySelector("#jobs").scrollIntoView({behavior:"smooth"})};
