import { useState, useEffect } from "react";
import { statisticsApi } from "../services/statisticsApi";
import { doctorsApi } from "../../doctors/services/doctorsApi";
import { labsApi } from "../../labs/services/labsApi";
import { membershipApi } from "../../membership/services/membershipApi";
import { fetchActiveSubscriptions } from "../../subscription/services/subscriptionApi";
import { fetchOrders } from "../../orders/services/ordersApi";
import { adsApi } from "../../ads/services/adsApi";

const monthNamesMap = {
  Jan: "يناير",
  Feb: "فبراير",
  Mar: "مارس",
  Apr: "أبريل",
  May: "مايو",
  Jun: "يونيو",
  Jul: "يوليو",
  Aug: "أغسطس",
  Sep: "سبتمبر",
  Oct: "أكتوبر",
  Nov: "نوفمبر",
  Dec: "ديسمبر"
};

const statusTranslationMap = {
  Pennding: "قيد الانتظار",
  Pending: "قيد الانتظار",
  Accepted: "مقبولة",
  RequestInfo: "طلب معلومات",
  InDesign: "قيد التصميم",
  InProduction: "قيد الإنتاج",
  InColoring: "قيد التلوين",
  Ready: "جاهزة",
  Delivered: "تم التسليم",
  WaitingForClarification: "بانتظار توضيح",
  Cancelled: "ملغاة"
};

// خريطة ترجمة مواد التعويضات
const compensationTypeMap = {
  Zircon: "زيركون",
  Veneer: "فينير (عدسات)",
  Crystal: "كريستال",
  Porcelain: "بورسلين",
  PFM: "بورسلين على معدن",
  Emax: "إيماكس",
  Acrylic: "أكريليك"
};

// دالة مساعدة لضمان استخراج مصفوفة آمنة من أي استجابة API
const ensureArray = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.subscriptions)) return data.subscriptions;
  if (data && Array.isArray(data.orders)) return data.orders;
  if (data && Array.isArray(data.ads)) return data.ads;
  if (data && Array.isArray(data.doctors)) return data.doctors;
  if (data && Array.isArray(data.labs)) return data.labs;
  return [];
};

