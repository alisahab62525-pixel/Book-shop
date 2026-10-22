import { Product, ProductCategory } from '../types/index.ts';
import { LocalStorageUtil, StorageKeys } from '../utils/storage.ts';
import { initialProducts, initialCategories } from '../data/initialData.ts';
import { FirestoreService } from '../firebase/firestoreService.ts';

export class ProductService {
  static getProducts(): Product[] {
    const products = LocalStorageUtil.get<Product[]>(StorageKeys.PRODUCTS, initialProducts);
    return products;
  }

  static saveProducts(products: Product[]): boolean {
    return LocalStorageUtil.set(StorageKeys.PRODUCTS, products);
  }

  static getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.id === id);
  }

  static getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.slug === slug);
  }

  static getCategories(): ProductCategory[] {
    return LocalStorageUtil.get<ProductCategory[]>(StorageKeys.CATEGORIES, initialCategories);
  }

  static saveCategories(categories: ProductCategory[]): boolean {
    return LocalStorageUtil.set(StorageKeys.CATEGORIES, categories);
  }

  static addProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    products.unshift(newProduct);
    this.saveProducts(products);

    // Sync to Firestore
    FirestoreService.createProduct(product).catch((err) => {
      console.warn('Firestore createProduct sync error:', err);
    });

    return newProduct;
  }

  static updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...updates };
    this.saveProducts(products);

    // Sync to Firestore
    FirestoreService.updateProduct(id, updates).catch((err) => {
      console.warn('Firestore updateProduct sync error:', err);
    });

    return products[index];
  }

  static deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (filtered.length === products.length) return false;
    this.saveProducts(filtered);

    // Sync to Firestore
    FirestoreService.deleteProduct(id).catch((err) => {
      console.warn('Firestore deleteProduct sync error:', err);
    });

    return true;
  }

  static updateStock(productId: string, newStock: number): boolean {
    return !!this.updateProduct(productId, { stockQuantity: Math.max(0, newStock) });
  }

  static getFeaturedProducts(): Product[] {
    return this.getProducts().filter((p) => p.isActive && p.isFeatured);
  }

  static getBestsellers(): Product[] {
    return this.getProducts().filter((p) => p.isActive && p.isBestseller);
  }
}
