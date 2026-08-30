const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const jobCards = [...document.querySelectorAll(".job-card")];
const jobCount = document.getElementById("jobCount");

function filterJobs(term = "", category = "") {
  term = term.toLowerCase().trim();
  let visible = 0;
  jobCards.forEach(card => {
    const text = card.innerText.toLowerCase();
    const matchesTerm = !term || text.includes(term);
    const matchesCategory = !category || card.dataset.category === category;
    const show = matchesTerm && matchesCategory;
    card.classList.toggle("hidden", !show);
    if (show) visible++;
  });
  jobCount.textContent = `${visible} job${visible === 1 ? "" : "s"} available`;
}

searchBtn.addEventListener("click", () => filterJobs(searchInput.value));
searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") filterJobs(searchInput.value);
});

document.querySelectorAll(".category-card").forEach(button => {
  button.addEventListener("click", () => {
    searchInput.value = "";
    filterJobs("", button.dataset.category);
    document.getElementById("jobs").scrollIntoView({behavior:"smooth"});
  });
});

const modal = document.getElementById("applyModal");
const modalJob = document.getElementById("modalJob");
const closeModal = document.getElementById("closeModal");
const form = document.getElementById("applicationForm");
const formMessage = document.getElementById("formMessage");

document.querySelectorAll(".apply-btn").forEach(button => {
  button.addEventListener("click", () => {
    modalJob.textContent = `Apply for ${button.dataset.job}`;
    formMessage.textContent = "";
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  });
});

function closeApplicationModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
}

closeModal.addEventListener("click", closeApplicationModal);
modal.addEventListener("click", e => {
  if (e.target === modal) closeApplicationModal();
});

form.addEventListener("submit", e => {
  e.preventDefault();
  formMessage.textContent = "Application submitted successfully!";
  form.reset();
});
