// Clock
const hourHand = document.getElementById("hourHand");
const minuteHand = document.getElementById("minuteHand");
const clock = document.getElementById("clock");

for (let i = 0; i < 12; i++) {
  const line = document.createElement("div");
  line.className = "clock-line";
  line.style.transform = `rotate(${30 * i}deg)`;
  clock.appendChild(line);
}

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const hourAngle = hours * 30 + minutes * 0.5 - 90;
  const minuteAngle = minutes * 6 - 90;

  hourHand.style.transform = `rotate(${hourAngle}deg)`;
  minuteHand.style.transform = `rotate(${minuteAngle}deg)`;
}

updateClock();
setInterval(updateClock, 1000);

// Pressure Widget
const bars = document.getElementById("pressureBars");

for (let i = 0; i < 9; i++) {
  const bar = document.createElement("div");
  bar.className = "pressure-widget_bar";
  bars.appendChild(bar);
}

function updatePressureWidget() {
  const widget = document.getElementById("pressureWidget");
  if (!widget) return;

  const valueEl = widget.querySelector(".pressure-widget_value");
  const progressEl = widget.querySelector(".pressure-widget_progress");

  if (!valueEl || !progressEl) return;

  const value = parseFloat(valueEl.textContent);
  const max = parseFloat(widget.dataset.max);

  const percentage = Math.min(value / max, 1);

  progressEl.style.height = `${percentage * 100}%`;
}

updatePressureWidget();

// Sensor Widget

document.querySelectorAll(".sensor-widget").forEach((widget) => {
  for (let i = 0; i < 48; i++) {
    const tick = document.createElement("div");
    tick.className = "sensor-widget_line";
    tick.style.transform = `rotate(${7.5 * i}deg)`;
    widget.appendChild(tick);
  }
});
function updateSensorProgress(sensorId) {
  const widget = document.getElementById(sensorId);
  if (!widget) return;

  const valueEl = widget.querySelector(".sensor-widget_value");
  const circle = widget.querySelector(".sensor-widget_progress");

  if (!valueEl || !circle) return;

  const value = parseFloat(valueEl.textContent);
  const max = parseFloat(widget.dataset.max);
  const percentage = Math.min(value / max, 1);

  const radius = parseFloat(circle.getAttribute("r"));
  const circumference = 2 * Math.PI * radius;
  const fillLength = percentage * circumference;

  circle.style.strokeDasharray = `${fillLength} ${circumference}`;
}

function updateAllSensors() {
  updateSensorProgress("tempInside");
  updateSensorProgress("tempOutside");
  updateSensorProgress("humidityInside");
  updateSensorProgress("humidityOutside");
}

updateAllSensors();

// Progress Wheel
function updateProgressWheel() {
  const widget = document.getElementById("progressWheel");
  if (!widget) return;

  const valueEl = widget.querySelector(".progress-wheel_value");
  const circle = widget.querySelector(".progress-wheel_fill");

  if (!valueEl || !circle) return;

  const value = parseFloat(valueEl.textContent);
  const max = parseFloat(widget.dataset.max);
  const percentage = Math.min(value / max, 1);

  const radius = parseFloat(circle.getAttribute("r"));
  const circumference = 2 * Math.PI * radius;
  const fillLength = percentage * circumference;

  circle.style.strokeDasharray = `${fillLength} ${circumference}`;
}

updateProgressWheel();

// Temperature Slider

