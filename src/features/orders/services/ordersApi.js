// Mock API service for orders
export const fetchOrders = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      id: "2319",
      doctor: "احمد محمد",
      lab: "هشام",
      deliveryCompany: "واصل",
      orderStatus: "جاهزة",
      deliveryStatus: "لم يتم",
      createdAt: "20/1/2023",
    },
    {
      id: "2320",
      doctor: "احمد محمد",
      lab: "هشام",
      deliveryCompany: "واصل",
      orderStatus: "جاهزة",
      deliveryStatus: "لم يتم",
      createdAt: "20/1/2023",
    },
    {
      id: "2321",
      doctor: "احمد محمد",
      lab: "هشام",
      deliveryCompany: "واصل",
      orderStatus: "جاهزة",
      deliveryStatus: "لم يتم",
      createdAt: "20/1/2023",
    },
    {
      id: "2322",
      doctor: "احمد محمد",
      lab: "هشام",
      deliveryCompany: "واصل",
      orderStatus: "جاهزة",
      deliveryStatus: "لم يتم",
      createdAt: "20/1/2023",
    },
    {
      id: "2323",
      doctor: "احمد محمد",
      lab: "هشام",
      deliveryCompany: "واصل",
      orderStatus: "جاهزة",
      deliveryStatus: "لم يتم",
      createdAt: "20/1/2023",
    },
    {
      id: "2324",
      doctor: "احمد محمد",
      lab: "هشام",
      deliveryCompany: "واصل",
      orderStatus: "جاهزة",
      deliveryStatus: "لم يتم",
      createdAt: "20/1/2023",
    },
    {
      id: "2325",
      doctor: "احمد محمد",
      lab: "هشام",
      deliveryCompany: "واصل",
      orderStatus: "جاهزة",
      deliveryStatus: "لم يتم",
      createdAt: "20/1/2023",
    },
    {
      id: "2326",
      doctor: "احمد محمد",
      lab: "هشام",
      deliveryCompany: "واصل",
      orderStatus: "جاهزة",
      deliveryStatus: "لم يتم",
      createdAt: "20/1/2023",
    },
  ];
};
