const ADMIN_PASSWORD = "bilal302200";

const jobs=[
{title:'Civil Engineer',category:'Engineering',location:'Lahore',salary:'Rs. 120,000 / month',image:'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',desc:'Work on construction planning, site development and engineering projects.'},
{title:'Registered Nurse',category:'Healthcare',location:'Karachi',salary:'Rs. 95,000 / month',image:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',desc:'Provide professional patient care in a modern healthcare environment.'},
{title:'Software Developer',category:'Technology',location:'Remote',salary:'Rs. 150,000 / month',image:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80',desc:'Build web applications and work with modern software technologies.'},
{title:'Financial Analyst',category:'Finance',location:'Islamabad',salary:'Rs. 130,000 / month',image:'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',desc:'Analyze financial information and support business decisions.'},
{title:'Graphic Designer',category:'Design',location:'Remote',salary:'Rs. 85,000 / month',image:'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80',desc:'Create engaging visual designs for digital and print projects.'},
{title:'Mechanical Engineer',category:'Engineering',location:'Faisalabad',salary:'Rs. 115,000 / month',image:'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80',desc:'Support industrial engineering and mechanical project operations.'}];

let selectedJob=null, selectedMethod=null;
const $=id=>document.getElementById(id);
function getUser(){try{return JSON.parse(localStorage.getItem('jobshubUser'))}catch{return null}}
function setUser(u){localStorage.setItem('jobshubUser',JSON.stringify(u))}
function openModal(){modal.classList.remove('hidden')}function hideModal(){modal.classList.add('hidden')}
function renderHeader(){const u=getUser(),a=$('headerActions');if(u){a.innerHTML=`<div class="user-menu"><div class="avatar-circle">${u.name.charAt(0).toUpperCase()}</div><span>Hi, ${u.name}</span><button class="logout-btn" id="logoutBtn">Logout</button></div>`;$('logoutBtn').onclick=()=>{localStorage.removeItem('jobshubUser');renderHeader()}}else{a.innerHTML=`<button class="link-btn" id="loginBtn">Sign In</button><button class="primary small" id="createAccountBtn">Create Account</button>`;$('loginBtn').onclick=showLogin;$('createAccountBtn').onclick=showSignup}}
function renderJobs(list=jobs){jobGrid.innerHTML=list.map(j=>`<article class="job-card"><img src="${j.image}" alt="${j.title}"><div class="job-info"><div class="job-tags"><span>${j.category}</span><span>${j.location}</span></div><h3>${j.title}</h3><p>${j.desc}</p><div class="job-bottom"><span class="salary">${j.salary}</span><button class="apply-btn" data-job="${j.title}">Apply Now</button></div></div></article>`).join('');document.querySelectorAll('.apply-btn').forEach(b=>b.onclick=()=>startApply(b.dataset.job))}
function showLogin(){openModal();modalContent.innerHTML=`<span class="eyebrow">WELCOME BACK</span><h2>Sign in to JobsHub</h2><form class="auth-form" id="loginForm"><input id="loginEmail" type="email" placeholder="Email address" required><input id="loginPassword" type="password" placeholder="Password" required><button class="primary">Sign In</button></form><div class="switch-auth">New here? <button id="goSignup">Create Account</button></div><div id="authNotice"></div>`;$('goSignup').onclick=showSignup;$('loginForm').onsubmit=e=>{e.preventDefault();const s=getUser();if(!s||s.email!==loginEmail.value.trim().toLowerCase()||s.password!==loginPassword.value){authNotice.innerHTML='<div class="notice">Account not found or password is incorrect.</div>';return}hideModal();renderHeader();if(selectedJob)showPayment(selectedJob)}}
function showSignup(){openModal();modalContent.innerHTML=`<span class="eyebrow">START YOUR JOURNEY</span><h2>Create your account</h2><form class="auth-form" id="signupForm"><input id="signupName" placeholder="Full name" required><input id="signupEmail" type="email" placeholder="Email address" required><input id="signupPassword" type="password" placeholder="Create password" minlength="4" required><button class="primary">Create Account</button></form><div class="switch-auth">Already have an account? <button id="goLogin">Sign In</button></div>`;$('goLogin').onclick=showLogin;$('signupForm').onsubmit=e=>{e.preventDefault();setUser({name:signupName.value.trim(),email:signupEmail.value.trim().toLowerCase(),password:signupPassword.value});hideModal();renderHeader();if(selectedJob)showPayment(selectedJob)}}
function startApply(title){selectedJob=title;if(!getUser()){showLogin();return}showPayment(title)}
function showPayment(title){selectedMethod=null;openModal();modalContent.innerHTML=`<span class="eyebrow">APPLICATION PAYMENT</span><h2>Apply for ${title}</h2><div class="fee-box"><div>Required application / registration fee</div><div class="fee-amount">Rs. 500</div><small>Select a payment method below and enter the transaction ID after you have paid.</small></div><div class="payment-options"><button class="payment-option" id="jazzBtn"><strong>🟢 JazzCash</strong><br><small>Account Name: Bilal Munir</small></button><button class="payment-option" id="easyBtn"><strong>🟢 Easypaisa</strong><br><small>Account Name: Bilal Munir</small></button><button class="payment-option" id="upaisaBtn"><strong>🟢 UPaisa</strong><br><small>Account Name: Bilal Munir</small></button><button class="payment-option disabled" disabled><strong>⚪ Bank Account</strong><br><small>Coming soon</small></button></div><div class="payment-detail" id="payDetail"></div><div class="warning">Payment submission in this static website is not automatic verification. The transaction ID is recorded for review before treating the application as paid.</div>`;$('jazzBtn').onclick=()=>selectPayment('JazzCash','03250555598');$('easyBtn').onclick=()=>selectPayment('Easypaisa','03198682932');$('upaisaBtn').onclick=()=>selectPayment('UPaisa','03349953296')}
function selectPayment(method,number){selectedMethod=method;document.querySelectorAll('.payment-option').forEach(x=>x.classList.remove('selected'));const btnId=method==='JazzCash'?'jazzBtn':method==='Easypaisa'?'easyBtn':'upaisaBtn';$(btnId).classList.add('selected');payDetail.classList.add('active');payDetail.innerHTML=`<strong>Pay Rs. 500 via ${method}</strong><p><strong>Account Name: Bilal Munir</strong></p><p>Send the payment to this account number:</p><div class="account-number">${number}</div><form class="auth-form" id="paymentForm"><input id="transactionId" placeholder="Enter Transaction ID / Reference Number" required><button class="primary">I Have Paid — Continue to Application</button></form>`;$('paymentForm').onsubmit=e=>{e.preventDefault();showApplication()}}
function showApplication(){openModal();modalContent.innerHTML=`<span class="eyebrow">APPLICATION FORM</span><h2>${selectedJob}</h2><div class="notice">Payment reference submitted via ${selectedMethod}. Please complete your application details.</div><form class="auth-form" id="applicationForm"><input id="appName" placeholder="Full name" value="${getUser().name}" required><input id="appPhone" placeholder="Phone number" required><input id="appQualification" placeholder="Qualification / Education" required><textarea id="appExperience" rows="4" placeholder="Work experience"></textarea><button class="primary">Submit Application</button></form>`;$('applicationForm').onsubmit=e=>{e.preventDefault();localStorage.setItem('jobshubApplication',JSON.stringify({job:selectedJob,method:selectedMethod,transaction:transactionId?.value||'submitted',date:new Date().toISOString()}));modalContent.innerHTML=`<div class="application-success"><h2>✓ Application Submitted</h2><p>Your application for <strong>${selectedJob}</strong> has been submitted.</p><p>Your payment reference was submitted for review. Payment must be verified separately.</p><button class="primary" id="doneBtn">Done</button></div>`;$('doneBtn').onclick=hideModal}}
closeModal.onclick=hideModal;modalBackdrop.onclick=hideModal;
document.querySelectorAll('.filter').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderJobs(btn.dataset.filter==='All'?jobs:jobs.filter(j=>j.category===btn.dataset.filter))});
searchBtn.onclick=()=>{const q=(searchInput.value+' '+locationInput.value).toLowerCase();renderJobs(jobs.filter(j=>(j.title+' '+j.category+' '+j.location+' '+j.desc).toLowerCase().includes(q)));document.querySelector('#jobs').scrollIntoView({behavior:'smooth'})};
renderHeader();renderJobs();

