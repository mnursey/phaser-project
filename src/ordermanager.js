class OrderManager {

  constructor (orderCards, activeOrders){
    this.orderCards = orderCards !== undefined && Array.isArray(orderCards) ? orderCards : [];
    this.activeOrders = activeOrders !== undefined && Array.isArray(activeOrders) ? activeOrders : [];
  }

  GetOrderCards () {
    return this.orderCards;
  }

  SetOrderCards (orderCards) {

    if(orderCards === undefined || !Array.isArray(orderCards)){
      throw "Attempting to set orderCards to something other than an array!";
    }

    this.orderCards = orderCards;
  }

  AddOrderCard(orderCard){
    this.orderCards.push(orderCard);
  }

  RemoveOrderCard (index) {
    return this.orderCards.splice(index);
  }

  GetActiveOrders () {
    return this.activeOrders;
  }

  AddActiveOrder (orderCard, order) {
    this.activeOrders.push({ 'orderCard' : orderCard, 'order' : order});
  }

  RemoveActiveOrder (index) {
    return this.activeOrders.splice(index);
  }

  ActivateOrder (index, order) {
    AddActiveOrder(this.orderCards[index] , order);
    RemoveOrderCard(index);
  }

  DeactivateOrder(index) {
    AddOrderCard(RemoveActiveOrder(index)['orderCard']);
  }

  Update() {

  }
}

class OrderManagerDisplay {

  constructor(){
    this.orderCards = [];
    this.activeOrder = [];
  }

  AddOrderCard(){

  }

  RemoveOrderCard(){

  }

  AddActiveOrderCard(){

  }

  RemoveActiveOrderCard(){

  }

  Update(){

  }
}
