define('test/data/amd/modules/factory-with-dependencies', [
  './cart',
  './inventory'
], function (cart, inventory) {
  return {
    color: 'blue',
    size: 'large',
    addToCart: function () {
      inventory.decrement(this);
      cart.add(this);
    }
  };
});