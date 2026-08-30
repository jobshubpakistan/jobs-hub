
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
function getPayments(){try{return JSON.parse(localStorage.getItem('jobshubPayments'))||[]}catch{return []}}
function setPayments(x){localStorage.setItem('jobshubPayments',JSON.stringify(x))}
function getApps(){try{return JSON.parse(localStorage.getItem('jobshubApplications'))||[]}catch{return []}}
function setApps(x){localStorage.setItem('jobshubApplications',JSON.stringify(x))}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function openModal(){modal.classList.remove('hidden')}
function hideModal(){modal.classList.add('hidden')}

function renderHeader(){
 const u=getUser(),a=$('headerActions');
 if(u){
   a.innerHTML=`<div class="user-menu"><div class="avatar-circle">${u.name.charAt(0).toUpperCase()}</div><span>Hi, ${u.name}</span><button class="logout-btn" id="logoutBtn">Logout</button></div>`;
   $('logoutBtn').onclick=()=>{localStorage.removeItem('jobshubUser');renderHeader()};
 }else{
   a.innerHTML=`<button class="link-btn" id="loginBtn">Sign In</button><button class="primary small" id="createAccountBtn">Create Account</button>`;
   $('loginBtn').onclick=showLogin;$('createAccountBtn').onclick=showSignup;
 }
}

function renderJobs(list=jobs){
 jobGrid.innerHTML=list.map(j=>`<article class="job-card"><img src="${j.image}" alt="${j.title}"><div class="job-info"><div class="job-tags"><span>${j.category}</span><span>${j.location}</span></div><h3>${j.title}</h3><p>${j.desc}</p><div class="job-bottom"><span class="salary">${j.salary}</span><button class="apply-btn" data-job="${j.title}">Apply Now</button></div></div></article>`).join('');
 document.querySelectorAll('.apply-btn').forEach(b=>b.onclick=()=>startApply(b.dataset.job));
}

function showLogin(){
 openModal();
 modalContent.innerHTML=`<span class="eyebrow">WELCOME BACK</span><h2>Sign in to JobsHub</h2><form class="auth-form" id="loginForm"><input id="loginEmail" type="email" placeholder="Email address" required><input id="loginPassword" type="password" placeholder="Password" required><button class="primary">Sign In</button></form><div class="switch-auth">New here? <button id="goSignup">Create Account</button></div><div id="authNotice"></div>`;
 $('goSignup').onclick=showSignup;
 $('loginForm').onsubmit=e=>{
   e.preventDefault();const s=getUser();
   if(!s||s.email!==loginEmail.value.trim().toLowerCase()||s.password!==loginPassword.value){authNotice.innerHTML='<div class="notice">Account not found or password is incorrect.</div>';return}
   hideModal();renderHeader();if(selectedJob)continueFlow(selectedJob);
 };
}

function showSignup(){
 openModal();
 modalContent.innerHTML=`<span class="eyebrow">START YOUR JOURNEY</span><h2>Create your account</h2><form class="auth-form" id="signupForm"><input id="signupName" placeholder="Full name" required><input id="signupPhone" type="tel" placeholder="Phone number (for application contact)" required><input id="signupEmail" type="email" placeholder="Email address" required><input id="signupPassword" type="password" placeholder="Create password" minlength="4" required><button class="primary">Create Account</button></form><div class="switch-auth">Already have an account? <button id="goLogin">Sign In</button></div>`;
 $('goLogin').onclick=showLogin;
 $('signupForm').onsubmit=e=>{
   e.preventDefault();
   setUser({name:signupName.value.trim(),phone:signupPhone.value.trim(),email:signupEmail.value.trim().toLowerCase(),password:signupPassword.value});
   hideModal();renderHeader();if(selectedJob)continueFlow(selectedJob);
 };
}

function startApply(title){
 selectedJob=title;
 if(!getUser()){showLogin();return}
 continueFlow(title);
}

