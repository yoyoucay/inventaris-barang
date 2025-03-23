export interface PayloadProps {
    totalItems: number;
    items: Record<string, any>[];
    isEdit?: boolean;
    isUpdateStatus?: boolean;
}
