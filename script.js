const KEY = "smart-expense-tracker-v1";
const form = document.getElementById("transactionForm");
const rows = document.getElementById("transactionRows");
const message = document.getElementById("message");
const today = new Date();
document.getElementById("date").value = [
  today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"),
  String(today.getDate()).padStart(2, "0")
].join("-");

let transactions = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch { return []; }
}
function save() { localStorage.setItem(KEY, JSON.stringify(transactions)); }
function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);
}
function safe(value) {
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  })[ch]);
}
function totals() {
  const income = transactions.filter(t => t.type === "income").reduce((sum,t) => sum + t.amount, 0);
  const expenses = transactions.filter(t => t.type === "expense").reduce((sum,t) => sum + t.amount, 0);
  return { income, expenses, balance: income - expenses };
}
function render() {
  const t = totals();
  document.getElementById("balance").textContent = money(t.balance);
  document.getElementById("income").textContent = money(t.income);
  document.getElementById("expenses").textContent = money(t.expenses);

  const query = document.getElementById("search").value.trim().toLowerCase();
  const type = document.getElementById("filterType").value;
  const filtered = transactions.filter(item =>
    (type === "all" || item.type === type) &&
    `${item.description} ${item.category}`.toLowerCase().includes(query)
  ).sort((a,b) => b.date.localeCompare(a.date));

  rows.innerHTML = filtered.map(item => `
    <tr>
      <td><span class="tx-description">${safe(item.description)}</span><span class="tx-sub">ID: ${safe(item.id.slice(0,8))}</span></td>
      <td>${safe(item.category)}</td>
      <td>${safe(item.date)}</td>
      <td><span class="pill ${item.type}">${item.type === "income" ? "Income" : "Expense"}</span></td>
      <td class="${item.type === "income" ? "amount-income" : "amount-expense"}">${item.type === "income" ? "+" : "−"}${money(item.amount)}</td>
      <td><button class="delete-btn" data-delete="${safe(item.id)}">Delete</button></td>
    </tr>`).join("");
  document.getElementById("empty").hidden = filtered.length > 0;
  renderCategories();
}
function renderCategories() {
  const expenses = transactions.filter(t => t.type === "expense");
  const groups = {};
  for (const item of expenses) groups[item.category] = (groups[item.category] || 0) + item.amount;
  const entries = Object.entries(groups).sort((a,b) => b[1] - a[1]);
  const chart = document.getElementById("categoryChart");
  if (!entries.length) {
    chart.innerHTML = '<p class="empty">Your expense categories will appear here after you add expenses.</p>';
    return;
  }
  const max = Math.max(...entries.map(([,amount]) => amount), 1);
  chart.innerHTML = entries.map(([category, amount]) => `
    <div class="category-row">
      <span>${safe(category)}</span>
      <div class="track"><div class="fill" style="width:${amount / max * 100}%"></div></div>
      <span class="category-amount">${money(amount)}</span>
    </div>`).join("");
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const description = String(data.get("description")).trim();
  const amount = Number(data.get("amount"));
  const date = String(data.get("date"));
  if (!description || !Number.isFinite(amount) || amount <= 0 || !date) {
    message.textContent = "Enter a description, valid amount, and date.";
    return;
  }
  transactions.push({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    description, amount, type: String(data.get("type")),
    category: String(data.get("category")), date
  });
  save();
  form.reset();
  document.getElementById("date").value = [
    today.getFullYear(), String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");
  message.textContent = "Transaction added!";
  render();
  setTimeout(() => message.textContent = "", 2200);
});
rows.addEventListener("click", event => {
  const button = event.target.closest("[data-delete]");
  if (!button) return;
  transactions = transactions.filter(t => t.id !== button.dataset.delete);
  save(); render();
});
document.getElementById("search").addEventListener("input", render);
document.getElementById("filterType").addEventListener("change", render);
document.getElementById("export").addEventListener("click", () => {
  if (!transactions.length) { alert("Add a transaction before exporting."); return; }
  const headers = ["Description","Amount","Type","Category","Date"];
  const quote = value => `"${String(value).replace(/"/g, '""')}"`;
  const csv = [headers, ...transactions.map(t => [t.description,t.amount,t.type,t.category,t.date])]
    .map(row => row.map(quote).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url; link.download = "expense-transactions.csv"; link.click();
  URL.revokeObjectURL(url);
});
document.getElementById("clear").addEventListener("click", () => {
  if (!transactions.length) return;
  if (!confirm("Delete every saved transaction? This cannot be undone.")) return;
  transactions = []; save(); render();
});
render();
