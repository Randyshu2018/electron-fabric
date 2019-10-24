async function test (num) {
  await sleep()
  console.log(num)
}

async function sleep () {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve()
    }, 1000)
  })
}

async function testLoop () {
  for (let i = 0; i < 10; i++) {
    await test(i)
  }
}

testLoop()
