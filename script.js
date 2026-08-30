const jobs=[
 {title:'Office Assistant',location:'Multiple Locations',type:'Full Time'},
 {title:'Customer Support Representative',location:'Multiple Locations',type:'Full Time'},
 {title:'Sales Executive',location:'Multiple Locations',type:'Full Time'}
];
const grid=document.getElementById('jobGrid');
grid.innerHTML=jobs.map((j,i)=>`<div class="job"><h3>${j.title}</h3><div class="meta">📍 ${j.location}<br>💼 ${j.type}</div><button class="btn" onclick="openApply(${i})">Apply Now</button></div>`).join('');
function openModal(){document.getElementById('modal').style.display='flex'}
function closeModal(){document.getElementById('modal').style.display='none'}
function openApply(i){document.getElementById('jobTitle').textContent='Apply: '+jobs[i].title;document.getElementById('applyModal').style.display='flex'}
function closeApply(){document.getElementById('applyModal').style.display='none'}
function register(e){e.preventDefault();document.getElementById('formMsg').textContent='Demo account created. Connect this form to a secure database before launch.'}
function apply(e){e.preventDefault();document.getElementById('applyMsg').textContent='Demo application saved. Connect a legitimate payment gateway and secure application database before accepting real users.'}