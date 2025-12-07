
  const registeredVoters = [
    { name: "Arohi", usn: "CS005", password: "124" },
    { name: "Amrutha", usn: "CS002", password: "456" },
    { name: "Aishwarya", usn: "CS003", password: "789" },
    { name: "Deekshitha", usn: "CS004", password: "143" },
    { name: "Santosh", usn: "CS001", password: "142" },
    { name: "Roshan", usn: "CS006", password: "145" },
    { name: "Anil", usn: "CS007", password: "148" }
    
  ];
  const boysCandidates = [
    { name: "Vinay", usn: "CS005", emoji: "👨" },
    { name: "Virat", usn: "CS006", emoji: "👨" },
    { name: "Guru", usn: "CS007", emoji: "👨" },
    { name: "Siddharth", usn: "CS008", emoji: "👨" }
    
  ];

  const girlsCandidates = [
    { name: "Riya", usn: "CS004", emoji: "👩" },
    { name: "Sana", usn: "CS003", emoji: "👩" },
    { name: "Imara", usn: "CS001", emoji: "👩" },
    { name: "Zoya", usn: "CS002", emoji: "👩" }
  ];

  let currentVoter = null;
  let selectedBoy = null;
  let selectedGirl = null;
  function renderCandidateList() {
    const boysDiv = document.getElementById("boysCandidates");
    const girlsDiv = document.getElementById("girlsCandidates");

    boysDiv.innerHTML = "";
    girlsDiv.innerHTML = "";

    boysCandidates.forEach(c => {
      const card = document.createElement("div");
      card.className = "candidate-card";
      card.innerHTML = `<div style="font-size:40px">${c.emoji}</div>
                        <b>${c.name}</b><br>${c.usn}`;

      card.onclick = () => {
        document.querySelectorAll("#boysCandidates .candidate-card")
          .forEach(card => card.classList.remove("selected"));
        card.classList.add("selected");
        selectedBoy = c;
        checkSubmitActive();
      };

      boysDiv.appendChild(card);
    });

    girlsCandidates.forEach(c => {
      const card = document.createElement("div");
      card.className = "candidate-card";
      card.innerHTML = `<div style="font-size:40px">${c.emoji}</div>
                        <b>${c.name}</b><br>${c.usn}`;

      card.onclick = () => {
        document.querySelectorAll("#girlsCandidates .candidate-card")
          .forEach(card => card.classList.remove("selected"));
        card.classList.add("selected");
        selectedGirl = c;
        checkSubmitActive();
      };

      girlsDiv.appendChild(card);
    });
  }

  function checkSubmitActive() {
    document.getElementById("submitVoteBtn").disabled = !(selectedBoy && selectedGirl);
  }

  let voteCount = JSON.parse(localStorage.getItem("voteCount")) || {
    boys: {},
    girls: {}
  };

  boysCandidates.forEach(c => {
    if (!voteCount.boys[c.usn]) voteCount.boys[c.usn] = 0;
  });

  girlsCandidates.forEach(c => {
    if (!voteCount.girls[c.usn]) voteCount.girls[c.usn] = 0;
  });

  localStorage.setItem("voteCount", JSON.stringify(voteCount));

  document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("voterName").value.trim();
    const usn = document.getElementById("voterUSN").value.trim().toUpperCase();
    const pass = document.getElementById("voterPassword").value.trim();

    const errorBox = document.getElementById("errorMessage");

    const voter = registeredVoters.find(v =>
      v.name.toLowerCase() === name.toLowerCase() &&
      v.usn.toUpperCase() === usn &&
      v.password === pass
    );

    if (!voter) {
      errorBox.textContent = "Invalid Name / USN / Password!";
      errorBox.style.display = "block";
      return;
    }

    if (localStorage.getItem("voted_" + voter.usn)) {
      errorBox.textContent = "You have already voted. You cannot vote again!";
      errorBox.style.display = "block";
      return;
    }

    currentVoter = voter;
    errorBox.style.display = "none";

    document.getElementById("loginSection").style.display = "none";
    document.getElementById("votingSection").style.display = "block";

    document.getElementById("voterInfo").innerHTML =
      <p><b>${voter.name}</b> (${voter.usn})</p>;

    renderCandidateList();
  });

  document.getElementById("submitVoteBtn").addEventListener("click", function () {
    if (!selectedBoy || !selectedGirl || !currentVoter) return;

    voteCount.boys[selectedBoy.usn]++;
    voteCount.girls[selectedGirl.usn]++;

    localStorage.setItem("voteCount", JSON.stringify(voteCount));

    localStorage.setItem("voted_" + currentVoter.usn, "true");

    document.getElementById("votingSection").style.display = "none";
    document.getElementById("successScreen").style.display = "block";
  });

  function openResultLogin() {
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("votingSection").style.display = "none";
    document.getElementById("successScreen").style.display = "none";
    document.getElementById("resultPage").style.display = "none";
    document.getElementById("resultLogin").style.display = "block";
  }

  function checkAdmin() {
    const pass = document.getElementById("adminPass").value;
    const err  = document.getElementById("adminError");

    if (pass === "admin123") {
      err.style.display = "none";
      loadResults();
    } else {
      err.style.display = "block";
    }
  }

  function loadResults() {
    document.getElementById("resultLogin").style.display = "none";
    document.getElementById("resultPage").style.display = "block";

    let vc = JSON.parse(localStorage.getItem("voteCount")) || { boys: {}, girls: {} };

    let boysHTML = "";
    boysCandidates.forEach(c => {
      let count = vc.boys[c.usn] || 0;
      boysHTML += <p><b>${c.name}</b> (${c.usn}) — <span>${count} votes</span></p>;
    });
    document.getElementById("resultBoys").innerHTML = boysHTML;

    let girlsHTML = "";
    girlsCandidates.forEach(c => {
      let count = vc.girls[c.usn] || 0;
      girlsHTML += <p><b>${c.name}</b> (${c.usn}) — <span>${count} votes</span></p>;
    });
    document.getElementById("resultGirls").innerHTML = girlsHTML;
  }

  function goHome() {
    location.reload();
  }

