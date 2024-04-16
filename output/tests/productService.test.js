describe('ProductService', () => {
  let service;

  beforeEach(() => {
    service = new ProductService();
  });

  it('should get all products from the database', async () => {
    const expectedProducts = [
      { id: 1, name: 'Product 1' },
      { id: 2, name: 'Product 2' },
    ];

    const actualProducts = await service.getAllProducts();

    expect(actualProducts).toEqual(expectedProducts);
  });

  it('should get a product by its ID from the database', async () => {
    const expectedProduct = { id: 1, name: 'Product 1' };

    const actualProduct = await service.getProductById(1);

    expect(actualProduct).toEqual(expectedProduct);
  });

  it('should create a new product in the database', async () => {
    const newProduct = { name: 'Product 3' };
    const expectedProduct = { id: 3, ...newProduct };

    const actualProduct = await service.createProduct(newProduct);

    expect(actualProduct).toEqual(expectedProduct);
  });

  it('should update a product in the database', async () => {
    const updatedProduct = { id: 1, name: 'Updated Product 1' };
    const expectedProduct = updatedProduct;

    const actualProduct = await service.updateProduct(updatedProduct);

    expect(actualProduct).toEqual(expectedProduct);
  });

  it('should delete a product from the database', async () => {
    const productId = 1;

    await service.deleteProduct(productId);

    const products = await service.getAllProducts();

    expect(products).not.toContainEqual({ id: productId });
  });
});