export const useDashboardStats = () => {
  const [dentistsOrdersData, setDentistsOrdersData] = useState([]);
  const [labsOrdersData, setLabsOrdersData] = useState([]);
  const [financialGrowthData, setFinancialGrowthData] = useState([]);
  const [ratingsChartData, setRatingsChartData] = useState([]);
  const [compensationsChartData, setCompensationsChartData] = useState([]);
  const [statusChartData, setStatusChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

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
        const currentYear = new Date().getFullYear();
        const [
          dentistsRes,
          labsRes,
          doctorsRes,
          labsListRes,
          pendingRequestsRes,
          activeSubscriptionsRes,
          caseOrdersRes,
          rawAdsRes,
          financialGrowthRes,
          ratingsRes,
          compensationsRes,
          statusRes
        ] = await Promise.all([
          statisticsApi.getDentistsMonthlyOrders().catch(() => []),
          statisticsApi.getLabsMonthlyOrders().catch(() => []),
          doctorsApi.getDoctors().catch(() => ({ doctors: [] })),
          labsApi.getLabs().catch(() => []),
          membershipApi.getMembershipRequests({ type: 'all' }).catch(() => ({ data: [] })),
          fetchActiveSubscriptions().catch(() => []),
          fetchOrders().catch(() => []),
          adsApi.getAllRawAds().catch(() => []),
          statisticsApi.getFinancialGrowth(currentYear).catch(() => null),
          statisticsApi.getRatingsChartData().catch(() => null),
          statisticsApi.getCompensationsChart().catch(() => null),
          statisticsApi.getStatusChart().catch(() => null)
        ]);

        if (isMounted) {
          // 💡 حماية وتأمين تحويل البيانات إلى المصفوفات
          const dentistsData = ensureArray(dentistsRes);
          const labsData = ensureArray(labsRes);
          const doctorsArray = ensureArray(doctorsRes);
          const labsList = ensureArray(labsListRes);
          const pendingRequests = ensureArray(pendingRequestsRes);
          const activeSubscriptions = ensureArray(activeSubscriptionsRes);
          const caseOrdersList = ensureArray(caseOrdersRes);
          const rawAds = ensureArray(rawAdsRes);

          // 1. تنسيق إحصائيات أوردرات الأطباء والمختبرات الشهرية
          const formattedDentists = dentistsData.map((d, index) => {
            const countSameName = dentistsData.filter(x => x.dentistName && x.dentistName === d.dentistName).length;
            const name = d.dentistName || `طبيب #${d.dentistId || d.id || index + 1}`;
            return {
              ...d,
              displayName: countSameName > 1 ? `${name} (#${d.dentistId || d.id || index + 1})` : name
            };
          });

          const formattedLabs = labsData.map((l, index) => {
            const countSameName = labsData.filter(x => x.labName && x.labName === l.labName).length;
            const name = l.labName || `مخبر #${l.labId || l.id || index + 1}`;
            return {
              ...l,
              displayName: countSameName > 1 ? `${name} (#${l.labId || l.id || index + 1})` : name
            };
          });

          setDentistsOrdersData(formattedDentists);
          setLabsOrdersData(formattedLabs);

          // 2. معالجة بيانات النمو المالي
          const rawGrowthData = ensureArray(financialGrowthRes);
          const formattedRevenue = [];
          let growthTotalAds = 0;
          let growthTotalOrders = 0;

          rawGrowthData.forEach(item => {
            const mName = monthNamesMap[item.monthName] || item.monthName || `شهر ${item.month}`;
            growthTotalAds += item.adsRevenue || 0;
            growthTotalOrders += item.ordersRevenue || 0;

            formattedRevenue.push({
              month: mName,
              type: "عوائد الإعلانات ($)",
              value: item.adsRevenue || 0
            });
            formattedRevenue.push({
              month: mName,
              type: "أرباح الطلبيات ($)",
              value: item.ordersRevenue || 0
            });
          });
          setFinancialGrowthData(formattedRevenue);

          // 3. معالجة تقييم أداء المخابر
          const rawRatings = ensureArray(ratingsRes);
          const formattedRatings = [];
          rawRatings.forEach(item => {
            const name = item.labName || `مخبر ${item.labId}`;
            formattedRatings.push({
              lab: name,
              metric: "التقييم العام",
              value: item.averageOverallRating || 0
            });
            formattedRatings.push({
              lab: name,
              metric: "تقييم الجودة",
              value: item.averageQualityRating || 0
            });
            formattedRatings.push({
              lab: name,
              metric: "الالتزام بالوقت",
              value: item.averageTimeCommitmentRating || 0
            });
          });
          setRatingsChartData(formattedRatings);

          // 4. معالجة اتجاهات مواد التعويضات (Compensations Chart)
          const rawCompensations = Array.isArray(compensationsRes?.data)
            ? compensationsRes.data
            : ensureArray(compensationsRes);

          const formattedCompensations = rawCompensations.map(item => {
            const rawType = item.compensationType || "غير محدد";
            return {
              material: compensationTypeMap[rawType] || rawType,
              count: item.requestCount || 0,
              totalTeethCount: item.totalTeethCount || 0
            };
          });
          setCompensationsChartData(formattedCompensations);

          // 5. معالجة حالات الطلبيات
          const rawStatusData = ensureArray(statusRes);
          const activeStatusItems = rawStatusData.filter(item => (item.orderCount || 0) > 0);
          const statusListToUse = activeStatusItems.length > 0 ? activeStatusItems : rawStatusData;
          const formattedStatus = statusListToUse.map(item => {
            const rawKey = item.statusName || item.status || '';
            return {
              type: statusTranslationMap[rawKey] || rawKey,
              value: item.orderCount || 0,
              rawStatus: rawKey
            };
          });
          setStatusChartData(formattedStatus);

          // 6. حساب إحصائيات الأطباء
          const docTotal = typeof doctorsRes?.count === 'number' ? doctorsRes.count : doctorsArray.length;
          const docActive = doctorsArray.filter(d => {
            const st = String(d.status ?? '').toLowerCase().trim();
            return st === 'active' || st === 'approved' || st === '2';
          }).length;
          
          const docPendingInDoctors = doctorsArray.filter(d => {
            const st = String(d.status ?? '').toLowerCase().trim();
            return st === 'pendingadminapproval' || 
                   st === 'pending_admin_approval' || 
                   st === 'pending' || 
                   st === 'pendingverification' || 
                   st === 'pending_verification' || 
                   st === '1' || 
                   st === '0';
          }).length;
          
          const docPendingInRequests = pendingRequests.filter(r => r.type === 'doctor' || r.type === 'dentist').length;
          const docPending = docPendingInDoctors > 0 ? docPendingInDoctors : docPendingInRequests;

          // 7. حساب إحصائيات المختبرات
          const labTotal = typeof labsListRes?.count === 'number' ? labsListRes.count : labsList.length;
          const labActive = activeSubscriptions.length > 0 
            ? activeSubscriptions.length 
            : labsList.filter(l => {
                const st = String(l.status ?? '').toLowerCase().trim();
                return st === 'active' || st === 'approved' || st === '2';
              }).length;
          const labSuspended = Math.max(0, labTotal - labActive);

          // 8. حساب إحصائيات الحالات النشطة (بناءً على الـ Enums الرسمية للنظام)
          const activeCases = caseOrdersList.filter(o => {
            const st = String(o.status ?? '').toLowerCase().trim();
            return st !== 'delivered' && st !== 'cancelled';
          });
          const caseTotal = activeCases.length;
          const caseInProgress = activeCases.filter(o => {
            const st = String(o.status ?? '').toLowerCase().trim();
            return st === 'accepted' || st === 'indesign' || st === 'inproduction' || st === 'incoloring' || st === 'ready';
          }).length;
          const caseWaitingScanner = activeCases.filter(o => {
            const st = String(o.status ?? '').toLowerCase().trim();
            return st === 'pennding' || st === 'pending' || st === 'requestinfo' || st === 'waitingforclarification';
          }).length;

          // 9. حساب الإيرادات الآمن باستخدام ensureArray
          const subRevenue = activeSubscriptions.reduce((sum, item) => sum + Number(item.amount || item.price || 0), 0);
          const activeAds = rawAds.filter(ad => ad.isActive === true || String(ad.status).toLowerCase() === 'active');
          const adsRevenue = activeAds.reduce((sum, ad) => sum + Number(ad.price || ad.cost || 0), 0);
          
          const finalAdsRevenue = growthTotalAds > 0 ? growthTotalAds : adsRevenue;
          const finalSubRevenue = growthTotalOrders > 0 ? growthTotalOrders : subRevenue;
          const finalTotalRevenue = finalAdsRevenue + finalSubRevenue;

          setKpiStats({
            doctors: { total: docTotal, active: docActive, pending: docPending },
            labs: { total: labTotal, active: labActive, suspended: labSuspended },
            cases: { total: caseTotal, inProgress: caseInProgress, waitingScanner: caseWaitingScanner },
            revenue: { total: finalTotalRevenue, subscriptions: finalSubRevenue, ads: finalAdsRevenue }
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
    return 'لشهر الحالي';
  };

  return {
    dentistsOrdersData,
    labsOrdersData,
    financialGrowthData,
    ratingsChartData,
    compensationsChartData,
    statusChartData,
    kpiStats,
    isLoading,
    isError,
    getPeriodText
  };
};