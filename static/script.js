// ======= Mobile menu toggle =======
document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  }

  // Hook forms in modals (if present)
  const contactForm = document.getElementById('contactForm');
  const budgetForm = document.getElementById('budgetForm');

  if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
  if (budgetForm) budgetForm.addEventListener('submit', handleBudgetSubmit);

  // close modals on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeContactModal(); closeBudgetModal();
    }
  });
});

// ======= Modal helpers =======
function openContactModal(){ document.getElementById('contactModal')?.classList.remove('hidden'); }
function closeContactModal(){ document.getElementById('contactModal')?.classList.add('hidden'); }
function openBudgetModal(){ document.getElementById('budgetModal')?.classList.remove('hidden'); }
function closeBudgetModal(){ document.getElementById('budgetModal')?.classList.add('hidden'); }

// Close modals clicking on backdrop
document.addEventListener('click', (e) => {
  const contactModal = document.getElementById('contactModal');
  const budgetModal = document.getElementById('budgetModal');
  if (contactModal && !contactModal.classList.contains('hidden') && e.target === contactModal) closeContactModal();
  if (budgetModal && !budgetModal.classList.contains('hidden') && e.target === budgetModal) closeBudgetModal();
});

// ======= Toast =======
function showToast(message, isError=false){
  const toastEl = document.getElementById('toast');
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.style.background = isError ? 'linear-gradient(90deg,#ef4444,#f97316)' : 'linear-gradient(90deg,#10b981,#06b6d4)';
  toastEl.classList.remove('hidden');
  setTimeout(()=> toastEl.classList.add('hidden'), 4500);
}

// ======= Contact submit (AJAX, JSON) =======
async function handleContactSubmit(e){
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const payload = {
    name: fd.get('name') || '',
    email: fd.get('email') || '',
    phone: fd.get('phone') || '',
    message: fd.get('message') || ''
  };

  const submitBtn = form.querySelector('button[type="submit"]');
  const orig = submitBtn ? submitBtn.innerHTML : null;
  try {
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = 'Enviando...'; }
    const res = await fetch('/submit_contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (res.ok && json.success) {
      showToast(json.message || 'Mensagem enviada com sucesso!');
      form.reset();
      closeContactModal();
    } else {
      showToast(json.error || 'Erro ao enviar mensagem.', true);
    }
  } catch (err){
    console.error(err);
    showToast('Erro ao enviar mensagem. Verifique a conexão.', true);
  } finally {
    if (submitBtn) { submitBtn.disabled = false; if (orig) submitBtn.innerHTML = orig; }
  }
}

// ======= Budget submit (AJAX) =======
async function handleBudgetSubmit(e){
  e.preventDefault();
  const form = e.target;
  const fd = new FormData(form);
  const payload = {
    name: fd.get('name') || '',
    email: fd.get('email') || '',
    platform: fd.get('platform') || '',
    service_type: fd.get('service_type') || '',
    budget_range: fd.get('budget_range') || '',
    description: fd.get('description') || ''
  };

  const submitBtn = form.querySelector('button[type="submit"]');
  const orig = submitBtn ? submitBtn.innerHTML : null;
  try {
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = 'Enviando...'; }
    const res = await fetch('/request_budget', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (res.ok && json.success) {
      showToast(json.message || 'Solicitação enviada com sucesso!');
      form.reset();
      closeBudgetModal();
    } else {
      showToast(json.error || 'Erro ao solicitar orçamento.', true);
    }
  } catch (err){
    console.error(err);
    showToast('Erro ao solicitar orçamento. Verifique a conexão.', true);
  } finally {
    if (submitBtn) { submitBtn.disabled = false; if (orig) submitBtn.innerHTML = orig; }
  }
}

// ======= WhatsApp / Email integration (your provided contacts) =======
function openWhatsApp(){
  // country code +55, area 21, number 974424452
  const phone = "5521974424452";
  const message = "Olá Vinícius! Gostaria de solicitar um orçamento para desenvolvimento de Expert Advisor.";
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

function openEmail(){
  const email = "viniciusonrj@gmail.com";
  const subject = "Solicitação de Orçamento - Desenvolvimento EA";
  const body = "Olá Vinícius,%0D%0A%0D%0AGostaria de solicitar um orçamento para desenvolvimento de Expert Advisor.%0D%0A%0D%0A[Descreva seu projeto aqui]";
  const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${body}`;
  window.location.href = url;
}
