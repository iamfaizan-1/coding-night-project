let posts = JSON.parse(localStorage.getItem("posts") || "[]");
let currentEditId = null;

function savePosts(){ localStorage.setItem("posts", JSON.stringify(posts)); }

function renderPosts(){
  const container = document.getElementById("postsContainer");
  let filter = document.getElementById("searchInput").value.toLowerCase();
  let sort = document.getElementById("sortSelect").value;

  let data = [...posts];

  if(sort === "oldest") data.reverse();
  if(sort === "liked") data.sort((a,b)=>b.likes-a.likes);

  container.innerHTML = "";
  data.filter(p=>p.text.toLowerCase().includes(filter)).forEach(p=>{
    container.innerHTML += `
      <div class="card p-3 mb-3 shadow-sm">
        <div class="d-flex justify-content-between">
          <b>${p.text}</b>
          <small>${p.time}</small>
        </div>
        ${p.img ? `<img src="${p.img}" class='post-img'>` : ''}
        <div class="d-flex mt-2 gap-3">
          <span class="pointer text-danger" onclick="toggleLike(${p.id})">❤️ ${p.likes}</span>
          <span class="pointer text-primary" onclick="openEdit(${p.id})">✏️ Edit</span>
          <span class="pointer text-danger" onclick="deletePost(${p.id})">🗑 Delete</span>
        </div>
      </div>`;
  });
}

function toggleLike(id){
  let p = posts.find(x=>x.id===id);
  p.likes = p.likes ? 0:1;
  savePosts(); renderPosts();
}

function deletePost(id){
  if(confirm("Delete this post?")){
    posts = posts.filter(p=>p.id!==id);
    savePosts(); renderPosts();
  }
}

function openEdit(id){
  currentEditId = id;
  document.getElementById("editText").value = posts.find(p=>p.id===id).text;
  new bootstrap.Modal(document.getElementById("editModal")).show();
}

document.getElementById("saveEdit").onclick = ()=>{
  let p = posts.find(p=>p.id===currentEditId);
  p.text = document.getElementById("editText").value;
  savePosts(); renderPosts();
};

// CREATE POST
postBtn.onclick = ()=>{
  let text = postText.value.trim();
  if(!text) return;

  posts.unshift({
    id: Date.now(),
    text,
    img: postImg.value,
    likes:0,
    time: new Date().toLocaleString()
  });

  savePosts(); renderPosts();
  postText.value=""; postImg.value="";
};

// SEARCH + SORT
searchInput.oninput = renderPosts;
sortSelect.onchange = renderPosts;

// THEME
themeToggle.onclick = ()=>{
  document.body.classList.toggle("dark");
};

// LOGOUT
logoutBtn.onclick = () => {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("user");
    mainPage.classList.add("d-none");
    authPage.classList.remove("d-none");
  }
};

// AUTH
showSignup.onclick = ()=> signupCard.classList.toggle("d-none");

signupBtn.onclick = ()=>{
  localStorage.setItem("user", JSON.stringify({
    name: signName.value,
    email: signEmail.value,
    pass: signPass.value
  }));
  alert("Account Created!");
};

loginBtn.onclick = ()=>{
  let u = JSON.parse(localStorage.getItem("user"));
  if(u && u.email===loginEmail.value && u.pass===loginPass.value){
    authPage.classList.add("d-none");
    mainPage.classList.remove("d-none");
    usernameText.innerText = u.name;
    renderPosts();
  }else{
    alert("Invalid Login");
  }
};