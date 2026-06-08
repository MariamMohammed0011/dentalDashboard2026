import { HubConnectionBuilder, HttpTransportType, HubConnectionState } from "@microsoft/signalr";
import Cookies from "js-cookie";

let connection = null;

export const signalRService = {
  /**
   * بدء الاتصال بـ SignalR Hub
   * @param {Function} onNotificationReceived - دالة الاستدعاء الارتجاعية عند استلام إشعار جديد
   */
  startConnection: async (onNotificationReceived) => {
    if (connection && connection.state !== HubConnectionState.Disconnected) {
      console.log("[SignalR] Connection already active. State:", connection.state);
      return connection;
    }

    const token = Cookies.get("auth_token");
    
    // 🎯 التعديل الجوهري هنا: تغيير المسار ليطابق ما يطلبه السيرفر في الـ Console تماماً!
   const hubUrl = "https://localhost:44334/notificationHub"; //  المسار الصحيح
    try {
      console.log(`[SignalR] Initializing connection to correct endpoint: ${hubUrl}`);
      
      // signalRService.js

// signalRService.js

connection = new HubConnectionBuilder()
  .withUrl(hubUrl, {
    accessTokenFactory: () => {
      const token = Cookies.get("auth_token");
      console.log("[SignalR] Fetching token for connection:", token ? "Token Found" : "No Token");
      return token || "";
    },
    // 1. اجعليها false أو قومي بحذف السطر تماماً لتفعيل الـ Negotiation
    skipNegotiation: false, 
    // 2. يفضل ترك الخيارات مفتوحة ليختار المتصفح أفضل وسيلة مدعومة تلقائياً
    transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling 
  })
  .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
  .configureLogging(1) 
  .build();

      const handleIncomingNotification = (notification) => {
        console.log("[SignalR] New Live Notification received:", notification);
        if (onNotificationReceived) {
          onNotificationReceived(notification);
        }
      };

      // مسميات الميثودز الأساسية والمتوقعة من الـ Backend
      const eventNames = [
        "ReceiveNotification", 
        "SendNotification", 
        "Notification", 
        "notification"
      ];

      eventNames.forEach(event => {
        connection.on(event, handleIncomingNotification);
      });

      connection.onreconnecting((error) => {
        console.warn("[SignalR] Link lost. Attempting auto-reconnect...", error);
      });

      connection.onreconnected((connectionId) => {
        console.log("[SignalR] Link re-established. ID:", connectionId);
      });

      await connection.start();
      console.log(`[SignalR] Connected successfully. Connection State:`, connection.state);
      return connection;
    } catch (error) {
      console.error("[SignalR] Critical error while setting up webSocket:", error.message);
      connection = null;
      throw error;
    }
  },

  /**
   * إيقاف الاتصال
   */
  stopConnection: async () => {
    if (!connection) return;
    try {
      await connection.stop();
      console.log("[SignalR] Connection closed safely.");
    } catch (error) {
      console.error("[SignalR] Error while closing connection:", error);
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