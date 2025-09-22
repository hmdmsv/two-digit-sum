function generateNumbers() {
  let num1, num2;
  do {
    num1 = Math.floor(Math.random() * 90) + 10;
    num2 = Math.floor(Math.random() * 90) + 10;
  } while (num1 + num2 >= 100);

  return {
    total: num1 + num2,
    tens: Math.floor((num1 + num2) / 10),
    units: (num1 + num2) % 10,
    num1Units: num1 % 10,
    num2Units: num2 % 10,
    num1Tens: Math.floor(num1 / 10),
    num2Tens: Math.floor(num2 / 10)
  };
}

function autoTab(currentInputId, nextInputId, maxLength = 1) {
  const current = document.getElementById(currentInputId);
  const next = document.getElementById(nextInputId);

  current.addEventListener("input", () => {
    if (current.value.length >= maxLength) {
      if (next.disabled) next.disabled = false;
      next.focus();
    }
  });
}

function createFirstStage(data) {
  const container = document.getElementById("main-container");
  container.innerHTML = "";

  const stageDiv = document.createElement("div");
  stageDiv.className = "problem";

  stageDiv.innerHTML = `
    <span class="digit tens" id="num1-tens">${data.num1Tens}</span>
    <span class="digit units" id="num1-units">${data.num1Units}</span>
    <span>+</span>
    <span class="digit tens" id="num2-tens">${data.num2Tens}</span>
    <span class="digit units" id="num2-units">${data.num2Units}</span>
    <span>=</span>

    <input type="text" maxlength="1" class="answer tens-input" id="sum-tens" placeholder="دهگان">
    <input type="text" maxlength="1" class="answer units-input" id="sum-units" placeholder="یکان">

    <div class="buttons">
      <button id="check-btn" disabled>بررسی جواب</button>
      <button id="hint-btn">راهنما</button>
    </div>
    <div id="feedback"></div>
    <div id="hint-section"></div>
  `;

  container.appendChild(stageDiv);

  const tensInput = document.getElementById("sum-tens");
  const unitsInput = document.getElementById("sum-units");
  const checkBtn = document.getElementById("check-btn");

  function toggleButton() {
    checkBtn.disabled = !(tensInput.value && unitsInput.value);
  }

  tensInput.addEventListener("input", toggleButton);
  unitsInput.addEventListener("input", toggleButton);

  checkBtn.addEventListener("click", () => {
    checkAnswer(data.tens, data.units, data);
  });

  document.getElementById("hint-btn").addEventListener("click", () => {
    disableFirstStage();
    createSecondStage(data);
  });

  tensInput.focus();
  autoTab("sum-tens", "sum-units");
}

function disableFirstStage() {
  document.getElementById("sum-tens").disabled = true;
  document.getElementById("sum-units").disabled = true;
  document.getElementById("check-btn").disabled = true;
  document.getElementById("hint-btn").disabled = true;
}

