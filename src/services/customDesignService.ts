import { CustomDesignRequest, CustomDesignStatus } from '../types/index.ts';
import { LocalStorageUtil, StorageKeys } from '../utils/storage.ts';

export class CustomDesignService {
  static getRequests(): CustomDesignRequest[] {
    return LocalStorageUtil.get<CustomDesignRequest[]>(StorageKeys.DESIGN_REQUESTS, []);
  }

  static saveRequests(requests: CustomDesignRequest[]): boolean {
    return LocalStorageUtil.set(StorageKeys.DESIGN_REQUESTS, requests);
  }

  static getRequestById(id: string): CustomDesignRequest | undefined {
    return this.getRequests().find((r) => r.id === id || r.requestId === id);
  }

  static generateRequestId(): string {
    const random = Math.floor(1000 + Math.random() * 9000);
    return `CDR-${random}`;
  }

  static submitRequest(
    data: Omit<CustomDesignRequest, 'id' | 'requestId' | 'createdAt' | 'updatedAt' | 'status' | 'statusHistory'>
  ): CustomDesignRequest {
    const now = new Date().toISOString();
    const requestId = this.generateRequestId();
    const id = `req-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    const newRequest: CustomDesignRequest = {
      ...data,
      id,
      requestId,
      createdAt: now,
      updatedAt: now,
      status: 'Request Received',
      statusHistory: [
        {
          status: 'Request Received',
          timestamp: now,
          note: 'Custom design request submitted by customer',
        },
      ],
    };

    const requests = this.getRequests();
    requests.unshift(newRequest);
    this.saveRequests(requests);
    return newRequest;
  }

  static updateStatus(
    id: string,
    status: CustomDesignStatus,
    note?: string
  ): CustomDesignRequest | null {
    const requests = this.getRequests();
    const index = requests.findIndex((r) => r.id === id || r.requestId === id);
    if (index === -1) return null;

    const now = new Date().toISOString();
    requests[index].status = status;
    requests[index].updatedAt = now;
    requests[index].statusHistory.push({
      status,
      timestamp: now,
      note: note || `Status updated to ${status}`,
    });

    this.saveRequests(requests);
    return requests[index];
  }

  static provideQuotation(
    id: string,
    quotation: NonNullable<CustomDesignRequest['quotation']>
  ): CustomDesignRequest | null {
    const requests = this.getRequests();
    const index = requests.findIndex((r) => r.id === id || r.requestId === id);
    if (index === -1) return null;

    const now = new Date().toISOString();
    requests[index].quotation = quotation;
    requests[index].status = 'Quotation Sent';
    requests[index].updatedAt = now;
    requests[index].statusHistory.push({
      status: 'Quotation Sent',
      timestamp: now,
      note: `Admin issued formal quotation of Rs. ${quotation.grandTotalQuoted} (valid until ${quotation.validUntil})`,
    });

    this.saveRequests(requests);
    return requests[index];
  }

  static customerRespondToQuotation(
    id: string,
    accepted: boolean,
    feedback?: string
  ): CustomDesignRequest | null {
    const status: CustomDesignStatus = accepted ? 'Approved' : 'Revision Requested';
    return this.updateStatus(id, status, feedback);
  }
}
