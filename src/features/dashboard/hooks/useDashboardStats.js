import { useState, useEffect } from "react";
import { statisticsApi } from "../services/statisticsApi";
import { doctorsApi } from "../../doctors/services/doctorsApi";
import { labsApi } from "../../labs/services/labsApi";
import { membershipApi } from "../../membership/services/membershipApi";
import { fetchActiveSubscriptions } from "../../subscription/services/subscriptionApi";
import { fetchOrders } from "../../orders/services/ordersApi";
import { adsApi } from "../../ads/services/adsApi";

export const useDashboardStats = () => {
  const [dentistsOrdersData, setDentistsOrdersData] = useState([]);
  const [labsOrdersData, setLabsOrdersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // حالة لتخزين إحصائيات البطاقات الأربعة الرئيسية
  const [kpiStats, setKpiStats] = useState({
    doctors: { total: 0, active: 0, pending: 0 },
    labs: { total: 0, active: 0, suspended: 0 },
    cases: { total: 0, inProgress: 0, waitingScanner: 0 },
    revenue: { total: 0, subscriptions: 0, ads: 0 }
  });

  useEffect(() => {
    let isMounted = true;
    const fetchStatistics = async () => {
      try {
        const [
          dentistsData,
          labsData,
          doctorsList,
          labsList,
          pendingRequests,
          activeSubscriptions,
          caseOrdersList,
          rawAds
        ] = await Promise.all([
          statisticsApi.getDentistsMonthlyOrders().catch(() => []),
          statisticsApi.getLabsMonthlyOrders().catch(() => []),
          doctorsApi.getDoctors().catch(() => ({ doctors: [] })),
          labsApi.getLabs().catch(() => []),
          membershipApi.getMembershipRequests({ type: 'all' }).catch(() => ({ data: [] })),
          fetchActiveSubscriptions().catch(() => []),
          fetchOrders().catch(() => []),
          adsApi.getAllRawAds().catch(() => [])
        ]);

        if (isMounted) {
          // 1. تنسيق إحصائيات أوردرات الأطباء والمختبرات الشهرية
          const formattedDentists = (dentistsData || []).map(d => ({
            ...d,
            displayName: `${d.dentistName} (ID: ${d.dentistId})`
          }));
          const formattedLabs = (labsData || []).map(l => ({
            ...l,
            displayName: `${l.labName} (ID: ${l.labId})`
          }));

          setDentistsOrdersData(formattedDentists);
          setLabsOrdersData(formattedLabs);

          // 2. حساب إحصائيات الأطباء
          const doctorsArray = doctorsList?.doctors || (Array.isArray(doctorsList) ? doctorsList : []);
          const docTotal = doctorsArray.length;
          const docActive = doctorsArray.filter(d => d.status === 'active' || d.status === 'approved' || d.status === 'Approved').length;
          const docPending = (pendingRequests.data || []).filter(r => r.type === 'doctor' || r.type === 'dentist').length;

          // 3. حساب إحصائيات المختبرات
          const labTotal = labsList.length;
          const labActive = activeSubscriptions.length;
          const labSuspended = Math.max(0, labTotal - labActive);

          // 4. حساب إحصائيات الحالات النشطة
          const activeCases = caseOrdersList.filter(o => o.status !== 'completed' && o.status !== 'rejected' && o.status !== 'cancelled');
          const caseTotal = activeCases.length;
          const caseInProgress = activeCases.filter(o => o.status === 'accepted' || o.status === 'ready' || o.status?.toLowerCase() === 'in-progress' || o.status?.toLowerCase() === 'inprogress').length;
          const caseWaitingScanner = activeCases.filter(o => o.status === 'pending' || o.status?.toLowerCase() === 'waiting-scanner').length;

          // 5. حساب الإيرادات من الاشتراكات والإعلانات
          const subRevenue = activeSubscriptions.reduce((sum, item) => sum + (item.amount || item.price || 0), 0);
          const activeAds = rawAds.filter(ad => ad.isActive === true || ad.status === 'active');
          const adsRevenue = activeAds.reduce((sum, ad) => sum + (ad.price || ad.cost || 0), 0);
          const totalRevenue = subRevenue + adsRevenue;

          setKpiStats({
            doctors: { total: docTotal, active: docActive, pending: docPending },
            labs: { total: labTotal, active: labActive, suspended: labSuspended },
            cases: { total: caseTotal, inProgress: caseInProgress, waitingScanner: caseWaitingScanner },
            revenue: { total: totalRevenue, subscriptions: subRevenue, ads: adsRevenue }
          });

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard statistics in hook:", error);
        if (isMounted) {
          setIsError(true);
          setIsLoading(false);
        }
      }
    };

    fetchStatistics();
    return () => {
      isMounted = false;
    };
  }, []);

  const getPeriodText = (data) => {
    if (data && data.length > 0 && data[0].year && data[0].month) {
      return `لشهر ${data[0].month} / ${data[0].year}`;
    }
    return 'لشهر 6 / 2026';
  };

  return {
    dentistsOrdersData,
    labsOrdersData,
    kpiStats,
    isLoading,
    isError,
    getPeriodText
  };
};
