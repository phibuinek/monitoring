const si = require("systeminformation");
const axios = require("axios");
const { exec } = require("child_process");

let activeWin;

async function getActiveApp() {
  try {
    if (!activeWin) {
      activeWin = (await import("active-win")).default;
    }
    const win = await activeWin();

    if (win?.owner?.name) return win.owner.name;
    if (win?.title) return win.title;
  } catch {}

  return new Promise((resolve) => {
    exec(
      `powershell "Get-Process | Where-Object {$_.MainWindowTitle} | Sort-Object CPU -Descending | Select-Object -First 1 | Select-Object -ExpandProperty ProcessName"`,
      (err, stdout) => {
        if (!err && stdout) return resolve(stdout.trim());
        resolve("unknown");
      },
    );
  });
}

const DEVICE_ID = "device-" + Math.floor(Math.random() * 1000);

async function collectAndSend() {
  try {
    const cpu = await si.currentLoad();
    const mem = await si.mem();
    const app = await getActiveApp();

    const data = {
      deviceId: DEVICE_ID,
      timestamp: new Date(),
      cpu: cpu.currentLoad,
      memory: (mem.used / mem.total) * 100,
      activeApp: app,
    };

    await axios.post("http://localhost:3000/metrics", data);

    console.log("sent", data);
  } catch (err) {
    console.log("error...");
  }
}

async function loop() {
  while (true) {
    await collectAndSend();
    await new Promise((res) => setTimeout(res, 5000));
  }
}

loop();
