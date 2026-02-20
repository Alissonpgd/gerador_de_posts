"use client";

import { useState, useRef, useEffect } from "react";
import { VagaCard } from "@/components/VagaCard";
import { SocialCard } from "@/components/SocialCard";
import { toPng } from "html-to-image";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

const bancoFrases = {
  "Bom dia": ["Que seu dia seja produtivo!", "O sucesso é o que você faz hoje.", "Café na mão e foco na missão.", "Hoje coisas boas vão acontecer."],
  "Boa tarde": ["Mantenha o foco!", "Pausa para o café.", "Respire fundo e siga em frente.", "O otimismo é o imã de coisas boas."],
  "Boa noite": ["Descanse a mente.", "Missão cumprida.", "Amanhã temos novos sonhos.", "Gratidão pelo dia que passou."]
};

const opcoesFontes = [
  { name: "Montserrat", value: "Montserrat" },
  { name: "Playfair Display", value: "Playfair Display" },
  { name: "Bebas Neue", value: "Bebas Neue" },
  { name: "Caveat", value: "Caveat" },
  { name: "Pacifico", value: "Pacifico" },
  { name: "Anton", value: "Anton" },
  { name: "Dancing Script", value: "Dancing Script" },
  { name: "Satisfy", value: "Satisfy" },
  { name: "Amatic SC", value: "Amatic SC" },
  { name: "Roboto", value: "Roboto" },
  { name: "Oswald", value: "Oswald" }
];