(function () {
  var container = document.getElementById("tempSlider");
  var slider = document.getElementById("tempSliderHandle");
  var valueDisplay = document.getElementById("tempSliderValue");
  var sliderW2 = 15;
  var sliderH2 = 15;
  var radius = 123;
  var deg = 97;
  var containerRect = container.getBoundingClientRect();
  var containerPos = {
    x: containerRect.left + 140,
    y: containerRect.top + 140,
  };
  var X = 0,
    Y = 0;
  var mdown = false;
  var maxTemp = parseFloat(container.dataset.max) || 50;
  var minTemp = parseFloat(container.dataset.min) || 0;

  function updatePosition() {
    X = Math.round(radius * Math.sin((deg * Math.PI) / 180));
    Y = Math.round(radius * -Math.cos((deg * Math.PI) / 180));
    slider.style.left = X + 140 - sliderW2 + "px";
    slider.style.top = Y + 140 - sliderH2 + "px";

    var temperature = minTemp + (deg / 360) * (maxTemp - minTemp);
    temperature = Math.round(temperature * 10) / 10;
    valueDisplay.textContent = temperature.toFixed(1) + "°C";
  }

  function updateContainerPos() {
    containerRect = container.getBoundingClientRect();
    containerPos = { x: containerRect.left + 140, y: containerRect.top + 140 };
  }

  updatePosition();
  window.addEventListener("resize", updateContainerPos);
  window.addEventListener("scroll", updateContainerPos);

  container.addEventListener("mousedown", function (e) {
    mdown = true;
    updateContainerPos();
  });

  document.addEventListener("mouseup", function (e) {
    mdown = false;
  });

  container.addEventListener("mousemove", function (e) {
    if (mdown) {
      var mPos = {
        x: e.clientX - containerPos.x,
        y: e.clientY - containerPos.y,
      };
      var atan = Math.atan2(mPos.x, mPos.y);
      deg = -atan / (Math.PI / 180) + 180;

      updatePosition();
    }
  });

  container.addEventListener("touchstart", function (e) {
    mdown = true;
    updateContainerPos();
    e.preventDefault();
  });

  document.addEventListener("touchend", function (e) {
    mdown = false;
  });

  container.addEventListener("touchmove", function (e) {
    if (mdown) {
      e.preventDefault();
      var touch = e.touches[0];
      var mPos = {
        x: touch.clientX - containerPos.x,
        y: touch.clientY - containerPos.y,
      };
      var atan = Math.atan2(mPos.x, mPos.y);
      deg = -atan / (Math.PI / 180) + 180;

      updatePosition();
    }
  });
})();

// Toggle

const toggles = document.querySelectorAll(".toggle");

toggles.forEach((toggle) => {
  const handle = toggle.querySelector(".toggle-handle");

  toggle.addEventListener("click", () => {
    if (toggle.classList.contains("restricted")) return;

    toggle.classList.toggle("active");

    if (toggle.classList.contains("active")) {
      handle.style.transform = "translateX(24px)";
    } else {
      handle.style.transform = "translateX(0px)";
    }
  });
});

// Sliders

function makeSlider({ handle, bar, filled, primary }) {
  let dragging = false;

  handle.addEventListener("mousedown", () => {
    dragging = true;
    document.body.style.userSelect = "none";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
    document.body.style.userSelect = "auto";
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    const barRect = bar.getBoundingClientRect();
    const handleRect = handle.getBoundingClientRect();
    const handleHalf = handleRect.width / 2;

    let x = e.clientX - barRect.left;

    primary
      ? (x = Math.max(handleHalf, Math.min(x, barRect.width - handleHalf)))
      : (x = Math.max(0, Math.min(x, barRect.width)));

    handle.style.left = `${x}px`;

    if (filled) {
      filled.style.width = `${x}px`;
    }
  });
}

makeSlider({
  handle: document.getElementById("sliderHandle"),
  bar: document.getElementById("sliderPrimary"),
  filled: null,
  primary: true,
});

makeSlider({
  handle: document.getElementById("sliderDrag"),
  bar: document.getElementById("sliderBar"),
  filled: document.getElementById("sliderFilled"),
  primary: false,
});

const tabWrappers = document.querySelectorAll(".tab-bar_wrapper");

tabWrappers.forEach((wrapper) => {
  wrapper.addEventListener("click", () => {
    // Remove active from all
    tabWrappers.forEach((w) => w.classList.remove("active"));
    // Add active to the clicked one
    wrapper.classList.add("active");
  });
});
