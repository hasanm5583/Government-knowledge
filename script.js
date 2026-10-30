const questions = [
  {
    country: "United Kingdom",
    flag: "UK",
    system: "Parliamentary monarchy",
    prompt: "A prime minister loses the support of most lawmakers. What can happen next?",
    options: [
      "The president removes them",
      "Parliament can force a new government",
      "The Supreme Court appoints a replacement",
      "Nothing until the next fixed election"
    ],
    answer: 1,
    explain:
      "In the UK, the prime minister depends on the confidence of the House of Commons. A confidence loss can lead to a new prime minister or an election.",
    clue: "The executive grows out of the legislature."
  },
  {
    country: "Germany",
    flag: "DE",
    system: "Federal parliamentary republic",
    prompt: "Which feature helps Germany avoid a sudden change of government?",
    options: [
      "A ceremonial monarch",
      "The constructive vote of no confidence",
      "No political parties",
      "A president with unlimited power"
    ],
    answer: 1,
    explain:
      "Germany’s Bundestag can remove a chancellor only when it simultaneously agrees on a successor. This is called a constructive vote of no confidence.",
    clue: "Stability is designed into the rules."
  },
  {
    country: "France",
    flag: "FR",
    system: "Semi-presidential republic",
    prompt: "France has both a president and a prime minister. What does that usually mean?",
    options: [
      "Two monarchs share power",
      "The president and parliament-selected government share executive work",
      "The prime minister is only symbolic",
      "Citizens vote on every law directly"
    ],
    answer: 1,
    explain:
      "France blends presidential and parliamentary ideas. The president is directly elected, while the prime minister leads a government that must work with the National Assembly.",
    clue: "Executive power has two centers."
  },
  {
    country: "Switzerland",
    flag: "CH",
    system: "Direct-democracy federation",
    prompt: "What makes Switzerland especially different from the United States?",
    options: [
      "It has no legislature",
      "Citizens can vote on many national initiatives and referendums",
      "Its courts write the budget",
      "It has one permanent leader"
    ],
    answer: 1,
    explain:
      "Swiss citizens regularly vote directly on proposals and can challenge laws through referendums. The system also uses a multi-member Federal Council.",
    clue: "People vote on more than just representatives."
  },
  {
    country: "Japan",
    flag: "JP",
    system: "Parliamentary constitutional monarchy",
    prompt: "In Japan, who is the head of government?",
    options: [
      "The emperor",
      "The prime minister",
      "The chief justice",
      "The governor of Tokyo"
    ],
    answer: 1,
    explain:
      "Japan’s emperor is a constitutional symbol. The prime minister, chosen by the National Diet, leads the government—unlike the US president, who is separately elected.",
    clue: "A symbolic head of state is separate from the political leader."
  }
];

let current = 0;
let score = 0;
let selected = null;

const app = document.querySelector("#app");

function scoreRing() {
  return `
    <div class="score-ring" aria-label="${score} out of ${questions.length} correct">
      <span>${score}</span>
      <small>/${questions.length}</small>
    </div>
  `;
}

function intro() {
  app.innerHTML = `
    <section class="intro-screen">
      <div class="eyebrow">✦ &nbsp; CIVICS IN 5 MINUTES</div>

      <h1>
        One country.<br />
        <em>Many ways</em> to govern.
      </h1>

      <p class="intro-copy">
        How does America compare with the rest of the world?
        Take a quick, curious tour through five government systems
        and discover why the rules shape everyday power.
      </p>

      <div class="intro-meta">
        <span><b>05</b> questions</span>
        <span><b>01</b> minute</span>
        <span><b>∞</b> things to learn</span>
      </div>

      <button class="primary-button" id="start">
        Start the tour <span>→</span>
      </button>

      <p class="disclaimer">
        A neutral learning game by design. Every system has tradeoffs.
      </p>
    </section>
  `;

  document.querySelector("#start").addEventListener("click", renderQuiz);
}

function renderQuiz() {
  const question = questions[current];

  app.innerHTML = `
    <section class="quiz-screen">
      <div class="quiz-head">
        <div>
          <span class="eyebrow">
            QUESTION ${String(current + 1).padStart(2, "0")} / 05
          </span>

          <div class="progress">
            <span style="width: ${((current + 1) / questions.length) * 100}%"></span>
          </div>
        </div>

        ${scoreRing()}
      </div>

      <div class="country-line">
        <span class="flag-chip">${question.flag}</span>

        <div>
          <h2>${question.country}</h2>
          <p>${question.system}</p>
        </div>

        <span class="versus">
          vs. <b>USA</b>
        </span>
      </div>

      <div class="question-card">
        <p class="question-label">THE SCENARIO</p>

        <h1>${question.prompt}</h1>

        <div class="options">
          ${question.options
            .map(
              (option, index) => `
                <button class="option" data-index="${index}">
                  <span class="option-letter">
                    ${String.fromCharCode(65 + index)}
                  </span>
                  <span>${option}</span>
                </button>
              `
            )
            .join("")}
        </div>
      </div>

      <div id="feedback"></div>

      <div class="quiz-footer">
        <p>Choose the answer that feels most likely.</p>
      </div>
    </section>
  `;

  document.querySelectorAll(".option").forEach((button) => {
    button.addEventListener("click", () => {
      choose(Number(button.dataset.index));
    });
  });
}

function choose(index) {
  if (selected !== null) {
    return;
  }

  selected = index;

  const question = questions[current];
  const buttons = document.querySelectorAll(".option");
  const isCorrect = index === question.answer;

  if (isCorrect) {
    score++;
  }

  buttons.forEach((button, buttonIndex) => {
    button.disabled = true;

    if (buttonIndex === question.answer) {
      button.classList.add("correct");
    }

    if (buttonIndex === index && !isCorrect) {
      button.classList.add("wrong");
    }
  });

  document.querySelector("#feedback").innerHTML = `
    <div class="explanation ${isCorrect ? "good" : ""}">
      <div class="explanation-tag">
        ${isCorrect ? "NICE WORK" : "GOOD TO KNOW"}
      </div>

      <p>${question.explain}</p>
      <small>${question.clue}</small>
    </div>
  `;

  document.querySelector(".quiz-footer").innerHTML = `
    <button class="primary-button" id="next">
      ${current === questions.length - 1 ? "See my results" : "Next comparison"}
      <span>→</span>
    </button>
  `;

  document.querySelector("#next").addEventListener("click", next);
}

function next() {
  if (current === questions.length - 1) {
    showResults();
  } else {
    current++;
    selected = null;
    renderQuiz();
  }
}

function showResults() {
  app.innerHTML = `
    <section class="result-screen">
      <div class="eyebrow">✦ &nbsp; TOUR COMPLETE</div>

      ${scoreRing()}

      <h1>
        You’re thinking<br />
        <em>comparatively.</em>
      </h1>

      <p class="intro-copy">
        You spotted ${
          score === questions.length
            ? "every distinction"
            : `${score} key distinction${score === 1 ? "" : "s"}`
        }.
        The big takeaway: there is no single blueprint for representative government.
      </p>

      <div class="takeaway">
        <span>THE BIG IDEA</span>

        <p>
          America is a presidential federal republic. Other democracies
          distribute power differently through parliaments, coalitions,
          referendums, or regional governments.
        </p>
      </div>

      <button class="primary-button" id="again">
        ↻ &nbsp; Play again
      </button>
    </section>
  `;

  document.querySelector("#again").addEventListener("click", () => {
    current = 0;
    score = 0;
    selected = null;
    intro();
  });
}

intro();
