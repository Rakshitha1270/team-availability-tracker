const teamEl = document.getElementById("team");
const messageEl = document.getElementById("message");

async function loadTeam() {
  try {
    const response = await fetch("/api/team");
    const team = await response.json();

    document.getElementById("total").textContent = team.length;
    document.getElementById("available").textContent =
      team.filter(x => x.status === "Available").length;
    document.getElementById("busy").textContent =
      team.filter(x => x.status === "Busy").length;
    document.getElementById("away").textContent =
      team.filter(x => x.status === "Away").length;

    teamEl.innerHTML = team.map(member => `
      <article class="card">
        <div class="card-top">
          <div class="person">
            <div class="avatar">${member.name.charAt(0)}</div>
            <div>
              <h3>${member.name}</h3>
              <p>${member.role}</p>
            </div>
          </div>
          <span class="badge ${member.status}">${member.status}</span>
        </div>

        <div class="controls">
          ${["Available", "Busy", "Away"].map(status => `
            <button
              class="${member.status === status ? "active" : ""}"
              onclick="updateStatus(${member.id}, '${status}')">
              ${status}
            </button>
          `).join("")}
        </div>
      </article>
    `).join("");
  } catch (error) {
    messageEl.textContent = "Unable to connect to the backend.";
  }
}

async function updateStatus(id, status) {
  const response = await fetch(`/api/team/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });

  if (response.ok) {
    messageEl.textContent = "Status updated successfully.";
    await loadTeam();
    setTimeout(() => messageEl.textContent = "", 1500);
  }
}

loadTeam();
setInterval(loadTeam, 3000);