import { Webhook, Key, CheckCircle, ShieldAlert } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6 text-neutral-900 font-sans">
      <div className="max-w-3xl w-full bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        
        <div className="p-8 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 text-green-700 flex items-center justify-center rounded-xl">
              <Webhook className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
                WhatsApp AI Webhook
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                Meta WhatsApp Business & Gemini 2.5 Flash Lite Entegrasyonu
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          
          <section className="space-y-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-neutral-400" /> 
              Adım 1: Webhook URL'sini Meta'ya Ekleyin
            </h2>
            <div className="bg-neutral-100 p-4 rounded-xl border border-neutral-200 flex items-center justify-between">
              <code className="text-sm font-mono text-neutral-800">
                /api/webhook
              </code>
            </div>
            <p className="text-sm text-neutral-600">
              Bu URL'yi Meta Developer Portal üzerinde "Webhook" kısmındaki "Callback URL" alanına yapıştırın (Alan adınızın sonuna /api/webhook ekleyerek).
            </p>
          </section>

          <div className="h-px w-full bg-neutral-100" />

          <section className="space-y-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <Key className="w-5 h-5 text-neutral-400" /> 
              Adım 2: Çevre Değişkenleri (Environment Variables)
            </h2>
            <p className="text-sm text-neutral-600">
              Uygulamanın çalışması için aşağıdaki gizli anahtarları <strong>Ayarlar (Settings) &gt; Secrets</strong> paneline eklemeniz gerekmektedir:
            </p>
            
            <div className="grid gap-3">
              <div className="p-4 border border-neutral-200 rounded-xl bg-white flex flex-col gap-1">
                <span className="font-mono text-sm font-semibold">GEMINI_API_KEY</span>
                <span className="text-xs text-neutral-500">Google AI Studio üzerinden alacağınız API anahtarı.</span>
              </div>
              <div className="p-4 border border-neutral-200 rounded-xl bg-white flex flex-col gap-1">
                <span className="font-mono text-sm font-semibold">WHATSAPP_TOKEN</span>
                <span className="text-xs text-neutral-500">Meta Developer Portal'dan alacağınız geçici veya kalıcı sistem erişim jetonu (Access Token).</span>
              </div>
              <div className="p-4 border border-neutral-200 rounded-xl bg-white flex flex-col gap-1">
                <span className="font-mono text-sm font-semibold">WHATSAPP_PHONE_NUMBER_ID</span>
                <span className="text-xs text-neutral-500">Gönderici WhatsApp numaranızın Meta tarafından verilen ID'si.</span>
              </div>
              <div className="p-4 border border-neutral-200 rounded-xl bg-white flex flex-col gap-1">
                <span className="font-mono text-sm font-semibold">VERIFY_TOKEN</span>
                <span className="text-xs text-neutral-500">Meta Webhook kurulumu sırasında sizin belirleyeceğiniz özel doğrulama kelimesi (Örn: my_super_secret_token).</span>
              </div>
            </div>
          </section>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm leading-relaxed">
              <strong>Önemli Not:</strong> Webhook kurulumunu tamamlamak için önce projeye secret değişkenlerini tanımlamalı, ardından Meta üzerinden "Verify and Save" butonuna basmalısınız. Uygulama sizin yerinize doğrulama sürecini otomatik yönetecektir.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
