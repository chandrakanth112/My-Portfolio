  function toggleNav(){document.querySelector('nav').classList.toggle('active');}
    document.getElementById('contactForm')?.addEventListener('submit',function(e){e.preventDefault();const f=e.currentTarget;const data={name:f.name.value,email:f.email.value,message:f.message.value};const resp=document.getElementById('formResponse');resp.style.display='block';resp.textContent='Thanks '+(data.name||'there')+'! I received your message (demo). I will reply via email.';f.reset();});

console.log("✅ JS is connected!");
