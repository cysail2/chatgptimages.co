const normalizeReturnTo = (value: string | null) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (
    !trimmed.startsWith("/") ||
    trimmed.startsWith("//") ||
    trimmed.includes("://")
  )
    return null;
  return trimmed;
};

// 从URL参数获取transaction_id
const getTransactionIdFromUrl = (searchParams: URLSearchParams) => {
  return searchParams.get("token") || "";
};

// 发送gtag转化事件
const sendGtagConversion = (
  email: string,
  price: string,
  transactionId: string,
  retryCount: number = 0
) => {
  if (typeof window === "undefined") return;

  try {
    // 确保gtag已加载，最多重试3次
    if (!window.gtag) {
      if (retryCount < 3) {
        console.warn(`gtag not loaded yet, retrying... (${retryCount + 1}/3)`);
        setTimeout(
          () => sendGtagConversion(email, price, transactionId, retryCount + 1),
          1000
        );
      } else {
        console.error("gtag failed to load after 3 retries");
      }
      return;
    }

    // 验证并转换价格为数字
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      console.error("Invalid price value:", price);
      return;
    }

    console.log("发送gtag转化事件:", {
      email,
      price: priceValue,
      transactionId,
    });

    window.gtag("set", "user_data", { email: email });
    window.gtag("event", "conversion", {
      send_to: "AW-16699731013/XdpwCNPxhoYbEMXYhps-",
      value: parseFloat(price),
      currency: "USD",
      transaction_id: transactionId,
    });

    console.log("gtag转化事件发送成功");
  } catch (error) {
    console.error("发送gtag转化事件失败:", error);
  }
};

export { normalizeReturnTo, getTransactionIdFromUrl, sendGtagConversion };
