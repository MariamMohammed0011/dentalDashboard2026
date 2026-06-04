import { HubConnectionBuilder, HttpTransportType, HubConnectionState } from "@microsoft/signalr";
import Cookies from "js-cookie";

let connection = null;

export const signalRService = {
  /**
   * بدء الاتصال بـ SignalR Hub مع تجربة مسارات متعددة
   * @param {Function} onNotificationReceived - الكولباك المستدعى عند وصول إشعار جديد
   */
  startConnection: async (onNotificationReceived) => {
    // التحقق من حالة الاتصال الحالية لتجنب التكرار
    if (connection && connection.state !== HubConnectionState.Disconnected) {
      console.log("[SignalR] Connection already active or starting. Current state:", connection.state);
      return connection;
    }

    const token = Cookies.get("auth_token");
    
    // قائمة بالمسارات الشائعة للـ Hub في دوت نت لتجربتها تلقائياً
    const hubUrls = [
      "https://localhost:44334/notificationHub",
      "https://localhost:44334/notifications",
      "https://localhost:44334/notificationsHub",
      "https://localhost:44334/notification",
      "https://localhost:44334/hubs/notification",
      "https://localhost:44334/hubs/notifications"
    ];

    let lastError = null;

    for (const url of hubUrls) {
      try {
        console.log(`[SignalR] Attempting to connect to: ${url}`);
        
        connection = new HubConnectionBuilder()
          .withUrl(url, {
            accessTokenFactory: () => token || "",
            skipNegotiation: false,
            transport: HttpTransportType.WebSockets
          })
          .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
          .configureLogging(1) // طباعة معلومات الاتصال والتصحيح بالكونسول
          .build();

        // دالة معالجة الإشعار المستقبل
        const handleIncomingNotification = (notification) => {
          console.log("[SignalR] New Notification received:", notification);
          if (onNotificationReceived) {
            onNotificationReceived(notification);
          }
        };

        // الاستماع لأي ميثود يرسلها الباك إند (سجلنا كل المسميات الشائعة لضمان التوافق)
        const eventNames = [
          "ReceiveNotification", 
          "SendNotification", 
          "Notification", 
          "notification",
          "ReceiveMessage", 
          "SendMessage", 
          "BroadcastNotification", 
          "NewNotification",
          "AddNotification", 
          "BlogAdded", 
          "NewPost", 
          "NewPendingPost",
          "NotificationReceived", 
          "NewBlog",
          "PostStatusChanged",
          "StatusChanged"
        ];

        eventNames.forEach(event => {
          connection.on(event, handleIncomingNotification);
        });

        // تسجيل مستمعي الأحداث لمراقبة حالة الاتصال
        connection.onreconnecting((error) => {
          console.warn("[SignalR] Connection lost. Reconnecting...", error);
        });

        connection.onreconnected((connectionId) => {
          console.log("[SignalR] Connection restored. Connection ID:", connectionId);
        });

        connection.onclose((error) => {
          console.error("[SignalR] Connection closed:", error);
        });

        await connection.start();
        console.log(`[SignalR] Connected successfully to ${url}. State:`, connection.state);
        return connection;
      } catch (error) {
        console.warn(`[SignalR] Failed to connect to ${url}. Error:`, error.message);
        lastError = error;
        connection = null; // تصفير المحاولة الفاشلة للانتقال للتالية
      }
    }

    console.error("[SignalR] All hub connection attempts failed.");
    throw lastError || new Error("Failed to connect to any SignalR Hub");
  },

  /**
   * إيقاف الاتصال
   */
  stopConnection: async () => {
    if (!connection) return;
    try {
      await connection.stop();
      console.log("[SignalR] Connection stopped.");
    } catch (error) {
      console.error("[SignalR] Error while stopping connection:", error);
    } finally {
      connection = null;
    }
  },

  /**
   * الحصول على الحالة الحالية للاتصال
   */
  getConnectionState: () => {
    return connection ? connection.state : HubConnectionState.Disconnected;
  }
};
