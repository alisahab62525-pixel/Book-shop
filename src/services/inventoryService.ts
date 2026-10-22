import { InventoryMovement } from '../types/index.ts';
import { LocalStorageUtil, StorageKeys } from '../utils/storage.ts';

export class InventoryService {
  static getMovements(): InventoryMovement[] {
    return LocalStorageUtil.get<InventoryMovement[]>(StorageKeys.INVENTORY_MOVEMENTS, []);
  }

  static saveMovements(movements: InventoryMovement[]): boolean {
    return LocalStorageUtil.set(StorageKeys.INVENTORY_MOVEMENTS, movements);
  }

  static recordMovement(data: Omit<InventoryMovement, 'id' | 'date'>): InventoryMovement {
    const movements = this.getMovements();
    const movement: InventoryMovement = {
      ...data,
      id: `mov-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toISOString(),
    };
    movements.unshift(movement);
    this.saveMovements(movements);
    return movement;
  }
}