function continueFlow(title){
 const u=getUser();
 const apps=getApps();
 if(apps.some(a=>a.email===u.email && a.job===title)){
   openModal();modalContent.innerHTML=`<div class="application-success"><h2>✓ Already Applied</h2><p>You have already submitted your application for <strong>${title}</strong>.</p><button class="primary" id="doneBtn">Done</button></div>`;$('doneBtn').onclick=hideModal;return;
 }
 const p=getPayments().find(x=>x.email===u.email && x.job===title);
 if(!p){showPayment(title);return}
 if(p.status==='pending'){
   openModal();modalContent.innerHTML=`<span class="eyebrow">PAYMENT UNDER REVIEW</span><h2>Payment submitted</h2><div class="notice">Your Rs. 500 payment reference has been submitted for manual review. Please wait for the admin to confirm payment. After confirmation, a website notification will unlock your application.</div><div class="payment-summary"><strong>Job:</strong> ${title}<br><strong>Method:</strong> ${p.method}<br><strong>Transaction ID:</strong> ${p.transaction}<br><strong>Phone:</strong> ${p.phone}</div><button class="primary" id="doneBtn">Done</button></div>`;$('doneBtn').onclick=hideModal;return;
 }
 if(p.status==='confirmed'){showApplication();return}
}

function showPayment(title){
 selectedMethod=null;openModal();
 modalContent.innerHTML=`<span class="eyebrow">APPLICATION PAYMENT</span><h2>Apply for ${title}</h2><div class="fee-box"><div>Required application / registration fee</div><div class="fee-amount">Rs. 500</div><small>Pay manually, then submit your transaction ID. The admin will check payment and confirm it.</small></div><div class="payment-options"><button class="payment-option" id="jazzBtn"><strong>🟢 JazzCash</strong><br><small>Bilal Munir</small></button><button class="payment-option" id="easyBtn"><strong>🟢 Easypaisa</strong><br><small>Bilal Munir</small></button><button class="payment-option" id="upaisaBtn"><strong>🟢 UPaisa</strong><br><small>Bilal Munir</small></button><button class="payment-option disabled" disabled><strong>⚪ Bank Account</strong><br><small>Coming soon</small></button></div><div class="payment-detail" id="payDetail"></div>`;
 $('jazzBtn').onclick=()=>selectPayment('JazzCash','03250555598');
 $('easyBtn').onclick=()=>selectPayment('Easypaisa','03198682932');
 $('upaisaBtn').onclick=()=>selectPayment('UPaisa','03349953296');
}

function selectPayment(method,number){
 selectedMethod=method;
 document.querySelectorAll('.payment-option').forEach(x=>x.classList.remove('selected'));
 const btnId=method==='JazzCash'?'jazzBtn':method==='Easypaisa'?'easyBtn':'upaisaBtn';
 $(btnId).classList.add('selected');payDetail.classList.add('active');
 payDetail.innerHTML=`<strong>Pay Rs. 500 via ${method}</strong><p><strong>Account Name: Bilal Munir</strong></p><p>Send payment to:</p><div class="account-number">${number}</div><form class="auth-form" id="paymentForm"><input id="transactionId" placeholder="Enter Transaction ID / Reference Number" required><input id="paymentPhone" type="tel" value="${getUser().phone||''}" placeholder="Phone number" required><button class="primary">Submit Payment for Review</button></form>`;
 $('paymentForm').onsubmit=e=>{
   e.preventDefault();
   const u=getUser(),payments=getPayments();
   payments.push({id:uid(),name:u.name,email:u.email,phone:paymentPhone.value.trim(),job:selectedJob,method:selectedMethod,number,amount:500,transaction:transactionId.value.trim(),status:'pending',submittedAt:new Date().toISOString()});
   setPayments(payments);
   openModal();
   modalContent.innerHTML=`<div class="application-success"><h2>✓ Payment Submitted</h2><p>Your payment reference has been sent for manual review.</p><p><strong>Next step:</strong> After payment is confirmed, your job application will be unlocked.</p><button class="primary" id="doneBtn">Done</button></div>`;
   $('doneBtn').onclick=hideModal;
 };
}

