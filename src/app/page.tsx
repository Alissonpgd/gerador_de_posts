"use client";

import { useState, useRef } from "react";
import { VagaCard } from "@/components/VagaCard";
import { toPng } from "html-to-image";

export default function Home() {
  // --- ESTADOS (Memória do Sistema) ---
  const [titulo, setTitulo] = useState("Atendente de Telemarketing");
  const [empresa, setEmpresa] = useState("Gorlami Pizzaria");
  const [subtitulo, setSubtitulo] = useState("com experiência");
  const [requisitos, setRequisitos] = useState("Boa comunicação\nProatividade\nEnsino médio completo");
  const [email, setEmail] = useState("rh.conectavagas@gmail.com");
  const [cor, setCor] = useState("#660022");

  // Imagens em Base64 (Evita erros de segurança no download)
  const [logo, setLogo] = useState<string>("");
  const [foto, setFoto] = useState<string>("");

  // Referência para capturar a imagem
  const cardRef = useRef<HTMLDivElement>(null);

  // --- LÓGICA DE IMAGEM (Base64) ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'foto') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'logo') setLogo(base64String);
        else setFoto(base64String);
      };
      reader.readAsDataURL(file); // Converte o arquivo em texto (Base64)
    }
  };

  // --- LÓGICA DE DOWNLOAD ---
  const downloadImage = async () => {
    if (cardRef.current === null) return;

    try {
      // Pequeno delay para garantir que o DOM está pronto
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: false,
        pixelRatio: 2, // Imagem em alta definição
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `vaga-${empresa.toLowerCase().replace(/\s+/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
      alert("Erro técnico ao gerar PNG. Tente usar uma imagem de fundo menor ou mude o navegador.");
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-200 p-4 md:p-8 font-sans text-black">
      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto items-start">

        {/* CONFIGURAÇÃO (PAINEL ESQUERDO) */}
        <section className="w-full lg:w-[400px] bg-white p-6 rounded-2xl shadow-xl space-y-5 sticky top-8">
          <header className="border-b pb-3 mb-4">
            <h1 className="text-2xl font-black italic text-red-900 leading-none">RH CONECTA</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Gerador de Posts Profissionais</p>
          </header>

          <div className="space-y-4">
            <div className="grid gap-3">
              <div className="flex flex-col">
                <label className="text-[10px] font-black uppercase text-gray-400 mb-1">Cargo / Vaga</label>
                <input className="border-2 p-2 rounded-lg outline-none focus:border-red-800 text-sm" value={titulo} onChange={e => setTitulo(e.target.value)} />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-black uppercase text-gray-400 mb-1">Nome da Empresa</label>
                <input className="border-2 p-2 rounded-lg outline-none focus:border-red-800 text-sm" value={empresa} onChange={e => setEmpresa(e.target.value)} />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-black uppercase text-gray-400 mb-1">Subtítulo</label>
                <input className="border-2 p-2 rounded-lg outline-none focus:border-red-800 text-sm" value={subtitulo} onChange={e => setSubtitulo(e.target.value)} />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-black uppercase text-gray-400 mb-1">Email de Contato</label>
                <input className="border-2 p-2 rounded-lg outline-none focus:border-red-800 text-sm font-bold" value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-black uppercase text-gray-400 mb-1">Requisitos</label>
                <textarea className="border-2 p-2 rounded-lg outline-none focus:border-red-800 h-20 text-sm" value={requisitos} onChange={e => setRequisitos(e.target.value)} />
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl space-y-3">
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <label className="font-bold uppercase text-gray-400 block mb-1">Logo</label>
                  <input type="file" accept="image/*" onChange={e => handleImageChange(e, 'logo')} className="w-full" />
                </div>
                <div>
                  <label className="font-bold uppercase text-gray-400 block mb-1">Fundo</label>
                  <input type="file" accept="image/*" onChange={e => handleImageChange(e, 'foto')} className="w-full" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Cor Principal</label>
                <input type="color" value={cor} onChange={e => setCor(e.target.value)} className="w-full h-8 cursor-pointer rounded" />
              </div>
            </div>
          </div>
        </section>

        {/* PREVIEW E DOWNLOAD (PAINEL DIREITO) */}
        <section className="flex-1 flex flex-col items-center">
          <div className="mb-4">
            <span className="bg-white px-4 py-1 rounded-full text-[10px] font-bold text-gray-400 uppercase tracking-widest shadow-sm">Preview do Post</span>
          </div>

          {/* O Card que será baixado */}
          <div ref={cardRef} className="bg-white shadow-2xl rounded-sm">
            <VagaCard
              titulo={titulo}
              nomeEmpresa={empresa}
              subtitulo={subtitulo}
              requisitos={requisitos.split("\n").filter(r => r !== "")}
              emailContato={email}
              logoUrl={logo}
              imagemUrl={foto}
              corPrincipal={cor}
            />
          </div>

          <button
            onClick={downloadImage}
            className="mt-8 bg-red-900 hover:bg-red-800 text-white px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Baixar Post (PNG)
          </button>
          <p className="mt-3 text-[10px] text-gray-500 font-bold uppercase tracking-tighter italic">Formato ideal para Instagram e WhatsApp</p>
        </section>

      </div>
    </div>
  );
}