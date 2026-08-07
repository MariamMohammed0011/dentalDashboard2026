import axiosInstance from "../../../api/axios";

// 1. جلب فواتير الإعلانات المدفوعة
export const fetchPaidAdInvoices = async () => {
  const response = await axiosInstance.get("/Invoices/admin/advertisements/paid");
  return response.data;
};

// 2. جلب فواتير الإعلانات غير المدفوعة
export const fetchUnpaidAdInvoices = async () => {
  const response = await axiosInstance.get("/Invoices/admin/advertisements/unpaid");
  return response.data;
};
