export const wait = (time: number) => new Promise((r) => setTimeout(r, time))

const Time = {
  wait,
}

export default Time
module.exports = Time