function openAdminLogin(){
  const modal = document.getElementById("modal");
  const content = document.getElementById("modalContent");
  if(!modal || !content) return;
  modal.classList.remove("hidden");
  content.innerHTML = `
    <div class="admin-login-box">
      <div class="eyebrow">PRIVATE ACCESS</div>
      <h2>Admin Login</h2>
      <p>Enter your administrator password to review payments.</p>
      <form class="form" id="privateAdminForm">
        <input id="privateAdminPassword" type="password" placeholder="Admin password" required>
        <button class="primary" type="submit">Open Admin Panel</button>
      </form>
      <p id="adminLoginError" style="color:#c0392b;margin-top:10px"></p>
    </div>`;
  document.getElementById("privateAdminForm").addEventListener("submit", e=>{
    e.preventDefault();
    if(document.getElementById("privateAdminPassword").value === ADMIN_PASSWORD){
      sessionStorage.setItem("jobshubAdmin","true");
      openAdminPanel();
    } else {
      document.getElementById("adminLoginError").textContent = "Incorrect admin password.";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const adminBtn = document.getElementById("openAdminBtn");
  if(adminBtn){
    adminBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      if(sessionStorage.getItem("jobshubAdmin") === "true"){
        if(typeof openAdminPanel === "function") openAdminPanel();
      } else {
        openAdminLogin();
      }
    }, true);
  }
});
