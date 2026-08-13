import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Webhook Doğrulama (Meta tarafından webhook kurulumunda gönderilir)
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Verify_token kontrolü
  if (mode && token) {
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("WEBHOOK DOĞRULANDI!");
      return new NextResponse(challenge, { status: 200 });
    } else {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return new NextResponse("Bad Request", { status: 400 });
}

// Gelen WhatsApp mesajlarını işleme
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Sadece WhatsApp Business mesajlarını kabul et
    if (body.object === "whatsapp_business_account") {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const message = value?.messages?.[0];

      // Gelen event bir metin mesajıysa işle
      if (message && message.type === "text") {
        const from = message.from; // Müşterinin telefon numarası
        const messageText = message.text.body; // Gelen mesaj içeriği

        console.log(`[${from}] numarasından mesaj alındı: ${messageText}`);

        // 1. Gemini AI ile yanıt oluştur (gemini-2.5-flash-lite)
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error("GEMINI_API_KEY eksik!");
        }

        const ai = new GoogleGenAI({ apiKey });
        
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash", // İstenilen model
          contents: messageText,
        });
        
        const aiReply = response.text || "Üzgünüm, şu an bir yanıt üretemiyorum.";

        // 2. Meta Graph API ile müşteriye geri gönder
        const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
        const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

        if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID) {
          throw new Error("WhatsApp kimlik bilgileri eksik (WHATSAPP_TOKEN veya WHATSAPP_PHONE_NUMBER_ID)!");
        }

        const metaResponse = await fetch(
          `https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              recipient_type: "individual",
              to: from,
              type: "text",
              text: {
                preview_url: false,
                body: aiReply,
              },
            }),
          }
        );

        if (!metaResponse.ok) {
          const errorData = await metaResponse.text();
          console.error("Meta Graph API Hatası:", errorData);
        } else {
          console.log(`Yanıt başarıyla [${from}] numarasına gönderildi.`);
        }
      }

      // Meta'ya isteğin başarıyla alındığını bildir (Bunu yapmazsak Meta tekrar tekrar istek atar)
      return new NextResponse("EVENT_RECEIVED", { status: 200 });
    } else {
      return new NextResponse("Not Found", { status: 404 });
    }
  } catch (error) {
    console.error("Webhook İşleme Hatası:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