function createSecondStage(data) {
  const hintSection = document.getElementById("hint-section");
  hintSection.innerHTML = ""; // پاک‌سازی مرحله قبلی

  const stageDiv = document.createElement("div");
  stageDiv.className = "problem";

  stageDiv.innerHTML = `
    <span class="digit units">${data.num1Units}</span>
    <span>+</span>
    <span class="digit units">${data.num2Units}</span>
    <span>=</span>

    <div style="display: inline-block; text-align: center;">
      <input type="text" maxlength="1" class="carry-box" id="carry-input" placeholder="انتقال">
      <br>
      <input type="text" maxlength="1" class="answer units-input" id="sum2-units" placeholder="یکان">
    </div>

    <div class="buttons">
      <button id="check2-btn" disabled>بررسی جواب</button>
      <button id="hint2-btn">راهنما</button>
    </div>
    <div id="feedback2"></div>
  `;

  hintSection.appendChild(stageDiv);
  document.getElementById("sum2-units").focus();
  autoTab("sum2-units", "carry-input");

  const unitsInput = document.getElementById("sum2-units");
  const carryInput = document.getElementById("carry-input");
  const checkBtn = document.getElementById("check2-btn");

  function toggleCheckButton() {
    checkBtn.disabled = !(unitsInput.value && carryInput.value);
    if (!checkBtn.disabled) checkBtn.focus();
  }

  unitsInput.addEventListener("input", toggleCheckButton);
  carryInput.addEventListener("input", toggleCheckButton);

  checkBtn.addEventListener("click", () => {
    const userUnits = parseInt(unitsInput.value);
    const userCarry = parseInt(carryInput.value);
    const correctUnits = (data.num1Units + data.num2Units) % 10;
    const correctCarry = (data.num1Units + data.num2Units) >= 10 ? 1 : 0;

    const feedback = document.getElementById("feedback2");

    if (userUnits === correctUnits && userCarry === correctCarry) {
      feedback.textContent = "آفرین! هم یکان و هم انتقال درست هستند 🎉";
      feedback.style.color = "green";
      createThirdStage(data, correctCarry);
    } else {
      feedback.textContent = "اشتباهه! دوباره تلاش کن 😅";
      feedback.style.color = "#d9534f";
    }
  });

  document.getElementById("hint2-btn").addEventListener("click", () => {
    const correctUnits = (data.num1Units + data.num2Units) % 10;
    const correctCarry = (data.num1Units + data.num2Units) >= 10 ? 1 : 0;

    unitsInput.value = correctUnits;
    carryInput.value = correctCarry;
    checkBtn.disabled = false;
    createThirdStage(data, correctCarry);
  });
}

function createThirdStage(data, carry) {
  const hintSection = document.getElementById("hint-section");

  const stageDiv = document.createElement("div");
  stageDiv.className = "problem";

  const sumTens = data.num1Tens + data.num2Tens + carry;

  stageDiv.innerHTML = `
    <span class="digit tens">${data.num1Tens}</span>
    <span>+</span>
    <span class="digit tens">${data.num2Tens}</span>
    <span>+</span>
    <span class="digit carry">${carry}</span>
    <span>=</span>

    <input type="text" maxlength="2" class="answer tens-input" id="sum3-tens" placeholder="دهگان">

    <div class="buttons">
      <button id="check3-btn" disabled>بررسی جواب</button>
      <button id="hint3-btn">راهنما</button>
    </div>
    <div id="feedback3"></div>
  `;

  hintSection.appendChild(stageDiv);
  document.getElementById("sum3-tens").focus();
  autoTab("sum3-tens", "check3-btn");

  const tensInput = document.getElementById("sum3-tens");
  const checkBtn = document.getElementById("check3-btn");

  tensInput.addEventListener("input", () => {
    checkBtn.disabled = tensInput.value === "";
  });

  checkBtn.addEventListener("click", () => {
    const userTens = parseInt(tensInput.value);
    const feedback = document.getElementById("feedback3");

    if (userTens === sumTens) {
      feedback.textContent = "آفرین! دهگان درست است 🎉";
      feedback.style.color = "green";
      createFinalStage(data);
    } else {
      feedback.textContent = "اشتباهه! دوباره تلاش کن 😅";
      feedback.style.color = "#d9534f";
    }
  });

  document.getElementById("hint3-btn").addEventListener("click", () => {
    tensInput.value = sumTens;
    checkBtn.disabled = false;
    createFinalStage(data);
  });
}

