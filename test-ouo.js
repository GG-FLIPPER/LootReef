async function test() {
  try {
    const res = await fetch("https://ouo.io/api/DqcUwvlx?s=https://google.com");
    console.log(res.status, res.headers);
    const text = await res.text();
    console.log("Response text:", text);
  } catch (e) {
    console.error("Fetch error:", e);
  }
}
test();
