const { toFahrenheit, parseBP, assessRisk } = require("./app");
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ✗ ${name}`);
    console.error(`    Expected: ${e.expected}`);
    console.error(`    Received: ${e.received}`);
    failed++;
  }
}

function expect(received) {
  return {
    toBe(expected) {
      if (received !== expected) {
        const err = new Error("Value mismatch");
        err.expected = expected;
        err.received = received;
        throw err;
      }
    }
  };
}

console.log("\n🧪 Running HealBot Tests...\n");

test("converts 0°C to 32°F", () => {
  expect(toFahrenheit(0)).toBe(32);
});

test("converts 100°C to 212°F", () => {
  expect(toFahrenheit(100)).toBe(212);
});

test("parseBP returns correct values", () => {
  const result = parseBP("120/80");
  if (result.systolic !== 120) throw { expected: 120, received: result.systolic, message: "systolic wrong" };
});

test("heart rate 110 is high risk", () => {
  expect(assessRisk({ heart_rate: 110 })).toBe("high");
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  console.error(`❌ ${failed} test(s) failed — sending to HealBot AI...\n`);
  process.exit(1);
} else {
  console.log("✅ All tests passed!\n");
}