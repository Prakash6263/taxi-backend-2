class Common {
  constructor() {}
  async generateOrderID() {
    const orderNumber = Math.floor(Math.random() * 9000000) + 1000000;
    return orderNumber;
  }
}
let respObj = new Common();
export default respObj;
