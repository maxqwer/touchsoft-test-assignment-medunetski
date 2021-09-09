const FIVE_MINUTES_IN_MS = 5 * 60 * 1000;
const DEFAULT_REALLOC_FACTOR = 2;

class Consumer
{
  #period;
  #nums;
  #numStartIndex;
  #numsSum;
  #reallocFactor;

  /**
   * Constructor params:
   * period - time range in miliseconds for number expiration
   * reallocFactor - ratio between expired and present numbers when reallocation happens
   */
  constructor(period = FIVE_MINUTES_IN_MS, reallocFactor = DEFAULT_REALLOC_FACTOR) {
    this.#period = period;
    this.#reallocFactor = reallocFactor;
    this.#nums = [];
    this.#numStartIndex = 0;
    this.#numsSum = 0;
  }

  /**
   * Called periodically to consume an integer.
   */
  accept = (num) => {
    this.#nums.push({
      value: num,
      createdAt: Date.now()
    });
    this.#numsSum += num;
  }

  /**
   * Returns the mean (aka average) of numbers consumed in the 
   * last 5 minute period.
   */
  mean = () => {
    const rejectTime = Date.now() - this.#period;
    for (
      let curNum = this.#nums[this.#numStartIndex];
      curNum && (curNum.createdAt < rejectTime);
      curNum = this.#nums[++this.#numStartIndex]
    ) {
      this.#numsSum -= curNum.value;
    }

    setTimeout(this.#reallocate, 0);

    return 1.0 * this.#numsSum / (this.#nums.length - this.#numStartIndex);
  }

  #reallocate = () => {
    const usedSize = this.#nums.length - this.#numStartIndex;
    const trashSize = this.#numStartIndex;
    if (trashSize * this.#reallocFactor > usedSize) {
      this.#nums.splice(0, this.#numStartIndex);
      this.#numStartIndex = 0;
    }
  }
}

module.exports = Consumer;
