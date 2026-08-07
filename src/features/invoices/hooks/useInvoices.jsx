import { useState, useEffect, useMemo } from 'react';
import { fetchPaidAdInvoices, fetchUnpaidAdInvoices } from '../services/invoicesApi';
import { toast } from 'sonner';

export const useInvoices = () => {
  const [activeTab, setActiveTab] = useState('paid'); // 'paid' | 'unpaid' | 'all'
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all' | 'dentists' | 'labs' | 'adsClients'
  const [searchQuery, setSearchQuery] = useState('');
  
  const [paidData, setPaidData] = useState({ dentists: [], labs: [], adsClients: [] });
  const [unpaidData, setUnpaidData] = useState({ dentists: [], labs: [], adsClients: [] });
  const [loading, setLoading] = useState(true);

  // Modal State
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const [paidRes, unpaidRes] = await Promise.all([
        fetchPaidAdInvoices().catch(err => {
          console.error("Error fetching paid invoices:", err);
          return { data: {} };
        }),
        fetchUnpaidAdInvoices().catch(err => {
          console.error("Error fetching unpaid invoices:", err);
          return { data: {} };
        })
      ]);

      const paid = paidRes?.data || {};
      const unpaid = unpaidRes?.data || {};

      setPaidData({
        dentists: Array.isArray(paid.dentists) ? paid.dentists : [],
        labs: Array.isArray(paid.labs) ? paid.labs : [],
        adsClients: Array.isArray(paid.adsClients) ? paid.adsClients : []
      });

      setUnpaidData({
        dentists: Array.isArray(unpaid.dentists) ? unpaid.dentists : [],
        labs: Array.isArray(unpaid.labs) ? unpaid.labs : [],
        adsClients: Array.isArray(unpaid.adsClients) ? unpaid.adsClients : []
      });

    } catch (error) {
      console.error("Failed to load invoices", error);
      toast.error("حدث خطأ أثناء تحميل الفواتير");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  // دمج وتحويل الفواتير لقائمة موحدة
  const allPaidInvoices = useMemo(() => {
    const list = [];
    (paidData.dentists || []).forEach(item => list.push({ ...item, category: 'dentists', categoryLabel: 'طبيب أسنان', isPaidStatus: true }));
    (paidData.labs || []).forEach(item => list.push({ ...item, category: 'labs', categoryLabel: 'مخبر أسنان', isPaidStatus: true }));
    (paidData.adsClients || []).forEach(item => list.push({ ...item, category: 'adsClients', categoryLabel: 'عميل إعلانات', isPaidStatus: true }));
    return list;
  }, [paidData]);

  const allUnpaidInvoices = useMemo(() => {
    const list = [];
    (unpaidData.dentists || []).forEach(item => list.push({ ...item, category: 'dentists', categoryLabel: 'طبيب أسنان', isPaidStatus: false }));
    (unpaidData.labs || []).forEach(item => list.push({ ...item, category: 'labs', categoryLabel: 'مخبر أسنان', isPaidStatus: false }));
    (unpaidData.adsClients || []).forEach(item => list.push({ ...item, category: 'adsClients', categoryLabel: 'عميل إعلانات', isPaidStatus: false }));
    return list;
  }, [unpaidData]);

  // إحصائيات المبالغ والأعداد
  const totalPaidRevenue = useMemo(() => {
    return allPaidInvoices.reduce((sum, inv) => sum + (Number(inv.price) || 0), 0);
  }, [allPaidInvoices]);

  const totalUnpaidAmount = useMemo(() => {
    return allUnpaidInvoices.reduce((sum, inv) => sum + (Number(inv.price) || 0), 0);
  }, [allUnpaidInvoices]);

  // التصفية حسب التبويب والمستخدم وجملة البحث
  const filteredInvoices = useMemo(() => {
    let sourceList = [];
    if (activeTab === 'paid') {
      sourceList = allPaidInvoices;
    } else if (activeTab === 'unpaid') {
      sourceList = allUnpaidInvoices;
    } else {
      sourceList = [...allPaidInvoices, ...allUnpaidInvoices];
    }

    return sourceList.filter(inv => {
      // تصفية الفئة (أطباء / مخابر / عملاء)
      if (selectedCategory !== 'all' && inv.category !== selectedCategory) {
        return false;
      }

      // تصفية نص البحث
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const idMatch = String(inv.id || '').includes(q);
      const nameMatch = String(inv.userName || '').toLowerCase().includes(q);
      const placeMatch = String(inv.namePlace || '').toLowerCase().includes(q);
      const emailMatch = String(inv.userEmail || '').toLowerCase().includes(q);
      const titleMatch = String(inv.title || '').toLowerCase().includes(q);
      return idMatch || nameMatch || placeMatch || emailMatch || titleMatch;
    });
  }, [activeTab, selectedCategory, searchQuery, allPaidInvoices, allUnpaidInvoices]);

  const handleOpenDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

  return {
    invoices: filteredInvoices,
    loading,
    activeTab,
    setActiveTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    totalPaidRevenue,
    totalUnpaidAmount,
    paidCount: allPaidInvoices.length,
    unpaidCount: allUnpaidInvoices.length,
    selectedInvoice,
    modalOpen,
    setModalOpen,
    handleOpenDetails,
    refreshInvoices: loadInvoices
  };
};
