import { NotebookCustomizationSelection, ShopSettings } from '../types/index.ts';

export interface PriceBreakdownResult {
  basePrice: number;
  optionsSurcharge: number;
  customPrintingFee: number;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  bulkDiscountPercent: number;
  bulkDiscountAmount: number;
  finalProductTotal: number;
}

export class PricingService {
  /**
   * Calculates dynamic price for a customized notebook based on selected options and shop settings
   */
  static calculateCustomNotebookPrice(
    basePrice: number,
    selection: Partial<NotebookCustomizationSelection>,
    quantity: number,
    settings: ShopSettings
  ): PriceBreakdownResult {
    let optionsSurcharge = 0;
    let customPrintingFee = 0;

    // Page count surcharge
    if (selection.pageCount === 160) optionsSurcharge += 80;
    if (selection.pageCount === 200) optionsSurcharge += 140;
    if (selection.pageCount === 300) optionsSurcharge += 240;

    // Paper type surcharge
    if (selection.paperType === '100 GSM Bleed-Proof') {
      optionsSurcharge += settings.pricingRules.paper100GsmSurcharge || 120;
    } else if (selection.paperType === '80 GSM Ivory Book Paper') {
      optionsSurcharge += 50;
    }

    // Binding surcharge
    if (selection.binding === 'Hardcover Bound') {
      optionsSurcharge += settings.pricingRules.hardcoverSurcharge || 150;
    } else if (selection.binding === 'Spiral Wire-O') {
      optionsSurcharge += settings.pricingRules.spiralSurcharge || 80;
    } else if (selection.binding === 'Leatherette Executive') {
      optionsSurcharge += settings.pricingRules.leatheretteSurcharge || 450;
    }

    // Cover finish surcharge
    if (selection.coverFinish === 'Gold Foil Stamping' || selection.foilStampText) {
      optionsSurcharge += settings.pricingRules.foilStampSurcharge || 250;
    } else if (selection.coverFinish === 'Velvet Matte Lamination') {
      optionsSurcharge += 60;
    } else if (selection.coverFinish === 'High Gloss Lamination') {
      optionsSurcharge += 40;
    }

    // Custom print fee if artwork or custom title provided
    if (selection.customTitle || selection.uploadedImageId || selection.uploadedImageUrl) {
      customPrintingFee += settings.pricingRules.customPrintBaseSurcharge || 180;
    }

    const unitPrice = Math.max(0, basePrice + optionsSurcharge + customPrintingFee);
    const subtotal = unitPrice * Math.max(1, quantity);

    // Check bulk discount tiers
    let bulkDiscountPercent = 0;
    if (settings.pricingRules?.bulkDiscounts) {
      const sortedTiers = [...settings.pricingRules.bulkDiscounts].sort((a, b) => b.minQty - a.minQty);
      const tier = sortedTiers.find((t) => quantity >= t.minQty);
      if (tier) {
        bulkDiscountPercent = tier.discountPercent;
      }
    }

    const bulkDiscountAmount = Math.round((subtotal * bulkDiscountPercent) / 100);
    const finalProductTotal = Math.max(0, subtotal - bulkDiscountAmount);

    return {
      basePrice,
      optionsSurcharge,
      customPrintingFee,
      unitPrice,
      quantity,
      subtotal,
      bulkDiscountPercent,
      bulkDiscountAmount,
      finalProductTotal,
    };
  }

  /**
   * Calculates delivery fee based on city and order subtotal
   */
  static calculateShippingFee(subtotal: number, city: string, settings: ShopSettings): number {
    if (settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold) {
      return 0; // Free delivery threshold met
    }

    if (!city) return settings.defaultFlatShippingFee || 220;

    const trimmedCity = city.trim();
    // Match city directly or look for partial match
    const matchingKey = Object.keys(settings.cityShippingRates || {}).find(
      (k) => k.toLowerCase() === trimmedCity.toLowerCase() || trimmedCity.toLowerCase().includes(k.toLowerCase())
    );

    if (matchingKey && settings.cityShippingRates[matchingKey] !== undefined) {
      return settings.cityShippingRates[matchingKey];
    }

    return settings.defaultFlatShippingFee || 220;
  }
}