function createFinalStage(data) {
  const hintSection = document.getElementById("hint-section");

  const stageDiv = document.createElement("div");
  stageDiv.className = "problem";

  stageDiv.innerHTML = `
    <span class="digit tens">${data.num1Tens}</span>
    <span class="digit units">${data.num1Units}</span>
    <span>+</span>
    <span class="digit tens">${data.num2Tens}</span>
    <span class="digit units">${data.num2Units}</span>
    <span>=</span>

    <input type="text" maxlength="1" class="answer tens-input" id="final-tens" placeholder="دهگان">
    <input type="text" maxlength="1" class="answer units-input" id="final-units" placeholder="یکان">

    <div class="buttons">
      <button id="final-check-btn" disabled>بررسی جواب</button>
    </div>
    <div id="final-feedback"></div>
    <div id="final-actions" style="margin-top: 15px;"></div>
  `;

  hintSection.appendChild(stageDiv);
  document.getElementById("final-tens").focus();
  autoTab("final-tens", "final-units");

  const tensInput = document.getElementById("final-tens");
  const unitsInput = document.getElementById("final-units");
  const checkBtn = document.getElementById("final-check-btn");

  function toggleFinalCheck() {
    checkBtn.disabled = !(tensInput.value && unitsInput.value);
  }

  tensInput.addEventListener("input", toggleFinalCheck);
  unitsInput.addEventListener("input", toggleFinalCheck);

  checkBtn.addEventListener("click", () => {
    const userTens = parseInt(tensInput.value);
    const userUnits = parseInt(unitsInput.value);
    const correctTens = data.tens;
    const correctUnits = data.units;

    const feedback = document.getElementById("final-feedback");
    const actions = document.getElementById("final-actions");

    if (userTens === correctTens && userUnits === correctUnits) {
      feedback.textContent = "👏 آفرین! جواب نهایی کاملاً درست است!";
      feedback.style.color = "green";

      actions.innerHTML = `
        <button id="repeat-btn">🔁 تکرار</button>
        <button id="next-btn">➡️ بعدی</button>
      `;

      document.getElementById("repeat-btn").addEventListener("click", () => {
        resetStages(data);
      });

      document.getElementById("next-btn").addEventListener("click", () => {
        location.reload();
      });
    } else {
      feedback.textContent = "جواب نهایی اشتباهه! دوباره تلاش کن 😅";
      feedback.style.color = "#d9534f";
    }
  });
}

function resetStages(data) {
  const hintSection = document.getElementById("hint-section");
  hintSection.innerHTML = "";

  document.getElementById("feedback").textContent = "";
  document.getElementById("sum-tens").value = "";
  document.getElementById("sum-units").value = "";
  document.getElementById("sum-tens").disabled = false;
  document.getElementById("sum-units").disabled = false;
  document.getElementById("check-btn").disabled = true;
  document.getElementById("hint-btn").disabled = false;

  const newCheckBtn = document.getElementById("check-btn").cloneNode(true);
  document.getElementById("check-btn").replaceWith(newCheckBtn);

  const newHintBtn = document.getElementById("hint-btn").cloneNode(true);
  document.getElementById("hint-btn").replaceWith(newHintBtn);

  const tensInput = document.getElementById("sum-tens");
  const unitsInput = document.getElementById("sum-units");

  function toggleButton() {
    newCheckBtn.disabled = !(tensInput.value && unitsInput.value);
  }

  tensInput.addEventListener("input", toggleButton);
  unitsInput.addEventListener("input", toggleButton);

  newCheckBtn.addEventListener("click", () => {
    checkAnswer(data.tens, data.units, data);
  });

  newHintBtn.addEventListener("click", () => {
    disableFirstStage();
    createSecondStage(data);
  });

  tensInput.focus();
  autoTab("sum-tens", "sum-units");
}

function checkAnswer(correctTens, correctUnits, data) {
  const tensInput = document.getElementById("sum-tens").value;
  const unitsInput = document.getElementById("sum-units").value;
  const feedback = document.getElementById("feedback");

  if (parseInt(tensInput) === correctTens && parseInt(unitsInput) === correctUnits) {
    feedback.textContent = "آفرین! جواب درست است 🎉";
    feedback.style.color = "green";
    disableFirstStage();
    showFinalActions(data); // فقط دکمه‌ها رو نمایش بده
  } else {
    feedback.textContent = "اشتباهه! دوباره تلاش کن 😅";
    feedback.style.color = "#d9534f";
  }
}

function showFinalActions(data) {
  const hintSection = document.getElementById("hint-section");
  hintSection.innerHTML = ""; // پاک‌سازی مراحل قبلی

  const actionsDiv = document.createElement("div");
  actionsDiv.id = "final-actions";
  actionsDiv.innerHTML = `
    <button id="repeat-btn">🔁 تکرار</button>
    <button id="next-btn">➡️ بعدی</button>
  `;

  hintSection.appendChild(actionsDiv);

  document.getElementById("repeat-btn").addEventListener("click", () => {
    resetStages(data);
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    location.reload();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const data = generateNumbers();
  createFirstStage(data);
});