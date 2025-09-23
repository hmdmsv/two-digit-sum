function toPersianDigits(str) {
  const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  return str.toString().replace(/\d/g, d => persianDigits[d]);
}



function toEnglishDigits(str) {
  const englishDigits = ['0','1','2','3','4','5','6','7','8','9'];
  return str.replace(/[۰-۹]/g, d => englishDigits['۰۱۲۳۴۵۶۷۸۹'.indexOf(d)]);
}

function isValidPersianDigit(str) {
  return /^[۰-۹]$/.test(str); // فقط یک رقم فارسی
}


function enforcePersianInput(inputId) {
  const input = document.getElementById(inputId);
  input.addEventListener("input", () => {
    const raw = toEnglishDigits(input.value);
    if (!/^\d?$/.test(raw)) {
      input.value = ""; // حذف کاراکتر نامعتبر
      return;
    }
    const cursorPos = input.selectionStart;
    input.value = toPersianDigits(raw);
    input.setSelectionRange(cursorPos, cursorPos);
  });
}

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
    const englishValue = toEnglishDigits(current.value);
    if (englishValue.length >= maxLength && /^\d+$/.test(englishValue)) {
      if (next.disabled) next.disabled = false;
      next.focus();
    }
  });
}

let activeField = null;
let checkBtnId = null;

function handleDigitClick(val) {
  const input = document.getElementById(activeField);
  if (!input) return;

  input.value = toPersianDigits(val);

  const checkBtn = document.getElementById(checkBtnId);
  const parent = input.closest(".problem");

  // فقط ورودی‌هایی که readonly هستن (یعنی با کیبورد عددی پر می‌شن)
  const stageInputs = parent.querySelectorAll("input[readonly]");
  const allFilled = Array.from(stageInputs).every(inp => toEnglishDigits(inp.value).length > 0);

  checkBtn.disabled = !allFilled;
}

function setActiveField(fieldId) {
  activeField = fieldId;

  const allInputs = document.querySelectorAll(".answer");
  allInputs.forEach(input => input.classList.remove("active"));

  const target = document.getElementById(fieldId);
  if (target) target.classList.add("active");
}

function createKeyboard() {
  const oldKeyboard = document.getElementById("custom-keyboard");
  if (oldKeyboard) oldKeyboard.remove();

  const keyboard = document.createElement("div");
  keyboard.id = "custom-keyboard";
  keyboard.className = "keyboard-bar";

  // ظرف داخلی برای دکمه‌ها
  const keyContainer = document.createElement("div");
  keyContainer.className = "key-container";

  for (let i = 0; i <= 9; i++) {
    const btn = document.createElement("button");
    btn.className = "key-btn";
    btn.textContent = toPersianDigits(i);
    btn.addEventListener("click", () => handleDigitClick(i));
    keyContainer.appendChild(btn);
  }

  keyboard.appendChild(keyContainer);
  document.body.appendChild(keyboard);
}


function setupStageKeyboard(stagePrefix, tensId, unitsId) {
  activeField = unitsId;
  checkBtnId = stagePrefix;

  createKeyboard();

  document.getElementById(unitsId).addEventListener("click", () => setActiveField(unitsId));
  if (tensId) {
    document.getElementById(tensId).addEventListener("click", () => setActiveField(tensId));
  }
}