function showApplication(){
 const u=getUser();openModal();
 modalContent.innerHTML=`<span class="eyebrow">APPLICATION FORM</span><h2>${selectedJob}</h2><div class="notice success-notice">✓ Payment Confirmed — You can now submit your application.</div><form class="auth-form" id="applicationForm"><input id="appName" value="${u.name}" placeholder="Full name" required><input id="appPhone" value="${u.phone||''}" type="tel" placeholder="Phone number" required><input id="appQualification" placeholder="Qualification / Education" required><textarea id="appExperience" rows="4" placeholder="Work experience"></textarea><button class="primary">Submit Application</button></form>`;
 $('applicationForm').onsubmit=e=>{
   e.preventDefault();
   const u=getUser(),apps=getApps();
   apps.push({id:uid(),name:appName.value.trim(),email:u.email,phone:appPhone.value.trim(),job:selectedJob,qualification:appQualification.value.trim(),experience:appExperience.value.trim(),submittedAt:new Date().toISOString()});
   setApps(apps);
   modalContent.innerHTML=`<div class="application-success"><h2>🎉 Application Submitted Successfully!</h2><p>Your application for <strong>${selectedJob}</strong> has been received.</p><p><strong>We will contact you within one week.</strong></p><p class="small-note">Your phone number is recorded so the admin can contact you manually by SMS.</p><button class="primary" id="doneBtn">Done</button></div>`;
   $('doneBtn').onclick=hideModal;
 };
}

function showAdmin(){
 openModal();
 const payments=getPayments();
 const pending=payments.filter(p=>p.status==='pending');
 const confirmed=payments.filter(p=>p.status==='confirmed');
 modalContent.innerHTML=`<span class="eyebrow">ADMIN PANEL</span><h2>Payment Review</h2><div class="admin-warning">Demo version: review the payment in your wallet manually, then click Confirm Payment.</div><div class="admin-stats"><span>Pending: <strong>${pending.length}</strong></span><span>Confirmed: <strong>${confirmed.length}</strong></span></div><div class="review-list">${payments.length?payments.map(p=>`<div class="review-card"><div><strong>${p.name}</strong><br><small>${p.job} · Rs. ${p.amount}</small><br><small>${p.method} · ${p.transaction}</small><br><small>Phone: ${p.phone}</small></div><div>${p.status==='pending'?`<button class="primary small confirm-btn" data-id="${p.id}">Confirm Payment</button>`:`<span class="confirmed-badge">✓ Confirmed</span>`}</div></div>`).join(''):'<div class="notice">No payment submissions yet.</div>'}</div>`;
 document.querySelectorAll('.confirm-btn').forEach(b=>b.onclick=()=>{
   const all=getPayments(),i=all.findIndex(x=>x.id===b.dataset.id);
   if(i>-1){all[i].status='confirmed';all[i].confirmedAt=new Date().toISOString();setPayments(all);showAdmin();}
 });
}

closeModal.onclick=hideModal;
modalBackdrop.onclick=hideModal;
document.querySelectorAll('.filter').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderJobs(btn.dataset.filter==='All'?jobs:jobs.filter(j=>j.category===btn.dataset.filter))});
searchBtn.onclick=()=>{const q=(searchInput.value+' '+locationInput.value).toLowerCase();renderJobs(jobs.filter(j=>(j.title+' '+j.category+' '+j.location+' '+j.desc).toLowerCase().includes(q)));document.querySelector('#jobs').scrollIntoView({behavior:'smooth'})};
$('openAdminBtn').onclick=showAdmin;
renderHeader();renderJobs();
