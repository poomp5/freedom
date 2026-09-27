const SLIPOK_API_URL = "https://suba.rdcw.co.th/v2/inquiry";

function getAuthHeader(): string {
  const clientId = process.env.SLIPOK_CLIENT_ID;
  const clientSecret = process.env.SLIPOK_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("SlipOK credentials not configured");
  }
  return `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`;
}

export interface SlipVerificationResult {
  success: boolean;
  data?: {
    transRef: string;
    sendingBank: string;
    receivingBank: string;
    amount: number;
    transDate: string;
    sender?: { displayName?: string; name?: string };
    receiver?: { displayName?: string; name?: string };
  };
  error?: string;
}

export async function verifySlipByImage(
  imageBuffer: Buffer,
  contentType: string
): Promise<SlipVerificationResult> {
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(imageBuffer)], { type: contentType });
  formData.append("file", blob, "slip.jpg");

  const res = await fetch(SLIPOK_API_URL, {
    method: "POST",
    headers: { Authorization: getAuthHeader() },
    body: formData,
  });

  const json = await res.json();

  if (!res.ok || json.code !== 200) {
    return {
      success: false,
      error: json.message || "Slip verification failed",
    };
  }

  return { success: true, data: json.data };
}

export async function verifySlipByPayload(
  payload: string
): Promise<SlipVerificationResult> {
  const res = await fetch(SLIPOK_API_URL, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
  });

  const json = await res.json();

  if (!res.ok || json.code !== 200) {
    return {
      success: false,
      error: json.message || "Slip verification failed",
    };
  }

  return { success: true, data: json.data };
}
