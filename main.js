// ===== Firebase SDKの読み込み =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ===== あなたのFirebase設定を入れてね =====
const firebaseConfig = {
  apiKey: "AIzaSyAhzyGSVtxvd3DeReR13iVybxAbx8W8vrg",
  authDomain: "point-3d4a0.firebaseapp.com",
  projectId: "point-3d4a0",
  storageBucket: "point-3d4a0.firebasestorage.app",
  messagingSenderId: "920865912707",
  appId: "1:920865912707:web:608ea8cc097247f3d728b6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===== 要素取得 =====
const loginDiv = document.getElementById("login");
const appDiv = document.getElementById("app");
const userDisplay = document.getElementById("user");
const pointsDisplay = document.getElementById("points");

// ===== ログイン状態を監視 =====
onAuthStateChanged(auth, async (user) => {
  if (user) {
    loginDiv.style.display = "none";
    appDiv.style.display = "block";
    userDisplay.textContent = `こんにちは、${user.displayName} さん！`;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      pointsDisplay.textContent = userSnap.data().points;
    } else {
      await setDoc(userRef, { points: 0 });
      pointsDisplay.textContent = 0;
    }
  } else {
    loginDiv.style.display = "block";
    appDiv.style.display = "none";
  }
});

// ===== ログイン・ログアウト =====
document.getElementById("googleLogin").onclick = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

document.getElementById("logout").onclick = () => signOut(auth);

// ===== 広告再生ボタン =====
document.getElementById("watchAd").onclick = async () => {
  alert("🎬 広告を再生中…");
  (adsbygoogle = window.adsbygoogle || []).push({});

  // 🎁 広告視聴後にポイント加算
  const user = auth.currentUser;
  if (!user) return;
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  const newPoints = (userSnap.data().points || 0) + 10;
  await updateDoc(userRef, { points: newPoints });
  pointsDisplay.textContent = newPoints;
  alert("✅ 10ポイント追加されました！");
};
