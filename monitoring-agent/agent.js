require("dotenv").config();
// console.log("API_KEY:", process.env.API_KEY);
const si = require("systeminformation");
const axios = require("axios");
const { exec } = require("child_process");
const { randomUUID } = require("crypto");

let activeWin;

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

const DEVICE_ID = "device-" + Math.floor(Math.random() * 1000);
const USER_ID = "user-001";
const SESSION_ID = "session-" + Date.now();

let buffer = [];

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

async function collect() {
  const cpu = await si.currentLoad();
  const mem = await si.mem();
  const app = await getActiveApp();

  return {
    eventId: randomUUID(),
    userId: USER_ID,
    deviceId: DEVICE_ID,
    sessionId: SESSION_ID,

    timestamp: new Date(),

    cpu: cpu.currentLoad,
    memory: (mem.used / mem.total) * 100,
    activeApp: app,
  };
}

async function flush() {
  if (buffer.length === 0) return;

  try {
    await axios.post(API_URL, buffer, {
      headers: {
        "x-api-key": API_KEY,
      },
    });

    // console.log(`✅ sent batch (${buffer.length})`);
    buffer.forEach((item, i) => {
      console.log(`--- Record ${i + 1} ---`);
      console.log(`App: ${item.activeApp}`);
      console.log(`CPU: ${item.cpu.toFixed(2)}%`);
      console.log(`Memory: ${item.memory.toFixed(2)}%`);
      console.log(`Time: ${item.timestamp}`);
    });
    buffer = [];
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);

    setTimeout(flush, 2000);
  }
}

async function loop() {
  while (true) {
    try {
      const data = await collect();
      buffer.push(data);

      console.log("collected", data.activeApp);

      if (buffer.length >= 10) {
        await flush();
      }
    } catch (err) {
      console.log("error collecting...");
    }

    await new Promise((res) => setTimeout(res, 1000));
  }
}

loop();