export default function Home() {
  const [modo, setModo] = useState<'manual' | 'social'>('manual');

  // --- MODO MANUAL (INTACTO) ---
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [logoManual, setLogoManual] = useState("");
  const [fotoManual, setFotoManual] = useState("");

  // --- MODO SOCIAL ---
  const [saudacao, setSaudacao] = useState<keyof typeof bancoFrases>("Bom dia");
  const [fraseSocial, setFraseSocial] = useState(bancoFrases["Bom dia"][0]);

  // Estados Título (Saudação)
  const [fonteSaudacao, setFonteSaudacao] = useState("Montserrat");
  const [corFonteS, setCorFonteS] = useState("#FFFFFF");
  const [tamS, setTamS] = useState(20);
  const [xS, setXS] = useState(0);
  const [yS, setYS] = useState(0);
  const [fundoS, setFundoS] = useState(true);
  const [sombraS, setSombraS] = useState({ x: 2, y: 2, blur: 4, cor: "#000000", ativa: false });

  // Estados Frase
  const [fonteFrase, setFonteFrase] = useState("Montserrat");
  const [corFonteF, setCorFonteF] = useState("#1a1a1a");
  const [tamF, setTamF] = useState(45);
  const [xF, setXF] = useState(0);
  const [yF, setYF] = useState(0);
  const [sombraF, setSombraF] = useState({ x: 2, y: 2, blur: 8, cor: "#000000", ativa: false });

  // Fundo
  const [fotoSocial, setFotoSocial] = useState("");
  const [opacidadeS, setOpacidadeS] = useState(0.2);
  const [blurS, setBlurS] = useState(0);

  const [cor, setCor] = useState("#660022");
  const [vagasSalvas, setVagasSalvas] = useState<any[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const buscar = async () => {
      const q = query(collection(db, "vagas"), orderBy("criadoEm", "desc"));
      const snap = await getDocs(q);
      setVagasSalvas(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    buscar();
  }, []);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, target: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        if (target === 'logo') setLogoManual(b64);
        else if (target === 'foto') setFotoManual(b64);
        else if (target === 'fotoSocial') setFotoSocial(b64);
      };
      reader.readAsDataURL(file);
    }
  };

  const download = async () => {
    if (cardRef.current) {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const link = document.createElement('a');
      link.download = `rh-conecta.png`; link.href = dataUrl; link.click();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-black">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        <div className="flex bg-white p-1 rounded-2xl shadow-xl max-w-sm mx-auto border">
          <button onClick={() => setModo('manual')} className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${modo === 'manual' ? 'bg-red-900 text-white shadow-lg' : 'text-gray-400'}`}>✍️ Vagas</button>
          <button onClick={() => setModo('social')} className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase transition-all ${modo === 'social' ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-400'}`}>☀️ Saudações</button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <section className="w-full lg:w-[420px] bg-white p-6 rounded-2xl shadow-xl space-y-5 border overflow-y-auto max-h-[85vh]">
            <h1 className="text-2xl font-black italic text-red-900 uppercase">RH CONECTA VAGAS</h1>

            {modo === 'manual' ? (
              <div className="space-y-4 animate-in fade-in">
                <input placeholder="Cargo" className="w-full border-2 p-2 rounded-lg text-sm outline-none" value={titulo} onChange={e => setTitulo(e.target.value)} />
                <input placeholder="Subtitulo" className="w-full border-2 p-2 rounded-lg text-sm outline-none" value={subtitulo} onChange={e => setSubtitulo(e.target.value)} />
                <input placeholder="Empresa" className="w-full border-2 p-2 rounded-lg text-sm outline-none" value={empresa} onChange={e => setEmpresa(e.target.value)} />
                <input placeholder="Email" className="w-full border-2 p-2 rounded-lg text-sm outline-none" value={email} onChange={e => setEmail(e.target.value)} />
                <textarea placeholder="Requisitos" className="w-full border-2 p-2 rounded-lg h-24 text-sm outline-none" value={requisitos} onChange={e => setRequisitos(e.target.value)} />
                <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-400 uppercase">
                  <label className="border-2 border-dashed h-16 rounded-lg flex items-center justify-center cursor-pointer">{logoManual ? "Logo OK" : "Logo"}<input type="file" className="hidden" onChange={e => handleImage(e, 'logo')} /></label>
                  <label className="border-2 border-dashed h-16 rounded-lg flex items-center justify-center cursor-pointer">{fotoManual ? "Fundo OK" : "Fundo"}<input type="file" className="hidden" onChange={e => handleImage(e, 'foto')} /></label>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-4">
                {/* FUNDO */}
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 space-y-2">
                  <label className="border-2 border-dashed h-12 rounded-lg flex items-center justify-center cursor-pointer bg-white text-[9px] font-black uppercase text-orange-400">
                    {fotoSocial ? "IMAGEM OK" : "📸 Foto de Fundo"}
                    <input type="file" className="hidden" onChange={e => handleImage(e, 'fotoSocial')} />
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-[8px] font-black uppercase text-orange-600">
                    <div>OPAC<input type="range" min="0" max="1" step="0.1" value={opacidadeS} onChange={e => setOpacidadeS(Number(e.target.value))} className="w-full" /></div>
                    <div>BLUR<input type="range" min="0" max="10" step="1" value={blurS} onChange={e => setBlurS(Number(e.target.value))} className="w-full" /></div>
                  </div>
                </div>

                {/* CONTROLES TÍTULO */}
                <div className="p-3 bg-white rounded-xl border border-zinc-200 space-y-3 shadow-sm">
                  <div className="flex gap-2">
                    <select value={saudacao} onChange={e => setSaudacao(e.target.value as any)} className="flex-1 p-1 border rounded text-xs outline-none"><option value="Bom dia">Bom dia</option><option value="Boa tarde">Boa tarde</option><option value="Boa noite">Boa noite</option></select>
                    <button onClick={() => setFundoS(!fundoS)} className={`px-2 py-1 rounded text-[8px] font-black ${fundoS ? 'bg-orange-500 text-white' : 'bg-zinc-100'}`}>FUNDO</button>
                    <button onClick={() => setSombraS({ ...sombraS, ativa: !sombraS.ativa })} className={`px-2 py-1 rounded text-[8px] font-black ${sombraS.ativa ? 'bg-indigo-500 text-white' : 'bg-zinc-100'}`}>SOMBRA</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select value={fonteSaudacao} onChange={e => setFonteSaudacao(e.target.value)} className="p-1 border rounded text-xs">{opcoesFontes.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}</select>
                    <input type="color" value={corFonteS} onChange={e => setCorFonteS(e.target.value)} className="w-full h-8 cursor-pointer rounded bg-transparent" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[8px] font-bold uppercase text-zinc-400">
                    <div>TAM<input type="range" min="10" max="80" value={tamS} onChange={e => setTamS(Number(e.target.value))} className="w-full h-1" /></div>
                    <div>X<input type="range" min="-150" max="150" value={xS} onChange={e => setXS(Number(e.target.value))} className="w-full h-1" /></div>
                    <div>Y<input type="range" min="-100" max="150" value={yS} onChange={e => setYS(Number(e.target.value))} className="w-full h-1" /></div>
                  </div>
                  {sombraS.ativa && (
                    <div className="p-2 bg-indigo-50 rounded-lg space-y-2 border border-indigo-100">
                      <div className="grid grid-cols-3 gap-2 text-[7px] font-black text-indigo-400">
                        <div>S-X<input type="range" min="-20" max="20" value={sombraS.x} onChange={e => setSombraS({ ...sombraS, x: Number(e.target.value) })} className="w-full h-1" /></div>
                        <div>S-Y<input type="range" min="-20" max="20" value={sombraS.y} onChange={e => setSombraS({ ...sombraS, y: Number(e.target.value) })} className="w-full h-1" /></div>
                        <div>BLUR<input type="range" min="0" max="30" value={sombraS.blur} onChange={e => setSombraS({ ...sombraS, blur: Number(e.target.value) })} className="w-full h-1" /></div>
                      </div>
                      <input type="color" value={sombraS.cor} onChange={e => setSombraS({ ...sombraS, cor: e.target.value })} className="w-full h-4 cursor-pointer rounded" />
                    </div>
                  )}
                </div>

                {/* CONTROLES FRASE */}
                <div className="p-3 bg-white rounded-xl border border-zinc-200 space-y-3 shadow-sm">
                  <div className="flex gap-2">
                    <select value={fonteFrase} onChange={e => setFonteFrase(e.target.value)} className="flex-1 p-1 border rounded text-xs">{opcoesFontes.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}</select>
                    <button onClick={() => setSombraF({ ...sombraF, ativa: !sombraF.ativa })} className={`px-2 py-1 rounded text-[8px] font-black ${sombraF.ativa ? 'bg-indigo-500 text-white' : 'bg-zinc-100'}`}>SOMBRA</button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col"><label className="text-[7px] font-bold text-zinc-400">COR TEXTO</label><input type="color" value={corFonteF} onChange={e => setCorFonteF(e.target.value)} className="w-full h-8 cursor-pointer rounded bg-transparent" /></div>
                    {sombraF.ativa && <div className="flex flex-col"><label className="text-[7px] font-bold text-indigo-400 uppercase">COR SOMBRA</label><input type="color" value={sombraF.cor} onChange={e => setSombraF({ ...sombraF, cor: e.target.value })} className="w-full h-8 cursor-pointer rounded bg-transparent" /></div>}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[8px] font-bold uppercase text-zinc-400">
                    <div>TAM<input type="range" min="20" max="100" value={tamF} onChange={e => setTamF(Number(e.target.value))} className="w-full h-1" /></div>
                    <div>X<input type="range" min="-200" max="200" value={xF} onChange={e => setXF(Number(e.target.value))} className="w-full h-1" /></div>
                    <div>Y<input type="range" min="-100" max="300" value={yF} onChange={e => setYF(Number(e.target.value))} className="w-full h-1" /></div>
                  </div>
                  {sombraF.ativa && (
                    <div className="grid grid-cols-3 gap-2 p-2 bg-indigo-50 rounded-lg">
                      <div>SX<input type="range" min="-30" max="30" value={sombraF.x} onChange={e => setSombraF({ ...sombraF, x: Number(e.target.value) })} className="w-full h-1" /></div>
                      <div>SY<input type="range" min="-30" max="30" value={sombraF.y} onChange={e => setSombraF({ ...sombraF, y: Number(e.target.value) })} className="w-full h-1" /></div>
                      <div>BLUR<input type="range" min="0" max="40" value={sombraF.blur} onChange={e => setSombraF({ ...sombraF, blur: Number(e.target.value) })} className="w-full h-1" /></div>
                    </div>
                  )}
                  <textarea value={fraseSocial} onChange={e => setFraseSocial(e.target.value)} className="w-full border rounded p-2 text-xs h-16 outline-none" />
                </div>
              </div>
            )}

            <div className="pt-4 border-t space-y-4">
              <input type="color" value={cor} onChange={e => setCor(e.target.value)} className="w-full h-8 cursor-pointer rounded-lg bg-transparent border-none shadow-sm" />
              <button onClick={download} className="w-full bg-red-900 text-white py-4 rounded-full font-black uppercase text-xs shadow-lg active:scale-95 transition-all">BAIXAR PNG</button>
            </div>
          </section>

          <section className="flex-1 flex justify-center sticky top-8">
            <div ref={cardRef} className="bg-white p-2 shadow-2xl rounded-sm">
              {modo === 'manual' ? (
                <VagaCard titulo={titulo} nomeEmpresa={empresa} subtitulo={subtitulo} requisitos={requisitos.split("\n")} emailContato={email} logoUrl={logoManual} imagemUrl={fotoManual} corPrincipal={cor} />
              ) : (
                <SocialCard
                  saudacao={saudacao} frase={fraseSocial} corPrincipal={cor} logoMarca={logoManual}
                  fonteFrase={fonteFrase} fonteSaudacao={fonteSaudacao}
                  corFonteSaudacao={corFonteS} corFonteFrase={corFonteF}
                  mostrarFundoSaudacao={fundoS} tamanhoSaudacao={tamS} xSaudacao={xS} ySaudacao={yS}
                  tamanhoFrase={tamF} xFrase={xF} yFrase={yF}
                  imagemFundo={fotoSocial} opacidadeFundo={opacidadeS} blurFundo={blurS}
                  sombraS={sombraS} sombraF={sombraF}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}