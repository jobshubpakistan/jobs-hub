const jobs=[
{title:'Civil Engineer',category:'Engineering',location:'Lahore',salary:'Rs. 120,000 / month',image:'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80',desc:'Work on construction planning, site development and engineering projects.'},
{title:'Registered Nurse',category:'Healthcare',location:'Karachi',salary:'Rs. 95,000 / month',image:'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80',desc:'Provide professional patient care in a modern healthcare environment.'},
{title:'Software Developer',category:'Technology',location:'Remote',salary:'Rs. 150,000 / month',image:'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=900&q=80',desc:'Build web applications and work with modern software technologies.'},
{title:'Financial Analyst',category:'Finance',location:'Islamabad',salary:'Rs. 130,000 / month',image:'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',desc:'Analyze financial information and support business decisions.'},
{title:'Graphic Designer',category:'Design',location:'Remote',salary:'Rs. 85,000 / month',image:'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=900&q=80',desc:'Create engaging visual designs for digital and print projects.'},
{title:'Mechanical Engineer',category:'Engineering',location:'Faisalabad',salary:'Rs. 115,000 / month',image:'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80',desc:'Support industrial engineering and mechanical project operations.'}
];

const jobGrid=document.getElementById('jobGrid');
const modal=document.getElementById('modal');
const modalContent=document.getElementById('modalContent');
const closeModal=document.getElementById('closeModal');
const backdrop=document.getElementById('modalBackdrop');

function getUser(){try{return JSON.parse(localStorage.getItem('jobshubUser'))}catch{return null}}
function setUser(user){localStorage.setItem('jobshubUser',JSON.stringify(user))}
function renderHeader(){
 const user=getUser(), actions=document.getElementById('headerActions');
 if(user){actions.innerHTML=`<div class="user-menu"><div class="avatar-circle">${user.name.charAt(0).toUpperCase()}</div><span>Hi, ${user.name}</span><button class="logout-btn" id="logoutBtn">Logout</button></div>`;
 document.getElementById('logoutBtn').onclick=()=>{localStorage.removeItem('jobshubUser');renderHeader()};
 }else{actions.innerHTML=`<button class="link-btn" id="loginBtn">Sign In</button><button class="primary small" id="createAccountBtn">Create Account</button>`;
 document.getElementById('loginBtn').onclick=showLogin;
 document.getElementById('createAccountBtn').onclick=showSignup;
 }
}
function renderJobs(list=jobs){
 jobGrid.innerHTML=list.map(j=>`<article class="job-card"><img src="${j.image}" alt="${j.title}"><div class="job-info"><div class="job-tags"><span>${j.category}</span><span>${j.location}</span></div><h3>${j.title}</h3><p>${j.desc}</p><div class="job-bottom"><span class="salary">${j.salary}</span><button class="apply-btn" data-job="${j.title}">Apply Now</button></div></div></article>`).join('');
 document.querySelectorAll('.apply-btn').forEach(b=>b.onclick=()=>applyForJob(b.dataset.job));
}
function openModal(){modal.classList.remove('hidden')}
function hideModal(){modal.classList.add('hidden')}
closeModal.onclick=hideModal; backdrop.onclick=hideModal;

function showLogin(){
 openModal();
 modalContent.innerHTML=`<span class="eyebrow">WELCOME BACK</span><h2>Sign in to JobsHub</h2><form class="auth-form" id="loginForm"><input id="loginEmail" type="email" placeholder="Email address" required><input id="loginPassword" type="password" placeholder="Password" required><button class="primary">Sign In</button></form><div class="switch-auth">New here? <button id="goSignup">Create Account</button></div><div id="authNotice"></div>`;
 document.getElementById('goSignup').onclick=showSignup;
 document.getElementById('loginForm').onsubmit=e=>{e.preventDefault();const saved=getUser();const email=loginEmail.value.trim().toLowerCase();const pass=loginPassword.value;if(!saved||saved.email!==email||saved.password!==pass){authNotice.innerHTML='<div class="notice">Account not found or password is incorrect. Please create an account first.</div>';return}hideModal();renderHeader();};
}
function showSignup(){
 openModal();
 modalContent.innerHTML=`<span class="eyebrow">START YOUR JOURNEY</span><h2>Create your account</h2><form class="auth-form" id="signupForm"><input id="signupName" placeholder="Full name" required><input id="signupEmail" type="email" placeholder="Email address" required><input id="signupPassword" type="password" placeholder="Create password" minlength="4" required><button class="primary">Create Account</button></form><div class="switch-auth">Already have an account? <button id="goLogin">Sign In</button></div><div id="authNotice"></div>`;
 document.getElementById('goLogin').onclick=showLogin;
 document.getElementById('signupForm').onsubmit=e=>{e.preventDefault();setUser({name:signupName.value.trim(),email:signupEmail.value.trim().toLowerCase(),password:signupPassword.value});hideModal();renderHeader();alert('Account created successfully! You can now browse JobsHub.');};
}
function applyForJob(title){
 const user=getUser();
 if(!user){showLogin();return}
 openModal();
 modalContent.innerHTML=`<span class="eyebrow">ACCOUNT VERIFIED</span><h2>${title}</h2><p>You are signed in as <strong>${user.name}</strong>. Your account is ready. The next application step will be added after the login system.</p><div class="notice">Login system completed successfully.</div>`;
}
document.querySelectorAll('.filter').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderJobs(btn.dataset.filter==='All'?jobs:jobs.filter(j=>j.category===btn.dataset.filter));});
document.getElementById('searchBtn').onclick=()=>{const q=(searchInput.value+' '+locationInput.value).toLowerCase();renderJobs(jobs.filter(j=>(j.title+' '+j.category+' '+j.location+' '+j.desc).toLowerCase().includes(q)));document.getElementById('jobs').scrollIntoView({behavior:'smooth'});};
document.getElementById('viewAllBtn').onclick=()=>{renderJobs(jobs);document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b.dataset.filter==='All'));};
document.getElementById('ctaBtn').onclick=()=>getUser()?document.getElementById('jobs').scrollIntoView({behavior:'smooth'}):showSignup();
renderHeader();renderJobs();