function createFirstStage(data) {
  const container = document.getElementById("main-container");
  container.innerHTML = "";

  const stageDiv = document.createElement("div");
  stageDiv.className = "problem";

  stageDiv.innerHTML = `
    <div class="number-block">
    <span class="digit tens" id="num1-tens">${toPersianDigits(data.num1Tens)}</span>
    <span class="digit units" id="num1-units">${toPersianDigits(data.num1Units)}</span>
    </div>
    <span>+</span>
    <div class="number-block">
    <span class="digit tens" id="num2-tens">${toPersianDigits(data.num2Tens)}</span>
    <span class="digit units" id="num2-units">${toPersianDigits(data.num2Units)}</span>
    </div>
    <span>=</span>
    
    <input type="text" maxlength="1" class="answer tens-input" id="sum-tens" readonly>
    <input type="text" maxlength="1" class="answer units-input" id="sum-units" readonly>

    <div class="buttons">
      <button id="check-btn" disabled>بررسی جواب</button>
      <button id="hint-btn">راهنما</button>
    </div>
    <div id="feedback"></div>
    <div id="hint-section"></div>
  `;
  let selectedTens = null;
let selectedUnits = null;




  container.appendChild(stageDiv);

setupStageKeyboard("check-btn", "sum-tens", "sum-units");

  container.scrollIntoView({ behavior: "smooth", block: "end" });


document.getElementById("sum-tens").addEventListener("click", () => setActiveField("sum-tens"));
document.getElementById("sum-units").addEventListener("click", () => setActiveField("sum-units"));
  

  const tensInput = document.getElementById("sum-tens");
  const unitsInput = document.getElementById("sum-units");
  const checkBtn = document.getElementById("check-btn");

  function toggleButton() {
    checkBtn.disabled = !(tensInput.value && unitsInput.value);
    if (!checkBtn.disabled) checkBtn.focus();
  }

 

  checkBtn.addEventListener("click", () => {
    const tens = parseInt(toEnglishDigits(document.getElementById("sum-tens").value));
  const units = parseInt(toEnglishDigits(document.getElementById("sum-units").value));
  checkAnswer(data.tens, data.units, data);

  });

  document.getElementById("hint-btn").addEventListener("click", () => {
    disableFirstStage();
    createSecondStage(data);
  });

  // tensInput.focus();
  // autoTab("sum-tens", "sum-units");
  // enforcePersianInput("sum-tens");
  // enforcePersianInput("sum-units");
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
  <div class="number-block">
    <span class="digit units">${toPersianDigits(data.num1Units)}</span>
    </div>
    <span>+</span>
    <div class="number-block">
    <span class="digit units">${toPersianDigits(data.num2Units)}</span>
    </div>
    <span>=</span>

<div style="display: inline-block; text-align: center;">
    <div style="display: inline-block; text-align: center; margin-top: 10px;">
    <label for="carry-input" style="font-size: 14px;">انتقال</label><br>
    <input type="text" maxlength="1" class="carry-box" id="carry-input" readonly>
  </div>
  <div style="display: inline-block; text-align: center; margin-top: 10px;">
    <label for="sum2-units" style="font-size: 16px;">یکان</label><br>
    <input type="text" maxlength="1" class="answer units-input" id="sum2-units" readonly>
  </div>
</div>


    <div class="buttons">
      <button id="check2-btn" disabled>بررسی جواب</button>
      <button id="hint2-btn">راهنما</button>
    </div>
    <div id="feedback2"></div>
  `;

  hintSection.appendChild(stageDiv);
  setupStageKeyboard("check2-btn", "carry-input", "sum2-units");

  hintSection.scrollIntoView({ behavior: "smooth", block: "end" });
  document.getElementById("sum2-units").focus();
  autoTab("sum2-units", "carry-input");
  enforcePersianInput("sum2-units");
  enforcePersianInput("carry-input");

  const unitsInput = document.getElementById("sum2-units");
  const carryInput = document.getElementById("carry-input");
  const checkBtn = document.getElementById("check2-btn");

  function toggleCheckButton() {
    checkBtn.disabled = !(unitsInput.value && carryInput.value);
    if (!checkBtn.disabled) checkBtn.focus();
  }



  checkBtn.addEventListener("click", () => {
    const userUnits = parseInt(toEnglishDigits(unitsInput.value));
    const userCarry = parseInt(toEnglishDigits(carryInput.value));
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

    unitsInput.value = toPersianDigits(correctUnits);
    carryInput.value = toPersianDigits(correctCarry);
    checkBtn.disabled = false;
    document.getElementById("hint2-btn").disabled = true;
    document.getElementById("check2-btn").disabled = true;
    unitsInput.disabled = true;
    carryInput.disabled = true
    

    createThirdStage(data, correctCarry);
  });
}

function createThirdStage(data, carry) {
  const hintSection = document.getElementById("hint-section");

  const stageDiv = document.createElement("div");
  stageDiv.className = "problem";

  const sumTens = data.num1Tens + data.num2Tens + carry;

  stageDiv.innerHTML = `
   <div class="number-block">
    <span class="digit tens">${toPersianDigits(data.num1Tens)}</span>
    </div>
    <span>+</span>
    <div class="number-block">
    <span class="digit tens">${toPersianDigits(data.num2Tens)}</span>
    </div>
    <span>+</span>
    <span class="carry-box">${toPersianDigits(carry)}</span>
    <span>=</span>
    <div style="display: inline-block; text-align: center;">
    <div style="display: inline-block; text-align: center; margin-top: 10px;">
  <label for="sum3-tens" style="font-size: 14px;">دهگان</label><br>
  <input type="text" maxlength="2" class="answer tens-input" id="sum3-tens" readonly>
  </div>
    </div>

    <div class="buttons">
      <button id="check3-btn" disabled>بررسی جواب</button>
      <button id="hint3-btn">راهنما</button>
    </div>
    <div id="feedback3"></div>
  `;

  hintSection.appendChild(stageDiv);
  setupStageKeyboard("check3-btn", null, "sum3-tens");


  hintSection.scrollIntoView({ behavior: "smooth", block: "end" });
  document.getElementById("sum3-tens").focus();
  autoTab("sum3-tens", "check3-btn");
  enforcePersianInput("sum3-tens");


  const tensInput = document.getElementById("sum3-tens");
  const checkBtn = document.getElementById("check3-btn");

  tensInput.addEventListener("input", () => {
    checkBtn.disabled = tensInput.value === "";
  });

  checkBtn.addEventListener("click", () => {
    const userTens = parseInt(toEnglishDigits(tensInput.value));
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
    tensInput.value = toPersianDigits(sumTens);
    checkBtn.disabled = false;
    document.getElementById("hint3-btn").disabled = true;
    document.getElementById("check3-btn").disabled = true;
    tensInput.disabled = true;

    createFinalStage(data);
    
  });
}

function createFinalStage(data) {
  const hintSection = document.getElementById("hint-section");

  const stageDiv = document.createElement("div");
  stageDiv.className = "problem";

  stageDiv.innerHTML = `
    <div class="number-block">
    <span class="digit tens">${toPersianDigits(data.num1Tens)}</span>
    <span class="digit units">${toPersianDigits(data.num1Units)}</span>
    </div>
    <span>+</span>
    <div class="number-block">
    <span class="digit tens">${toPersianDigits(data.num2Tens)}</span>
    <span class="digit units">${toPersianDigits(data.num2Units)}</span>
    </div>
    <span>=</span>

<!-- خط اصلی محاسبه: فقط کادرهای ورودی با label بالا -->
<div style="display: inline-block; text-align: center;">
    <div style="display: inline-block; text-align: center; margin-top: 10px;">
    <label for="final-tens" style="font-size: 14px;">دهگان</label><br>
    <input type="text" maxlength="1" class="answer tens-input" id="final-tens" readonly>
  </div>
<div style="display: inline-block; text-align: center; margin-top: 10px;">
    <label for="final-tens" style="font-size: 14px;">یکان</label><br>
    <input type="text" maxlength="1" class="answer units-input" id="final-units" readonly>
  </div>

</div>

<!-- عناصر غیرمحاسباتی: جداگانه زیر خط اصلی -->
<div class="buttons" style="margin-top: 12px;">
  <button id="final-check-btn" disabled>بررسی جواب</button>
</div>
<div id="final-feedback" style="margin-top: 8px;"></div>
<div id="final-actions" style="margin-top: 15px;"></div>
  `;

  hintSection.appendChild(stageDiv);
  

    setupStageKeyboard("final-check-btn", "final-tens", "final-units");


  hintSection.scrollIntoView({ behavior: "smooth", block: "end" });
  // document.getElementById("final-units").focus();
  // autoTab("final-units", "final-tens");
  // enforcePersianInput("final-tens");
  // enforcePersianInput("final-units");

  const tensInput = document.getElementById("final-tens");
  const unitsInput = document.getElementById("final-units");
  const checkBtn = document.getElementById("final-check-btn");

  function toggleFinalCheck() {
    checkBtn.disabled = !(tensInput.value && unitsInput.value);
    if (!checkBtn.disabled) checkBtn.focus();
  }

  // tensInput.addEventListener("input", toggleFinalCheck);
  // unitsInput.addEventListener("input", toggleFinalCheck);

  checkBtn.addEventListener("click", () => {
    const userTens = parseInt(toEnglishDigits(tensInput.value));
    const userUnits = parseInt(toEnglishDigits(unitsInput.value));
    const correctTens = data.tens;
    const correctUnits = data.units;

    const feedback = document.getElementById("final-feedback");
    const actions = document.getElementById("final-actions");

    if (userTens === correctTens && userUnits === correctUnits) {
      feedback.textContent = "👏 آفرین! جواب نهایی کاملاً درست است!";
      feedback.style.color = "green";
      checkBtn.disabled = true;
      checkBtn.classList.add("disabled"); // اختیاری برای تغییر ظاهر

      actions.innerHTML = `
        <button class="final-actions" id="repeat-btn">🔁 تکرار</button>
        <button class="final-actions" id="next-btn">➡️ بعدی</button>
      `;

      

const nextBtn = document.getElementById("next-btn");
nextBtn.focus();

setTimeout(() => {
  nextBtn.scrollIntoView({ behavior: "smooth", block: "end" });
}, 50);

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
  document.getElementById("custom-keyboard")?.remove();
  createKeyboard();

  const newCheckBtn = document.getElementById("final-check-btn").cloneNode(true);
  document.getElementById("check-btn").replaceWith(newCheckBtn);

  const newHintBtn = document.getElementById("hint-btn").cloneNode(true);
  document.getElementById("hint-btn").replaceWith(newHintBtn);

  const tensInput = document.getElementById("sum-tens");
  const unitsInput = document.getElementById("sum-units");

  function toggleButton() {
    newCheckBtn.disabled = !(tensInput.value && unitsInput.value);
    if (!newCheckBtn.disabled) newCheckBtn.focus();
  }

  // tensInput.addEventListener("input", toggleButton);
  // unitsInput.addEventListener("input", toggleButton);

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
  console.log("Expected:", correctTens, correctUnits);

  const tensInput = document.getElementById("sum-tens").value;
  const unitsInput = document.getElementById("sum-units").value;
  const feedback = document.getElementById("feedback");

  if (parseInt(toEnglishDigits(tensInput)) === correctTens && parseInt(toEnglishDigits(unitsInput)) === correctUnits) {
    const checkBtn = document.getElementById("check-btn");
    feedback.textContent = "آفرین! جواب درست است 🎉";
    feedback.style.color = "green";
    disableFirstStage();
    checkBtn.disabled = true;
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

    const nextBtn = actionsDiv.querySelector("#next-btn");
    setTimeout(() => {
  nextBtn .scrollIntoView({ behavior: "smooth", block: "end" });
}, 0);



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