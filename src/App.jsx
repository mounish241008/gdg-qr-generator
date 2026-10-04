import "./style.css";

function App() {

  function handleTypeChange(event) {
    const type = event.target.value;

    const info = document.getElementById("info");
    const wifiFields = document.getElementById("wififields");
    const error = document.getElementById("error");

    info.value = "";
    error.textContent = "";

    if (type === "wifi") {
      wifiFields.style.display = "block";
      info.style.display = "none";
    } else {
      wifiFields.style.display = "none";
      info.style.display = "block";
    }

    if (type === "url") {
      info.placeholder = "Enter URL";
    } else if (type === "phone") {
      info.placeholder = "Enter Phone Number";
    } else if (type === "email") {
      info.placeholder = "Enter email address";
    } else if (type === "text") {
      info.placeholder = "Enter text";
    }
  }
  function shakeButton(button){
    button.classList.remove("shake");
    void button.offsetWidth;
    button.classList.add("shake");

  }

  function generateQR() {
    const type = document.getElementById("qr-type").value;

    const info = document.getElementById("info");
    const qrcode = document.getElementById("qrcode");

    const error = document.getElementById("error");
    const ssid = document.getElementById("ssid");
    const wifiPassword = document.getElementById("wifipassword");
    const wifiSecurity = document.getElementById("wifisecurity");

    const ssidError = document.getElementById("ERROR");
    const passwordError = document.getElementById("Error");

    const fgColor = document.getElementById("fgColor");
    const bgColor = document.getElementById("bgColor");

    const qrSize = document.getElementById("qr-size");
    const errorCorrection =
      document.getElementById("errorCorrection");

    error.textContent = "";
    ssidError.textContent = "";
    passwordError.textContent = "";

    qrcode.innerHTML = "";

    let text = info.value;

    if (type === "phone") {

      if (!/^\d{10}$/.test(info.value)) {
        error.textContent =
        "Enter a valid 10-digit phone number.";
        shakeButton(generateBtn);
        return;
      }

      text = "tel:" + info.value;
    }

    else if (type === "email") {

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(info.value)) {
        error.textContent =
          "Enter a valid email address.";
        shakeButton(generateBtn);
        return;
      }

      text = "mailto:" + info.value;
    }

    else if (type === "text") {

      if (info.value.trim() === "") {
        error.textContent = "Please enter a text.";
        shakeButton(generateBtn);
        return;
      }
    }

    else if (type === "url") {

      try {
        const url = new URL(info.value);

        if (
          url.protocol !== "http:" &&
          url.protocol !== "https:"
        ) {
          error.textContent = "Enter a valid URL.";
          shakeButton(generateBtn);
          return;
        }

      } catch {
        error.textContent = "Enter a valid URL.";
        shakeButton(generateBtn);
        return;
      }
    }

    else if (type === "wifi") {

      if (ssid.value.trim() === "") {
        ssidError.textContent =
          "Please enter the Wi-Fi network name.";
        shakeButton(generateBtn);
        return;
      }

      if (
        wifiSecurity.value !== "nopass" &&
        wifiPassword.value.trim() === ""
      ) {
        passwordError.textContent =
          "Please enter the Wi-Fi password.";
        shakeButton(generateBtn);
        return;
      }

      text =
        "WIFI:T:" +
        wifiSecurity.value +
        ";S:" +
        ssid.value +
        ";P:" +
        wifiPassword.value +
        ";;";
    }

    if (fgColor.value === bgColor.value) {
      error.textContent =
        "Foreground and Background color cannot be the same!";
      return;
    }

    new QRCode(qrcode, {
      text: text,
      width: Number(qrSize.value),
      height: Number(qrSize.value),
      colorDark: fgColor.value,
      colorLight: bgColor.value,
      correctLevel:
        QRCode.CorrectLevel[errorCorrection.value]
    });
    qrcode.classList.remove("qr-animate");
    void qrcode.offsetWidth;
    qrcode.classList.add("qr-animate");

    let recentQRs =
      JSON.parse(localStorage.getItem("recentQRs")) || [];

    recentQRs.push(text);

    localStorage.setItem(
      "recentQRs",
      JSON.stringify(recentQRs)
    );

    showRecentQRs();
  }

  function applyPreset(foreground, background) {
    document.getElementById("fgColor").value = foreground;
    document.getElementById("bgColor").value = background;
  }

  function changeMargin(event) {
    document.getElementById("qrcode").style.padding =
      event.target.value + "px";
  }
  function downloadQR() {
    const qrcode = document.getElementById("qrcode");
    const downloadError =
      document.getElementById("downloaderror");

    const qrCanvas = qrcode.querySelector("canvas");

    downloadError.textContent = "";

    if (!qrCanvas) {
      downloadError.textContent =
        "Please generate a QR code first!";
      shakeButton(downloadbtn);
      return;
    }

    const link = document.createElement("a");

    link.href = qrCanvas.toDataURL("image/png");
    link.download = "my-qr-code.png";

    link.click();
  }
  
    
    
    
    
  

  function showRecentQRs() {

    const container =
      document.getElementById("recentQRs");

    container.innerHTML = "";

    const savedQRs =
      JSON.parse(localStorage.getItem("recentQRs")) || [];

    savedQRs.forEach(function (qr) {

      const item = document.createElement("p");

      item.textContent = qr;

      item.style.cursor = "pointer";

      item.addEventListener("click", function () {

        document.getElementById("info").value = qr;

      });

      container.appendChild(item);
    });
  }

  return (
    <div>
      <h1>QR Code Generator</h1>

      <div className="card">

        <label htmlFor="qr-type">QR Type</label>

        <select
          id="qr-type"
          onChange={handleTypeChange}
        >
          <option value="url">URL</option>
          <option value="text">Text</option>
          <option value="email">Email</option>
          <option value="phone">Phone</option>
          <option value="wifi">WiFi</option>
        </select>

        <label htmlFor="info">
          Enter Information
        </label>

        <input
          type="text"
          id="info"
          placeholder="Enter URL"
        />

        <p id="error" className="error-message"></p>

        <div id="wififields">

          <input
            type="text"
            id="ssid"
            placeholder="Network name(SSID)"
          />

          <p
            id="ERROR"
            className="error-message"
          ></p>

          <input
            type="password"
            id="wifipassword"
            placeholder="Password"
          />

          <p
            id="Error"
            className="error-message"
          ></p>

          <select id="wifisecurity">
            <option value="WPA">WPA/WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">
              No password
            </option>
          </select>

        </div>

        <div id="presets">

          <h3>Presets</h3>

          <button
            id="classicPreset"
            type="button"
            onClick={() =>
              applyPreset("#000000", "#ffffff")
            }
          >
            Classic
          </button>

          <button
            id="oceanPreset"
            type="button"
            onClick={() =>
              applyPreset("#00ffff", "#e0f2fe")
            }
          >
            Ocean
          </button>

          <button
            id="sunsetPreset"
            type="button"
            onClick={() =>
              applyPreset("#ff6b35", "#fff3e0")
            }
          >
            Sunset
          </button>

        </div>

        <label htmlFor="qr-size">
          QR Size
        </label>

        <input
          type="range"
          id="qr-size"
          min="100"
          max="500"
          defaultValue="250"
        />

        <label htmlFor="fgColor">
          QR Color
        </label>

        <input
          type="color"
          id="fgColor"
          defaultValue="#000000"
        />

        <label htmlFor="bgColor">
          Background Color
        </label>

        <input
          type="color"
          id="bgColor"
          defaultValue="#ffffff"
        />

        <label htmlFor="errorCorrection">
          Error Correction
        </label>

        <select
          id="errorCorrection"
          defaultValue="M"
        >
          <option value="L">Low</option>
          <option value="M">Medium</option>
          <option value="Q">Quartile</option>
          <option value="H">High</option>
        </select>

        <label htmlFor="qrMargin">
          QR Margin
        </label>

        <input
          type="range"
          id="qrMargin"
          min="0"
          max="30"
          defaultValue="10"
          onInput={changeMargin}
        />

        <button
          id="generateBtn"
          className="generate-btn"
          onClick={generateQR}
        >
          Generate QR
        </button>

        <button
          id="downloadbtn"
          className="download-btn"
          onClick={downloadQR}
        >
          Download QR
        </button>

        <p
          id="downloaderror"
          className="error-message"
        ></p>

        <div
          id="qrpreview"
          className="qr-preview"
        >
          <p>QR Preview</p>

          <div id="qrcode"></div>
        </div>

        <h3>Recent QR Codes</h3>

        <div id="recentQRs"></div>

      </div>
    </div>
  );
}

export default App;