const CONFIG={date:"2026-09-20T08:00:00+07:00"};
const $=s=>document.querySelector(s);

window.addEventListener("load",()=>{
  setTimeout(()=>$("#loader").classList.add("done"),800);
});

const params=new URLSearchParams(location.search);
const guest=params.get("to");
if(guest){const name=decodeURIComponent(guest).replace(/\+/g," ");$("#guestName").textContent=name;$("#guestInput").value=name}

$("#openInvitation").addEventListener("click",async()=>{
  $("#cover").scrollIntoView({behavior:"smooth"});
  document.body.classList.remove("locked");
  try{await $("#bgMusic").play();$("#navMusic").classList.add("playing")}catch(e){}
});

function countdown(){
  let d=Math.max(0,new Date(CONFIG.date)-Date.now());
  const vals=[Math.floor(d/86400000),Math.floor(d%86400000/3600000),Math.floor(d%3600000/60000),Math.floor(d%60000/1000)];
  ["days","hours","minutes","seconds"].forEach((id,i)=>$("#"+id).textContent=String(vals[i]).padStart(2,"0"));
}
countdown();setInterval(countdown,1000);

const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(e=>observer.observe(e));

const music=$("#bgMusic"), navMusic=$("#navMusic");
navMusic.addEventListener("click",async e=>{
  e.preventDefault();
  if(music.paused){try{await music.play();navMusic.classList.add("playing")}catch(e){}}
  else{music.pause();navMusic.classList.remove("playing")}
});

document.querySelectorAll(".photo").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const src=btn.dataset.src,img=new Image();
    img.onload=()=>{$("#lightboxImage").src=src;$("#lightbox").classList.add("open")};
    img.onerror=()=>alert("Foto belum tersedia. Tambahkan file "+src);
    img.src=src;
  });
});
$("#closeLightbox").onclick=()=>$("#lightbox").classList.remove("open");
$("#lightbox").onclick=e=>{if(e.target.id==="lightbox")$("#lightbox").classList.remove("open")};

$("#copyAccount").addEventListener("click",async()=>{
  try{await navigator.clipboard.writeText($("#copyAccount").dataset.copy);$("#copyMessage").textContent="Nomor rekening berhasil disalin."}
  catch(e){$("#copyMessage").textContent=$("#copyAccount").dataset.copy}
  setTimeout(()=>$("#copyMessage").textContent="",2500);
});

const KEY="rizal-luxury-wishes";
const get=()=>JSON.parse(localStorage.getItem(KEY)||"[]");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function render(){
 const list=get(),c={"Hadir":0,"Tidak Hadir":0,"Masih Ragu":0};
 list.forEach(x=>c[x.attendance]++);
 $("#presentCount").textContent=c["Hadir"];$("#absentCount").textContent=c["Tidak Hadir"];$("#maybeCount").textContent=c["Masih Ragu"];
 $("#wishesList").innerHTML=list.slice().reverse().map(x=>`<article class="wish"><strong>${esc(x.name)}</strong><small>${esc(x.attendance)}</small><p>${esc(x.message)}</p></article>`).join("");
}
$("#rsvpForm").addEventListener("submit",e=>{
 e.preventDefault();
 const name=$("#guestInput").value.trim(),message=$("#messageInput").value.trim(),attendance=document.querySelector('input[name="attendance"]:checked')?.value;
 if(!name||!message||!attendance)return;
 const list=get();list.push({name,message,attendance});localStorage.setItem(KEY,JSON.stringify(list));
 e.target.reset();render();alert("Terima kasih atas ucapan dan konfirmasinya.");
});
render();
